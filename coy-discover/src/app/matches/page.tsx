"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { MatchesSkeleton } from "@/components/loading-skeleton";
import { ProfilePhoto } from "@/components/profile-photo";
import type { MatchProfile } from "@/types/discover";

function matchedAgo(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (elapsedMinutes < 60) return formatter.format(-elapsedMinutes, "minute");
  const hours = Math.floor(elapsedMinutes / 60);
  if (hours < 24) return formatter.format(-hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 30) return formatter.format(-days, "day");
  const months = Math.floor(days / 30);
  if (months < 12) return formatter.format(-months, "month");
  return formatter.format(-Math.floor(months / 12), "year");
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/matches", { cache: "no-store" });
      if (!response.ok) {
        const body: { error?: string } = await response.json();
        throw new Error(body.error ?? "Could not load matches.");
      }
      const result: { matches: MatchProfile[] } = await response.json();
      setMatches(result.matches);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load your matches."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMatches(), 0);
    return () => window.clearTimeout(timer);
  }, [loadMatches]);

  return (
    <section className="page-content matches-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            THE GOOD PART
          </p>
          <h1>
            Your <span>connections.</span>
          </h1>
          <p className="section-description">
            Mutual likes, kept between you.
          </p>
        </div>
        {!isLoading && !error ? (
          <div className="match-count-pill">
            <Icon name="heart" size={15} />
            {matches.length} {matches.length === 1 ? "match" : "matches"}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <MatchesSkeleton />
      ) : error ? (
        <div className="state-card compact-state">
          <span className="state-icon state-icon-error">
            <Icon name="refresh" size={22} />
          </span>
          <h2>Matches didn&apos;t load</h2>
          <p>{error}</p>
          <button
            className="secondary-button"
            onClick={() => void loadMatches()}
            type="button"
          >
            <Icon name="refresh" size={17} />
            Try again
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="state-card compact-state empty-matches">
          <span className="state-icon state-icon-empty">
            <Icon name="heart" size={23} />
          </span>
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h2>No matches just yet.</h2>
          <p>
            A match happens when you both like each other. Your likes stay
            private until then.
          </p>
          <Link className="primary-link-button" href="/discover">
            Meet someone new
            <Icon name="arrow-right" size={17} />
          </Link>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match, index) => (
            <article
              className="match-card"
              key={match.id}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <div className="match-card-photo">
                <ProfilePhoto
                  alt={match.name}
                  name={match.name}
                  photo={match.photo}
                />
                <div className="match-card-shade" />
                <span aria-label="Mutual match" className="mutual-heart">
                  <Icon name="heart" size={17} />
                </span>
                <div className="match-card-caption">
                  <h2>
                    {match.name}, <span>{match.age}</span>
                  </h2>
                  <p>
                    <Icon name="pin" size={14} />
                    {match.city}
                  </p>
                </div>
              </div>
              <div className="match-card-info">
                {match.college ? <span>{match.college}</span> : <span>Coy community</span>}
                <time dateTime={match.matchedAt}>
                  Matched {matchedAgo(match.matchedAt)}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="matches-privacy-note">
        <Icon name="shield" size={15} />
        One-sided likes are never shown here.
      </div>
    </section>
  );
}
