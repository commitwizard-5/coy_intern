import type { Prisma } from "@prisma/client";

export const profileCardSelect = {
  id: true,
  name: true,
  age: true,
  photo: true,
  bio: true,
  city: true,
  college: true,
  interests: true,
} satisfies Prisma.ProfileSelect;

export type ProfileCardRecord = Prisma.ProfileGetPayload<{
  select: typeof profileCardSelect;
}>;

export type ProfileCardDto = Omit<ProfileCardRecord, "interests"> & {
  interests: string[];
};

export function toProfileCardDto(profile: ProfileCardRecord): ProfileCardDto {
  return {
    id: profile.id,
    name: profile.name,
    age: profile.age,
    photo: profile.photo,
    bio: profile.bio,
    city: profile.city,
    college: profile.college,
    interests: profile.interests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean),
  };
}
