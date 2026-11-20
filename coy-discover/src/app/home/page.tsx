import Link from "next/link";
import { Icon } from "@/components/icon";
import { SolutionsScroll } from "@/components/solutions-scroll";
import { FloatingGithub } from "@/components/floating-github";

export default function HomePage() {
  return (
    <div className="home-wrapper">
      {/* Floating GitHub Logo — rotates angle on scroll */}
      <FloatingGithub />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: CANDIDATE HERO — "Selling Myself"
          ═══════════════════════════════════════════════════════ */}
      <section className="page-content home-page">
        <div className="candidate-hero">
          <div className="home-glow" />

          <div className="hud-badge">
            <span className="hud-badge-dot" />
            <span className="hud-badge-text">COY SDE INTERN ASSIGNMENT</span>
          </div>

          <h1 className="candidate-headline">
            Hi, I&apos;m{" "}
            <span className="gradient-text">Ashmit Gautam</span>
          </h1>

          <p className="candidate-tagline">
            Node.js Backend Developer · NIT Jalandhar · Building the Discover
            tab &amp; two feature proposals for Coy
          </p>

          <p className="candidate-bio">
            I am a Computer Science undergraduate at{" "}
            <strong>NIT Jalandhar</strong> specialising in scalable{" "}
            <strong>Node.js</strong> systems, real-time APIs, and
            privacy-first architectures. For this assignment I explored{" "}
            <a
              href="https://app.getcoy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-link"
            >
              app.getcoy.com
            </a>{" "}
            end-to-end (Phone OTP → Adding crushes → Email verification →
            Invite links → Extra-slots screen), then built a standalone{" "}
            <strong>Discover tab</strong> and suggested{" "}
            <strong>two core features</strong> Coy should have.
          </p>

          {/* Credential Bar */}
          <div className="candidate-credentials-bar">
            <div className="credential-item">
              <span className="credential-label">NAME</span>
              <strong className="credential-val">Ashmit Gautam</strong>
            </div>
            <div className="credential-divider" />
            <div className="credential-item">
              <span className="credential-label">COLLEGE</span>
              <strong className="credential-val">
                NIT Jalandhar (B.Tech CSE)
              </strong>
            </div>
            <div className="credential-divider" />
            <div className="credential-item">
              <span className="credential-label">EMAIL</span>
              <a
                href="mailto:ashmitgautam788@gmail.com"
                className="credential-val credential-link"
              >
                ashmitgautam788@gmail.com
              </a>
            </div>
            <div className="credential-divider" />
            <div className="credential-item">
              <span className="credential-label">GITHUB</span>
              <a
                href="https://github.com/commitwizard-5"
                target="_blank"
                rel="noopener noreferrer"
                className="credential-val credential-link"
              >
                github.com/commitwizard-5
              </a>
            </div>
            <div className="credential-divider" />
            <div className="credential-item">
              <span className="credential-label">ROLE</span>
              <strong className="credential-val gradient-text">
                SDE Intern · Node.js
              </strong>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-cta-group">
            <Link className="btn-chaingpt-main" href="/discover">
              <span>OPEN DISCOVER TAB</span>
              <Icon name="compass" size={16} />
            </Link>
            <a className="btn-chaingpt-secondary" href="#coy-walkthrough">
              <span>COY APP WALKTHROUGH</span>
              <Icon name="arrow-right" size={15} />
            </a>
            <a className="btn-chaingpt-secondary" href="#proposed-features">
              <span>TWO FEATURE PROPOSALS</span>
              <Icon name="zap" size={15} />
            </a>
            <a
              className="btn-chaingpt-secondary btn-github"
              href="https://github.com/commitwizard-5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" size={16} />
              <span>GITHUB</span>
            </a>
          </div>

          {/* Skills / Tech Stack */}
          <div className="tech-stack-row">
            <span className="tech-chip">
              <Icon name="code" size={13} />
              Node.js
            </span>
            <span className="tech-chip">
              <Icon name="zap" size={13} />
              Next.js 16 (App Router)
            </span>
            <span className="tech-chip">
              <Icon name="shield" size={13} />
              Prisma &amp; SQLite
            </span>
            <span className="tech-chip">
              <Icon name="sparkles" size={13} />
              Framer Motion
            </span>
            <span className="tech-chip">
              <Icon name="check" size={13} />
              TypeScript
            </span>
            <span className="tech-chip">
              <Icon name="shield" size={13} />
              REST API Design
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: COY APP WALKTHROUGH (Part A — experience)
          ═══════════════════════════════════════════════════════ */}
      <section id="coy-walkthrough" className="page-content teardown-section">
        <div className="section-header-box">
          <div className="hud-sub-badge">
            <span className="hud-badge-dot" />
            <span>PART A — COY APP EXPERIENCE</span>
          </div>
          <h2 className="teardown-title">
            What I found exploring{" "}
            <span>
              <a
                href="https://app.getcoy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link-gradient"
              >
                app.getcoy.com
              </a>
            </span>
          </h2>
          <p className="teardown-intro">
            I signed up, went through every step, and documented the five key
            flows the assignment asks about. Here is what works well and what
            could be improved.
          </p>
        </div>

        <div className="teardown-cards-grid">
          {/* Step 1 */}
          <article className="teardown-card">
            <div className="teardown-step-badge">STEP 01</div>
            <h3>Phone OTP Login</h3>
            <p>
              Coy authenticates users via a 6-digit SMS OTP sent to their
              phone number. It is fast, eliminates password reuse risk, and
              ties each account to exactly one real phone.
            </p>
            <div className="teardown-edge-case">
              <strong>What I&apos;d improve:</strong> Add a rate limiter in
              Node.js (3 OTP requests per 10 minutes per number) to prevent
              abuse, and support WhatsApp OTP as a fallback for unreliable
              SMS carriers.
            </div>
          </article>

          {/* Step 2 */}
          <article className="teardown-card">
            <div className="teardown-step-badge">STEP 02</div>
            <h3>Adding a Crush</h3>
            <p>
              Users enter a contact&apos;s phone number to privately &ldquo;add
              a crush.&rdquo; Only the user can see their own list — Ranbir
              adds Deepika and Alia, and only he can see those entries.
            </p>
            <div className="teardown-edge-case">
              <strong>What I&apos;d improve:</strong> Never store raw phone
              numbers. Hash them with HMAC-SHA256 + a system pepper so even a
              database leak cannot reveal anyone&apos;s crush list.
            </div>
          </article>

          {/* Step 3 */}
          <article className="teardown-card">
            <div className="teardown-step-badge">STEP 03</div>
            <h3>Email Verification</h3>
            <p>
              Coy asks for email verification as a secondary identity check.
              This confirms the user owns the email and unlocks extra trust
              signals inside the app.
            </p>
            <div className="teardown-edge-case">
              <strong>What I&apos;d improve:</strong> Use short-lived signed
              JWT tokens (15-min TTL) for the magic link so stale links
              cannot be replayed, and return clear error messages on expiry.
            </div>
          </article>

          {/* Step 4 */}
          <article className="teardown-card">
            <div className="teardown-step-badge">STEP 04</div>
            <h3>The Invite Link (Anonymous SMS)</h3>
            <p>
              When you add a crush, Coy sends them an anonymous notification:
              <em>
                {" "}
                &ldquo;Someone you know has a crush on you. You&apos;ll
                only find out who if you add them on Coy.&rdquo;
              </em>{" "}
              It never says who.
            </p>
            <div className="teardown-edge-case">
              <strong>What I&apos;d improve:</strong> Add a one-tap
              unsubscribe link to stay compliant with SMS regulations, and
              queue messages through Node.js with exponential back-off if the
              gateway times out.
            </div>
          </article>

          {/* Step 5 */}
          <article className="teardown-card">
            <div className="teardown-step-badge">STEP 05</div>
            <h3>Extra-Slots Screen</h3>
            <p>
              Coy gives you a few free crush slots and offers paid extra
              slots. I looked at this screen but did not purchase anything, as
              instructed.
            </p>
            <div className="teardown-edge-case">
              <strong>What I&apos;d improve:</strong> Let users earn free
              slots by successfully inviting friends who sign up, creating an
              organic viral loop instead of a hard paywall.
            </div>
          </article>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: TWO CORE FEATURE PROPOSALS (Part A — Task)
          ═══════════════════════════════════════════════════════ */}
      <section
        id="proposed-features"
        className="page-content proposals-section"
      >
        <div className="section-header-box">
          <div className="hud-sub-badge">
            <span className="hud-badge-dot" />
            <span>PART A TASK — TWO FEATURES COY SHOULD HAVE</span>
          </div>
          <h2 className="teardown-title">
            Suggested Core <span>Features</span>
          </h2>
          <p className="teardown-intro">
            Based on my experience with the app, here are two features I
            believe Coy needs — and <strong>why</strong> each one matters.
          </p>
        </div>

        <div className="feature-proposal-container">
          {/* Feature 1 */}
          <div className="feature-proposal-card">
            <div className="proposal-header">
              <div className="proposal-badge-wrap">
                <span className="proposal-number">FEATURE 01</span>
                <span className="proposal-tag">PRIVACY &amp; SECURITY</span>
              </div>
              <h3 className="proposal-title">
                Cryptographic Zero-Knowledge Crush Vault
              </h3>
            </div>

            <div className="proposal-body">
              <div className="proposal-block">
                <h4>Why Coy needs this:</h4>
                <p>
                  Coy&apos;s entire promise is{" "}
                  <em>
                    &ldquo;your crush is secret unless it is mutual.&rdquo;
                  </em>{" "}
                  But if the database stores raw phone numbers, a single
                  breach — a rogue employee, SQL injection, or a leaked
                  backup — exposes every user&apos;s unrequited crushes. That
                  would destroy user trust overnight. The app needs a system
                  where{" "}
                  <strong>
                    even Coy&apos;s own servers cannot read a one-sided crush
                  </strong>
                  .
                </p>
              </div>

              <div className="proposal-block">
                <h4>How I would build it (Node.js):</h4>
                <ul className="spec-bullet-list">
                  <li>
                    Normalize phone numbers to E.164, then hash with{" "}
                    <code>
                      crypto.createHmac(&apos;sha256&apos;, SYSTEM_PEPPER)
                    </code>{" "}
                    before writing to the database. The raw number is never
                    stored.
                  </li>
                  <li>
                    Check for mutual matches using{" "}
                    <code>crypto.timingSafeEqual</code> so attackers cannot
                    use response-time differences to guess whether a hash
                    exists.
                  </li>
                  <li>
                    Wrap the lookup + match creation inside a single{" "}
                    <code>prisma.$transaction</code> for atomicity — no
                    partial writes, no race conditions.
                  </li>
                </ul>
              </div>

              <div className="proposal-metrics">
                <div className="metric-pill">
                  <span className="metric-num">0 %</span>
                  <span className="metric-desc">
                    One-sided crush leak risk
                  </span>
                </div>
                <div className="metric-pill">
                  <span className="metric-num">&lt; 12 ms</span>
                  <span className="metric-desc">Hash-match latency</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-num">100 %</span>
                  <span className="metric-desc">Tamper-proof audit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-proposal-card">
            <div className="proposal-header">
              <div className="proposal-badge-wrap">
                <span className="proposal-number">FEATURE 02</span>
                <span className="proposal-tag">
                  GROWTH &amp; USER ACQUISITION
                </span>
              </div>
              <h3 className="proposal-title">
                Campus Micro-Cohorts — College Crush Radar
              </h3>
            </div>

            <div className="proposal-body">
              <div className="proposal-block">
                <h4>Why Coy needs this:</h4>
                <p>
                  Right now you <strong>must</strong> know your crush&apos;s
                  exact 10-digit phone number. In reality — in college
                  lectures, the library, hackathons, dorms — you often have a
                  crush on someone whose <em>name</em> or{" "}
                  <em>department</em> you know, but whose phone number you
                  feel too shy to ask for. That phone-number barrier blocks a
                  massive pool of potential users. Coy should let verified
                  college students discover mutual interests on campus{" "}
                  <strong>without</strong> needing a phone number.
                </p>
              </div>

              <div className="proposal-block">
                <h4>How I would build it (Node.js):</h4>
                <ul className="spec-bullet-list">
                  <li>
                    Verify students via their college email domain (e.g.{" "}
                    <code>@nitj.ac.in</code>) using a signed magic-link with
                    a 15-minute expiry.
                  </li>
                  <li>
                    Index users by{" "}
                    <code>(college_id, department, interests[])</code> in
                    SQLite so the backend can serve &ldquo;people at your
                    college who share your vibe&rdquo; without exposing
                    identities.
                  </li>
                  <li>
                    Add a double-blind campus spark: User A signals anonymous
                    interest in User B&apos;s campus handle. Neither identity
                    is revealed until B reciprocates — same zero-knowledge
                    promise, no phone number needed.
                  </li>
                </ul>
              </div>

              <div className="proposal-metrics">
                <div className="metric-pill">
                  <span className="metric-num">4.8 ×</span>
                  <span className="metric-desc">
                    Projected match velocity
                  </span>
                </div>
                <div className="metric-pill">
                  <span className="metric-num">80 %+</span>
                  <span className="metric-desc">Campus viral K-factor</span>
                </div>
                <div className="metric-pill">
                  <span className="metric-num">Zero</span>
                  <span className="metric-desc">
                    Awkward phone-ask rejections
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: STICKY-SCRUB SOLUTIONS SCROLL (ChainGPT FX)
          ═══════════════════════════════════════════════════════ */}
      <SolutionsScroll />

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: PART B — DISCOVER TAB SHOWCASE
          ═══════════════════════════════════════════════════════ */}
      <section className="page-content part-b-showcase">
        <div className="part-b-banner">
          <div className="part-b-info">
            <div className="hud-sub-badge">
              <span className="hud-badge-dot" />
              <span>PART B — LIVE WORKING DEMO</span>
            </div>
            <h2>
              Swipe-Based &ldquo;Discover&rdquo; Tab
            </h2>
            <p>
              Fully implemented with 32 mock profiles, mobile drag physics,
              atomic like/pass recording, instant mutual match celebrations,
              and strict privacy DTO projection.
            </p>
            <div className="part-b-cta-row">
              <Link className="btn-chaingpt-main" href="/discover">
                <span>OPEN DISCOVER</span>
                <Icon name="compass" size={16} />
              </Link>
              <Link className="btn-chaingpt-secondary" href="/matches">
                <span>VIEW MATCHES</span>
                <Icon name="message" size={16} />
              </Link>
            </div>
          </div>

          <div className="part-b-metrics-panel">
            <div className="tech-stat">
              <span className="stat-value gradient-text">32</span>
              <span className="stat-label">Seed Profiles</span>
            </div>
            <div className="tech-stat">
              <span className="stat-value gradient-text">7</span>
              <span className="stat-label">Pre-Seeded Mutual Likes</span>
            </div>
            <div className="tech-stat">
              <span className="stat-value gradient-text">60 FPS</span>
              <span className="stat-label">Swipe Animation</span>
            </div>
            <div className="tech-stat">
              <span className="stat-value gradient-text">100 %</span>
              <span className="stat-label">SQLite Persistence</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
