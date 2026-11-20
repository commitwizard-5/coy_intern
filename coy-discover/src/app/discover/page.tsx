"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { MatchOverlay } from "@/components/match-overlay";
import { DiscoverSkeleton } from "@/components/loading-skeleton";
import { ProfilePhoto } from "@/components/profile-photo";
import {
  SwipeCard,
  type SwipeAction,
  type SwipeCardHandle,
} from "@/components/swipe-card";
import type { FeedResponse, ProfileCard, SwipeResponse } from "@/types/discover";

const PAGE_SIZE = 10;

async function getErrorMessage(response: Response) {
  try {
    const body: { error?: string } = await response.json();
    return body.error ?? "The request could not be completed.";
  } catch {
    return "The request could not be completed.";
  }
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<ProfileCard | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const nextOffset = useRef<number | null>(0);
  const loadingRef = useRef(false);
  const cardRef = useRef<SwipeCardHandle>(null);

  const fetchPage = useCallback(async (offset: number, replace: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setError(null);
    if (replace) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response = await fetch(
        `/api/feed?limit=${PAGE_SIZE}&offset=${offset}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const result: FeedResponse = await response.json();
      setProfiles((current) => {
        if (replace) return result.profiles;
        const existingIds = new Set(current.map((profile) => profile.id));
        return [
          ...current,
          ...result.profiles.filter((profile) => !existingIds.has(profile.id)),
        ];
      });
      setRemaining(result.remaining);
      nextOffset.current = result.pagination.nextOffset;
      setHasMore(
        result.pagination.hasMore && result.pagination.nextOffset !== null
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load profiles. Please try again."
      );
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchPage(0, true), 0);
    return () => window.clearTimeout(timer);
  }, [fetchPage]);

  useEffect(() => {
    if (
      !isLoading &&
      profiles.length <= 2 &&
      hasMore &&
      !loadingRef.current &&
      nextOffset.current !== null
    ) {
      void fetchPage(nextOffset.current, false);
    }
  }, [fetchPage, hasMore, isLoading, profiles.length]);

  const handleSwipe = useCallback(
    async (action: SwipeAction): Promise<boolean> => {
      const profile = profiles[0];
      if (!profile) {
        setIsSwiping(false);
        return false;
      }

      try {
        const response = await fetch("/api/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: profile.id, action }),
        });
        if (!response.ok) {
          throw new Error(await getErrorMessage(response));
        }

        const result: SwipeResponse = await response.json();
        setProfiles((current) =>
          current.filter((candidate) => candidate.id !== profile.id)
        );
        setRemaining((current) => Math.max(0, current - 1));
        setIsSwiping(false);

        if (result.match && result.matchedProfile) {
          setMatchedProfile(result.matchedProfile);
          window.dispatchEvent(new Event("coy:matches-updated"));
          if ("vibrate" in navigator) navigator.vibrate(140);
        }
        return true;
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Your swipe could not be saved. Try again."
        );
        setIsSwiping(false);
        return false;
      }
    },
    [profiles]
  );

  const startSwipe = useCallback(() => {
    setError(null);
    setIsSwiping(true);
  }, []);

  const handleResetFeed = useCallback(async () => {
    setIsResetting(true);
    setError(null);
    try {
      const response = await fetch("/api/feed", { method: "POST" });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }
      nextOffset.current = 0;
      await fetchPage(0, true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset feed."
      );
    } finally {
      setIsResetting(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        matchedProfile ||
        isSwiping ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        cardRef.current?.swipe("PASS");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        cardRef.current?.swipe("LIKE");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSwiping, matchedProfile]);

  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  return (
    <section className="page-content discover-page">
      <div className="section-heading discover-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            A LITTLE CLOSER
          </p>
          <h1>
            Find your <span>kind of people.</span>
          </h1>
          <p className="section-description">
            No pressure. Just people you might be glad you met.
          </p>
        </div>
        <div className="remaining-pill">
          <span className="remaining-sparkle">
            <Icon name="sparkles" size={15} />
          </span>
          {remaining} {remaining === 1 ? "person" : "people"} to discover
        </div>
      </div>

      {error && !currentProfile && !isLoading ? (
        <div className="state-card error-card">
          <span className="state-icon state-icon-error">
            <Icon name="refresh" size={22} />
          </span>
          <h2>Couldn&apos;t load your people</h2>
          <p>{error}</p>
          <button
            className="secondary-button"
            onClick={() => void fetchPage(0, true)}
            type="button"
          >
            <Icon name="refresh" size={17} />
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <DiscoverSkeleton />
      ) : currentProfile ? (
        <>
          <div className="swipe-stage">
            {nextProfile ? (
              <div aria-hidden="true" className="swipe-card-preview">
                <ProfilePhoto
                  name={nextProfile.name}
                  photo={nextProfile.photo}
                />
              </div>
            ) : null}
            <SwipeCard
              key={currentProfile.id}
              onSwipe={handleSwipe}
              onSwipeStart={startSwipe}
              profile={currentProfile}
              ref={cardRef}
            />
            {isSwiping ? (
              <div aria-live="polite" className="saving-indicator">
                <span className="mini-spinner" />
                Saving your choice
              </div>
            ) : null}
          </div>

          <div aria-label="Profile actions" className="swipe-actions">
            <div className="action-group">
              <button
                aria-label="Pass on this profile"
                className="action-button action-pass"
                disabled={isSwiping}
                onClick={() => cardRef.current?.swipe("PASS")}
                title="Pass (←)"
                type="button"
              >
                <Icon name="close" size={25} />
              </button>
              <span className="action-hint">pass</span>
            </div>
            <div className="action-group">
              <button
                aria-label="Like this profile"
                className="action-button action-like"
                disabled={isSwiping}
                onClick={() => cardRef.current?.swipe("LIKE")}
                title="Like (→)"
                type="button"
              >
                <Icon name="heart" size={25} />
              </button>
              <span className="action-hint">like</span>
            </div>
          </div>

          <div className="swipe-helper">
            <span className="helper-arrow">←</span>
            <span>Drag a card or use the buttons</span>
            <span className="helper-arrow">→</span>
          </div>

          {error ? (
            <p aria-live="polite" className="inline-error">
              {error}
            </p>
          ) : null}
          {isLoadingMore ? (
            <p aria-live="polite" className="loading-more">
              <span className="mini-spinner" />
              Finding more people…
            </p>
          ) : null}
        </>
      ) : (
        <div className="state-card empty-discover">
          <div className="empty-orbit empty-orbit-one" />
          <div className="empty-orbit empty-orbit-two" />
          <span className="state-icon state-icon-empty">
            <Icon name="sparkles" size={25} />
          </span>
          <p className="eyebrow">YOU&apos;RE ALL CAUGHT UP</p>
          <h2>No new faces for now.</h2>
          <p>
            You&apos;ve met everyone in this round. Come back soon and see who
            else joins Coy.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {hasMore ? (
              <button
                className="secondary-button"
                disabled={isLoadingMore}
                onClick={() =>
                  nextOffset.current !== null &&
                  void fetchPage(nextOffset.current, false)
                }
                type="button"
              >
                <Icon name="refresh" size={17} />
                {isLoadingMore ? "Loading…" : "Load more"}
              </button>
            ) : null}
            <button
              className="secondary-button"
              disabled={isResetting || isLoading}
              onClick={() => void handleResetFeed()}
              type="button"
            >
              <Icon name="refresh" size={17} />
              {isResetting ? "Resetting…" : "Reset & Swipe Again"}
            </button>
          </div>
        </div>
      )}

      <MatchOverlay
        matchedProfile={matchedProfile}
        onClose={() => setMatchedProfile(null)}
      />
    </section>
  );
}
