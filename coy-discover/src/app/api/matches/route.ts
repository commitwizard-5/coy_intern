import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { profileCardSelect, toProfileCardDto } from "@/lib/profile-dto";

export async function GET() {
  try {
    const currentUserId = await getCurrentUserId();
    if (currentUserId === null) {
      return NextResponse.json(
        { error: "No current user is configured." },
        { status: 500 }
      );
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }],
      },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
        matchedAt: true,
        user1: { select: profileCardSelect },
        user2: { select: profileCardSelect },
      },
      orderBy: [{ matchedAt: "desc" }, { id: "desc" }],
    });

    const profiles = matches.map((match) => {
      const otherProfile =
        match.user1Id === currentUserId ? match.user2 : match.user1;

      return {
        ...toProfileCardDto(otherProfile),
        matchedAt: match.matchedAt,
      };
    });

    return NextResponse.json({ matches: profiles });
  } catch (error) {
    console.error("GET /api/matches failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
