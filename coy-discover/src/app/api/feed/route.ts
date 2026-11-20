import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import {
  toProfileCardDto,
  type ProfileCardRecord,
} from "@/lib/profile-dto";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MAX_OFFSET = 10_000;
const RANDOM_MODULUS = 2_147_483_647;

type FeedProfileRow = ProfileCardRecord & {
  position: bigint;
};

function parseIntegerParameter(
  value: string | null,
  defaultValue: number,
  minimum: number,
  maximum: number
): number | null {
  if (value === null) {
    return defaultValue;
  }

  if (!/^(0|[1-9]\d*)$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitValues = searchParams.getAll("limit");
  const offsetValues = searchParams.getAll("offset");

  if (limitValues.length > 1 || offsetValues.length > 1) {
    return NextResponse.json(
      { error: "Provide limit and offset at most once." },
      { status: 400 }
    );
  }

  const limit = parseIntegerParameter(
    limitValues[0] ?? null,
    DEFAULT_LIMIT,
    1,
    MAX_LIMIT
  );
  const offset = parseIntegerParameter(
    offsetValues[0] ?? null,
    0,
    0,
    MAX_OFFSET
  );

  if (limit === null || offset === null) {
    return NextResponse.json(
      {
        error: `limit must be 1-${MAX_LIMIT}; offset must be 0-${MAX_OFFSET}.`,
      },
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

    // The per-user ordering stays stable between requests, unlike ORDER BY RANDOM().
    const seed = createHash("sha256")
      .update(`coy-discover-feed:${currentUserId}`)
      .digest();
    const multiplier =
      (seed.readUInt32BE(0) % (RANDOM_MODULUS - 1)) + 1;
    const randomOffset = seed.readUInt32BE(4) % RANDOM_MODULUS;

    const [profileRows, remaining] = await Promise.all([
      prisma.$queryRaw<FeedProfileRow[]>`
        WITH ranked_profiles AS (
          SELECT
            p."id",
            p."name",
            p."age",
            p."photo",
            p."bio",
            p."city",
            p."college",
            p."interests",
            ROW_NUMBER() OVER (
              ORDER BY
                (((p."id" % ${RANDOM_MODULUS}) * ${multiplier} + ${randomOffset}) % ${RANDOM_MODULUS}),
                p."id"
            ) - 1 AS "position"
          FROM "Profile" AS p
          WHERE p."isCurrentUser" = 0
        )
        SELECT
          p."id",
          p."name",
          p."age",
          p."photo",
          p."bio",
          p."city",
          p."college",
          p."interests",
          p."position"
        FROM ranked_profiles AS p
        WHERE p."position" >= ${offset}
          AND NOT EXISTS (
            SELECT 1
            FROM "Swipe" AS s
            WHERE s."swiperId" = ${currentUserId}
              AND s."swipedId" = p."id"
          )
        ORDER BY p."position"
        LIMIT ${limit + 1}
      `,
      prisma.profile.count({
        where: {
          isCurrentUser: false,
          swipesReceived: {
            none: { swiperId: currentUserId },
          },
        },
      }),
    ]);

    const pageRows = profileRows.slice(0, limit);
    const profiles = pageRows.map(toProfileCardDto);
    const lastProfile = pageRows[pageRows.length - 1];

    return NextResponse.json({
      profiles,
      remaining,
      pagination: {
        limit,
        offset,
        nextOffset: lastProfile ? Number(lastProfile.position) + 1 : null,
        hasMore: profileRows.length > limit,
      },
    });
  } catch (error) {
    console.error("GET /api/feed failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const currentUserId = await getCurrentUserId();
    if (currentUserId === null) {
      return NextResponse.json(
        { error: "No current user is configured." },
        { status: 500 }
      );
    }

    await prisma.$transaction([
      prisma.match.deleteMany({
        where: {
          OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }],
        },
      }),
      prisma.swipe.deleteMany({
        where: {
          swiperId: currentUserId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Swipes reset successfully.",
    });
  } catch (error) {
    console.error("POST /api/feed failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
