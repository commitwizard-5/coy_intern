export type ProfileCard = {
  id: number;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string | null;
  interests: string[];
};

export type FeedResponse = {
  profiles: ProfileCard[];
  remaining: number;
  pagination: {
    limit: number;
    offset: number;
    nextOffset: number | null;
    hasMore: boolean;
  };
};

export type SwipeResponse = {
  match: boolean;
  matchedProfile: ProfileCard | null;
};

export type MatchProfile = ProfileCard & {
  matchedAt: string;
};
