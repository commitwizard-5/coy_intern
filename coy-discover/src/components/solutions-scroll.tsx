"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";

interface SolutionItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  roleFeature: string;
  specs: { label: string; value: string }[];
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  cubeColor: { primary: string; secondary: string; glow: string };
}

const solutionsData: SolutionItem[] = [
  {
    id: "solution-discover",
    number: "01",
    title: "Swipe Discovery Engine",
    subtitle: "PART B · INTERACTION ARCHITECTURE",
    description:
      "Fluid 60 FPS mobile drag physics, spring dampers, and desktop keyboard shortcuts. Evaluates likes/passes with transactional consistency so a seen profile never reappears.",
    badge: "MOBILE-FIRST UX",
    roleFeature: "60 FPS Gesture Engine & Feed Algorithm",
    specs: [
      { label: "GESTURES", value: "Framer Motion Drag" },
      { label: "FRAME RATE", value: "60 FPS Hardware Accel" },
      { label: "FEED BUFFER", value: "Automatic Pagination" },
    ],
    primaryCta: { text: "TRY DISCOVER FEED", href: "/discover" },
    secondaryCta: { text: "VIEW MATCHES", href: "/matches" },
    cubeColor: {
      primary: "#26F4D0",
      secondary: "#724CE8",
      glow: "rgba(38, 244, 208, 0.4)",
    },
  },
  {
    id: "solution-zk-vault",
    number: "02",
    title: "Zero-Knowledge Crush Vault",
    subtitle: "PART A · PROPOSED FEATURE 1",
    description:
      "Coy's core promise is zero unilateral disclosure. Our cryptographic architecture stores salted HMAC hashes of contact numbers, guaranteeing that even database breaches cannot reveal secret crushes.",
    badge: "CRYPTOGRAPHIC PRIVACY",
    roleFeature: "Cryptographic HMAC-SHA256 Blind Handshake",
    specs: [
      { label: "HASH ALGO", value: "HMAC-SHA256 + Pepper" },
      { label: "TIMING ATTACK", value: "Constant-Time Compare" },
      { label: "LEAK RISK", value: "0.00% Proven" },
    ],
    primaryCta: { text: "READ FEATURE SPEC", href: "#proposed-features" },
    secondaryCta: { text: "TRY DISCOVER", href: "/discover" },
    cubeColor: {
      primary: "#724CE8",
      secondary: "#26F4D0",
      glow: "rgba(114, 76, 232, 0.4)",
    },
  },
  {
    id: "solution-campus",
    number: "03",
    title: "Campus Micro-Cohorts Radar",
    subtitle: "PART A · PROPOSED FEATURE 2",
    description:
      "Eliminates the 'unknown phone number' barrier. Allows students to verify via .edu domain, explore campus interest clusters, and connect without awkwardness or phone number requirements.",
    badge: "VIRAL GROWTH ENGINE",
    roleFeature: "Campus Verification & Spatial Clustering",
    specs: [
      { label: "DOMAIN AUTH", value: "Institutional Email OTP" },
      { label: "DISCOVERY", value: "Vibe & Major Clusters" },
      { label: "SAFETY", value: "Zero Public Profiles" },
    ],
    primaryCta: { text: "READ CAMPUS SPEC", href: "#proposed-features" },
    secondaryCta: { text: "EXPLORE APP", href: "/home" },
    cubeColor: {
      primary: "#F8CF3E",
      secondary: "#FC6756",
      glow: "rgba(248, 207, 62, 0.4)",
    },
  },
  {
    id: "solution-backend",
    number: "04",
    title: "Node.js Transactional Core",
    subtitle: "BACKEND & DATA INTEGRITY",
    description:
      "Robust Node.js route handlers with Prisma and SQLite. Swipes and mutual matches execute in single atomic transactions, with rate limiters and strict DTO projection to prevent privacy leakage.",
    badge: "NODE.JS / PRISMA",
    roleFeature: "Atomic prisma.$transaction & Rate Limiting",
    specs: [
      { label: "TRANSACTIONS", value: "Atomic prisma.$transaction" },
      { label: "RATE LIMITING", value: "Token Bucket Memory" },
      { label: "PERSISTENCE", value: "Persistent SQLite" },
    ],
    primaryCta: { text: "SEE CODE ON GITHUB", href: "https://github.com/commitwizard-5" },
    secondaryCta: { text: "LAUNCH APP", href: "/discover" },
    cubeColor: {
      primary: "#FC6756",
      secondary: "#F8CF3E",
      glow: "rgba(252, 103, 86, 0.4)",
    },
  },
];

