import "server-only";

import { prisma } from "@/lib/prisma";

export async function getCurrentUserId(): Promise<number | null> {
  const currentUsers = await prisma.profile.findMany({
    where: { isCurrentUser: true },
    select: { id: true },
    take: 2,
  });

  if (currentUsers.length > 1) {
    throw new Error("More than one profile is marked as the current user.");
  }

  return currentUsers[0]?.id ?? null;
}
