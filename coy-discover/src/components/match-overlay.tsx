"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { ProfilePhoto } from "@/components/profile-photo";
import type { ProfileCard } from "@/types/discover";

export function MatchOverlay({
  matchedProfile,
  onClose,
}: {
  matchedProfile: ProfileCard | null;
  onClose: () => void;
}) {
  const [myProfile, setMyProfile] = useState<ProfileCard | null>(null);

  useEffect(() => {
    if (!matchedProfile) return;
    void fetch("/api/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const data: { profile: ProfileCard } = await response.json();
        setMyProfile(data.profile);
      })
      .catch(() => undefined);
  }, [matchedProfile]);

  useEffect(() => {
    if (!matchedProfile) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [matchedProfile, onClose]);

  return (
    <AnimatePresence>
      {matchedProfile ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="match-backdrop"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            aria-labelledby="match-title"
            aria-modal="true"
            className="match-dialog"
            initial={{ opacity: 0, scale: 0.85, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <button
              aria-label="Close match celebration"
              className="match-close"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" size={20} />
            </button>
            <div aria-hidden="true" className="confetti-field">
              {Array.from({ length: 28 }, (_, index) => (
                <span
                  className={`confetti confetti-${index % 7}`}
                  key={index}
                  style={{
                    left: `${(index * 37 + 9) % 100}%`,
                    animationDelay: `${(index % 9) * 0.11}s`,
                  }}
                />
              ))}
            </div>
            <div className="match-sparkle">
              <Icon name="sparkles" size={24} />
            </div>
            <p className="match-eyebrow">IT’S MUTUAL · CONNECTION UNLOCKED</p>
            <h2 id="match-title">It&apos;s a Match!</h2>
            <p className="match-subtitle">
              You and <strong>{matchedProfile.name}</strong> liked each other.
            </p>

            <div className="match-avatars">
              <motion.div
                animate={{ x: 0, opacity: 1, rotate: -7 }}
                className="match-avatar match-avatar-you"
                initial={{ x: -45, opacity: 0, rotate: -17 }}
                transition={{ delay: 0.12, type: "spring", stiffness: 220 }}
              >
                {myProfile ? (
                  <ProfilePhoto
                    alt="Your profile"
                    name={myProfile.name}
                    photo={myProfile.photo}
                  />
                ) : (
                  <div className="you-avatar-fallback">YOU</div>
                )}
              </motion.div>
              <span aria-hidden="true" className="match-heart">
                <Icon name="heart" size={24} />
              </span>
              <motion.div
                animate={{ x: 0, opacity: 1, rotate: 7 }}
                className="match-avatar match-avatar-them"
                initial={{ x: 45, opacity: 0, rotate: 17 }}
                transition={{ delay: 0.18, type: "spring", stiffness: 220 }}
              >
                <ProfilePhoto
                  alt={matchedProfile.name}
                  name={matchedProfile.name}
                  photo={matchedProfile.photo}
                />
              </motion.div>
            </div>

            <div className="match-actions-group">
              <button className="match-continue" onClick={onClose} type="button">
                <span>Keep Discovering</span>
                <span className="match-btn-icon">
                  <Icon name="arrow-right" size={18} />
                </span>
              </button>
              <Link className="match-secondary-btn" href="/matches" onClick={onClose}>
                <Icon name="message" size={16} />
                <span>View in Matches</span>
              </Link>
            </div>

            <p className="match-privacy">
              <Icon name="shield" size={14} />
              End-to-end private. Only you two know about this connection.
            </p>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