export function SolutionsScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const viewportCenter = window.innerHeight * 0.48;

      let closestIndex = 0;
      let minDistance = Infinity;

      rowRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeSolution = solutionsData[activeIndex] ?? solutionsData[0];

  return (
    <section id="solutions" className="chaingpt-solutions-section">
      <svg width="0" height="0" className="sr-only">
        <defs>
          <linearGradient id="chaingpt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="-2.59%" stopColor="#724CE8" />
            <stop offset="31.53%" stopColor="#26F4D0" />
            <stop offset="62.52%" stopColor="#F8CF3E" />
            <stop offset="100%" stopColor="#FC6756" />
          </linearGradient>
        </defs>
      </svg>

      <div className="solutions-container">
        {/* Section Header with ChainGPT Sci-Fi HUD Decor */}
        <div className="solutions-head">
          <div className="solutions-head-decor">
            <span className="decor-line decor-line-left" />
            <div className="decor-bracket">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 9V1H9" stroke="url(#chaingpt-grad)" strokeWidth="1.5" />
              </svg>
              <span className="decor-text">ENGINEERING & PRODUCT ARCHITECTURE</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M9 1V9H1" stroke="url(#chaingpt-grad)" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="decor-line decor-line-right" />
          </div>

          <h2 className="solutions-title">
            Core Technical <span>Solutions</span>
          </h2>
          <p className="solutions-subtitle">
            How the Discover tab and proposed Coy enhancements are engineered for rock-solid privacy,
            fault-tolerant Node.js transactions, and frictionless consumer retention.
          </p>
        </div>

        {/* 3-Column Sticky-Scrub Architecture */}
        <div className="solutions-list-wrap">
          {/* Middle Column Sticky Visual Track (Pins in viewport as rows scroll past) */}
          <div className="solutions-sticky-track">
            <div className="solutions-sticky-inner">
              {/* Holographic 3D Interactive Frame */}
              <div
                className="solutions-3d-box"
                style={{
                  background: "transparent",
                  boxShadow: `0 0 35px ${activeSolution.cubeColor.glow}`,
                }}
              >
                {/* HUD Overlay Scan Lines & Grids */}
                <div className="cube-scanlines" />
                <div className="cube-ambient-aura" style={{ background: activeSolution.cubeColor.glow }} />

                {/* 3D Holographic GitHub Logo Centerpiece (Angle changes dynamically on scroll) */}
                <a
                  href="https://github.com/commitwizard-5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-scroll-showcase"
                  title="Visit commitwizard-5 on GitHub: github.com/commitwizard-5"
                >
                  {/* Cyberpunk Concentric Rotating Rings */}
                  <div
                    className="github-cyber-orbit orbit-outer"
                    style={{
                      borderColor: activeSolution.cubeColor.primary,
                      transform: `rotate(${scrollY * 0.18}deg)`,
                    }}
                  />
                  <div
                    className="github-cyber-orbit orbit-inner"
                    style={{
                      borderColor: activeSolution.cubeColor.secondary,
                      transform: `rotate(-${scrollY * 0.28}deg)`,
                    }}
                  />

                  {/* 3D Angle-Changing GitHub Logo */}
                  <div
                    className="github-3d-logo-wrap"
                    style={{
                      transform: `perspective(700px) rotateY(${(scrollY * 0.35) % 360}deg) rotateX(${Math.sin(scrollY * 0.005) * 20}deg) rotateZ(${Math.cos(scrollY * 0.003) * 8}deg)`,
                      filter: `drop-shadow(0 0 25px ${activeSolution.cubeColor.glow})`,
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="96"
                      height="96"
                      className="github-3d-svg"
                      fill="url(#chaingpt-grad)"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                    </svg>
                  </div>

                  <div className="github-handle-badge">
                    <span className="github-handle-dot" style={{ background: activeSolution.cubeColor.primary }} />
                    <span>@commitwizard-5</span>
                  </div>
                </a>

                {/* Technical HUD Live Diagnostics */}
                <div className="cube-hud-meta">
                  <div className="cube-hud-row">
                    <span className="cube-hud-label">ROLE FOCUS</span>
                    <span className="cube-hud-val">SDE Intern (Node.js)</span>
                  </div>
                  <div className="cube-hud-row">
                    <span className="cube-hud-label">ROLE FEATURE</span>
                    <span className="cube-hud-val gradient-text">{activeSolution.roleFeature}</span>
                  </div>
                  <div className="cube-hud-row">
                    <span className="cube-hud-label">MODULE</span>
                    <span className="cube-hud-val">NODE_{activeSolution.number} [ACTIVE]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solutions Rows List */}
          <div className="solutions-rows">
            {solutionsData.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  id={item.id}
                  key={item.id}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className={`solutions-row ${isActive ? "solutions-row--active" : "solutions-row--inactive"}`}
                >
                  <div className="solutions-cols">
                    {/* Left Column: Number + Title + Description */}
                    <div className="solutions-col solutions-col--left">
                      <div className="solutions-row-header">
                        {/* Sci-Fi Bracketed Corner Number */}
                        <div className="nb-default">
                          <svg className="corner-top-left" width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 7V1H7" stroke="url(#chaingpt-grad)" strokeWidth="1.5" />
                          </svg>
                          <span className="nb-text">{item.number}</span>
                          <svg className="corner-bottom-right" width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M7 1V7H1" stroke="url(#chaingpt-grad)" strokeWidth="1.5" />
                          </svg>
                        </div>

                        <div className="solutions-title-group">
                          <span className="solutions-kicker">{item.subtitle}</span>
                          <h3 className="solutions-row-title">{item.title}</h3>
                        </div>
                      </div>

                      <p className="solutions-row-descr">{item.description}</p>
                    </div>

                    {/* Middle Column Spacer */}
                    <div className="solutions-col solutions-col--center-spacer" />

                    {/* Right Column: Tech Specs & Interactive Actions */}
                    <div className="solutions-col solutions-col--right">
                      <div className="solutions-specs">
                        {item.specs.map((spec) => (
                          <div className="spec-pill" key={spec.label}>
                            <span className="spec-label">{spec.label}</span>
                            <span className="spec-value">{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="solutions-row-actions">
                        <Link href={item.primaryCta.href} className="btn-chaingpt-main">
                          <span>{item.primaryCta.text}</span>
                          <Icon name="arrow-right" size={14} />
                        </Link>
                        {item.secondaryCta && (
                          <Link href={item.secondaryCta.href} className="btn-chaingpt-secondary">
                            <span>{item.secondaryCta.text}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
