import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { checkSwipeRateLimit } from "@/lib/rate-limiter";
import {
  profileCardSelect,
  toProfileCardDto,
} from "@/lib/profile-dto";

type SwipeAction = "LIKE" | "PASS";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rateLimit = checkSwipeRateLimit(`swipe:${clientIp}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many swipe requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const profileId = body.profileId;
  const action = body.action;

  if (
    typeof profileId !== "number" ||
    !Number.isSafeInteger(profileId) ||
    profileId < 1
  ) {
    return NextResponse.json(
      { error: "profileId must be a positive integer." },
      { status: 400 }
    );
  }

  if (action !== "LIKE" && action !== "PASS") {
    return NextResponse.json(
      { error: "action must be LIKE or PASS." },
      { status: 400 }
    );
  }

  try {
    const currentUserId = await getCurrentUserId();
    if (currentUserId === null) {
      return NextResponse.json(
        { error: "No current user is configured." },
        { status: 500 }
      );
    }

    if (profileId === currentUserId) {
      return NextResponse.json(
        { error: "Cannot swipe on yourself." },
        { status: 400 }
      );
    }

    const targetProfile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        ...profileCardSelect,
        isCurrentUser: true,
      },
    });

    if (!targetProfile || targetProfile.isCurrentUser) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    const outcome = await prisma.$transaction(async (transaction) => {
      const existingSwipe = await transaction.swipe.findUnique({
        where: {
          swiperId_swipedId: {
            swiperId: currentUserId,
            swipedId: profileId,
          },
        },
        select: { id: true },
      });

      if (existingSwipe) {
        return { kind: "duplicate" as const };
      }

      await transaction.swipe.create({
        data: {
          swiperId: currentUserId,
          swipedId: profileId,
          action: action satisfies SwipeAction,
        },
      });

      let matchedProfile = null;
      if (action === "LIKE") {
        const reverseSwipe = await transaction.swipe.findUnique({
          where: {
            swiperId_swipedId: {
              swiperId: profileId,
              swipedId: currentUserId,
            },
          },
          select: { action: true },
        });

        if (reverseSwipe?.action === "LIKE") {
          const user1Id = Math.min(currentUserId, profileId);
          const user2Id = Math.max(currentUserId, profileId);

          await transaction.match.upsert({
            where: {
              user1Id_user2Id: { user1Id, user2Id },
            },
            create: { user1Id, user2Id },
            update: {},
          });
          matchedProfile = toProfileCardDto(targetProfile);
        }
      }

      return { kind: "recorded" as const, matchedProfile };
    });

    if (outcome.kind === "duplicate") {
      return NextResponse.json(
        { error: "Already swiped on this profile." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        match: outcome.matchedProfile !== null,
        matchedProfile: outcome.matchedProfile,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Already swiped on this profile." },
        { status: 409 }
      );
    }

    console.error("POST /api/swipe failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
