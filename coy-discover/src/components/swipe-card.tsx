"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Icon } from "@/components/icon";
import { ProfilePhoto } from "@/components/profile-photo";
import type { ProfileCard } from "@/types/discover";

export type SwipeAction = "LIKE" | "PASS";
export type SwipeCardHandle = {
  swipe: (action: SwipeAction) => void;
};

const interestEmoji: Record<string, string> = {
  art: "🎨",
  bollywood: "🎬",
  chai: "🍵",
  coffee: "☕",
  cooking: "🍳",
  cricket: "🏏",
  dance: "💃",
  fitness: "🏋️",
  food: "🍜",
  guitar: "🎸",
  hiking: "🥾",
  music: "🎵",
  photography: "📸",
  reading: "📚",
  travel: "✈️",
  yoga: "🧘",
};

export const SwipeCard = forwardRef<
  SwipeCardHandle,
  {
    profile: ProfileCard;
    isTop?: boolean;
    onSwipeStart: () => void;
    onSwipe: (action: SwipeAction) => Promise<boolean>;
  }
>(function SwipeCard({ profile, isTop = true, onSwipeStart, onSwipe }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-360, 360], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 125], [0, 1]);
  const passOpacity = useTransform(x, [-125, -20], [1, 0]);
  const leavingRef = useRef(false);

  const commitSwipe = useCallback(
    async (action: SwipeAction) => {
      if (leavingRef.current) return;
      leavingRef.current = true;
      onSwipeStart();

      await animate(
        x,
        action === "LIKE" ? window.innerWidth + 420 : -window.innerWidth - 420,
        { duration: 0.28, ease: [0.2, 0.75, 0.3, 1] }
      );

      const saved = await onSwipe(action);
      if (!saved) {
        await animate(x, 0, {
          type: "spring",
          stiffness: 280,
          damping: 24,
        });
        leavingRef.current = false;
      }
    },
    [onSwipe, onSwipeStart, x]
  );

  useImperativeHandle(
    ref,
    () => ({
      swipe: (action) => void commitSwipe(action),
    }),
    [commitSwipe]
  );

  function onDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) {
    if (info.offset.x > 105 || info.velocity.x > 650) {
      void commitSwipe("LIKE");
    } else if (info.offset.x < -105 || info.velocity.x < -650) {
      void commitSwipe("PASS");
    } else {
      void animate(x, 0, { type: "spring", stiffness: 300, damping: 22 });
    }
  }

  return (
    <motion.article
      aria-label={`${profile.name}, ${profile.age}`}
      className={`swipe-card ${isTop ? "swipe-card-top" : ""}`}
      drag={isTop ? "x" : false}
      dragElastic={0.76}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      style={{ x, rotate, touchAction: "none" }}
    >
      <div className="swipe-card-photo">
        <ProfilePhoto
          alt={`${profile.name}, ${profile.age}`}
          name={profile.name}
          photo={profile.photo}
          priority={isTop}
        />
        <div className="photo-shade" />
        <motion.div
          aria-hidden="true"
          className="swipe-stamp swipe-stamp-like"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="swipe-stamp swipe-stamp-pass"
          style={{ opacity: passOpacity }}
        >
          PASS
        </motion.div>
        <div className="profile-caption">
          <div className="profile-kicker">
            <span className="online-dot" />
            COY COMMUNITY
          </div>
          <h2>
            {profile.name}, <span>{profile.age}</span>
          </h2>
          <p className="profile-location">
            <Icon name="pin" size={15} />
            {profile.city}
            {profile.college ? <span className="location-separator">·</span> : null}
            {profile.college}
          </p>
        </div>
      </div>

      <div className="swipe-card-details">
        <p className="profile-bio">{profile.bio}</p>
        <div aria-label="Interests" className="interest-list">
          {profile.interests.slice(0, 4).map((interest) => (
            <span className="interest-chip" key={interest}>
              <span>{interestEmoji[interest.toLowerCase()] ?? "✦"}</span>
              {interest.replaceAll("-", " ")}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
});
