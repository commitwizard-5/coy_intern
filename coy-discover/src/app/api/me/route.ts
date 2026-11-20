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

    const profile = await prisma.profile.findUnique({
      where: { id: currentUserId },
      select: profileCardSelect,
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Current user profile not found." },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: toProfileCardDto(profile) });
  } catch (error) {
    console.error("GET /api/me failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
