"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icon";

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/discover", label: "Discover", icon: "compass" },
  { href: "/matches", label: "Matches", icon: "message" },
];

export function TabBar() {
  const pathname = usePathname();
  const [matchCount, setMatchCount] = useState(0);

  const refreshMatches = useCallback(async () => {
    try {
      const response = await fetch("/api/matches", { cache: "no-store" });
      if (!response.ok) return;
      const data: { matches: unknown[] } = await response.json();
      setMatchCount(data.matches.length);
    } catch {
      // The navigation remains usable if the optional count request fails.
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshMatches(), 0);
    window.addEventListener("coy:matches-updated", refreshMatches);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("coy:matches-updated", refreshMatches);
    };
  }, [refreshMatches]);

  return (
    <nav aria-label="Main navigation" className="tab-bar">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`tab-link ${active ? "tab-link-active" : ""}`}
            href={tab.href}
            key={tab.href}
          >
            <span className="tab-icon-wrap">
              <Icon name={tab.icon} size={20} />
              {tab.href === "/matches" && matchCount > 0 ? (
                <span aria-label={`${matchCount} matches`} className="tab-badge">
                  {matchCount > 9 ? "9+" : matchCount}
                </span>
              ) : null}
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
