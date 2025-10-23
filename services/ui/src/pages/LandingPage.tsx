import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Pricing", href: "#pricing" },
  { label: "Get Started", href: "#get-started" },
  { label: "GitHub", href: "#" },
  { label: "Twitter", href: "#" },
];

const sectionIds = ["hero", "pricing", "get-started"] as const;
type SectionId = (typeof sectionIds)[number];

export default function LandingPage() {
  const glowRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    hero: null,
    pricing: null,
    "get-started": null,
  });
  const [visibleSections, setVisibleSections] = useState<
    Record<SectionId, boolean>
  >({
    hero: true,
    pricing: false,
    "get-started": false,
  });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;

      const glow = glowRef.current;
      if (glow) {
        const { width, height } = glow.getBoundingClientRect();
        glow.style.transform = `translate3d(${x - width / 2}px, ${
          y - height / 2
        }px, 0)`;
      }

      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((current) => {
          let changed = false;
          const next = { ...current };

          for (const entry of entries) {
            const id = entry.target.getAttribute(
              "data-section-id"
            ) as SectionId | null;
            if (!id) continue;
            if (next[id] !== entry.isIntersecting) {
              next[id] = entry.isIntersecting;
              changed = true;
            }
          }

          return changed ? next : current;
        });
      },
      { threshold: 0.35 }
    );

    observerRef.current = observer;

    sectionIds.forEach((id) => {
      const element = sectionRefs.current[id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const registerSectionRef =
    (section: SectionId) => (element: HTMLElement | null) => {
      const observer = observerRef.current;
      const previous = sectionRefs.current[section];

      if (previous && observer) {
        observer.unobserve(previous);
      }

      sectionRefs.current[section] = element;

      if (element) {
        element.setAttribute("data-section-id", section);
        if (observer) {
          observer.observe(element);
        }
      }
    };

  const sectionPresentation = (section: SectionId) =>
    visibleSections[section] ? "opacity-100" : "opacity-0";

  return (
    <div className="hide-scrollbar relative h-screen overflow-x-hidden overflow-y-auto bg-[#05070d] text-white scroll-smooth snap-y snap-mandatory">
      <div className="background-grid" aria-hidden="true" />
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
          <a
            className="inline-flex items-center gap-3 font-display text-sm uppercase tracking-[0.18em] text-white transition hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            href="#hero"
          >
            <span
              className="h-3 w-3 rounded-full bg-[linear-gradient(135deg,#00ffff,#9b5cf6)] shadow-[0_0_12px_rgba(0,255,255,0.7)]"
              aria-hidden="true"
            />
            DeckLab
          </a>
          <nav className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <a className="transition hover:text-cyan-300" href="#pricing">
              Pricing
            </a>
            <a className="transition hover:text-cyan-300" href="#get-started">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <section
          id="hero"
          ref={registerSectionRef("hero")}
          className={`flex min-h-screen snap-start snap-always flex-1 items-center py-16 sm:py-20 transition-all duration-[1400ms] ${sectionPresentation(
            "hero"
          )}`}
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-12 lg:py-28">
            <div className="flex flex-col gap-6">
              <p className="hero-eyebrow">Collaborate. Code. Present.</p>
              <h1 className="font-display text-4xl leading-[1.05] text-[#f4f7ff] drop-shadow-[0_0_32px_rgba(0,255,255,0.12)] sm:text-5xl lg:text-6xl">
                AI-native decks for teams that build in the open.
              </h1>
              <p className="max-w-xl text-base text-white/60 sm:text-lg">
                DeckLab turns JSX into live, collaborative presentations powered
                by AI. Ship stunning decks with instant previews, smart
                suggestions, and multiplayer editing built for engineering
                teams.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-full border-none bg-gradient-to-br from-cyan-400/80 via-[#00ffffcc] to-[#9b5cf6cc] px-7 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(0,255,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  href="#get-started"
                >
                  Try DeckLab
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  href="#pricing"
                >
                  View pricing
                </a>
              </div>
            </div>

            <div
              className="pointer-parallax relative hidden grid gap-5 lg:grid"
              role="img"
              aria-label="DeckLab mockup"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(24,30,45,0.9),rgba(9,12,18,0.9))] p-7 shadow-[0_32px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                <div className="mb-5 flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-white/20" />
                  <span className="h-3 w-3 rounded-full bg-white/20" />
                  <span className="h-3 w-3 rounded-full bg-white/20" />
                </div>
                <pre className="font-mono-deck text-[0.95rem] leading-[1.6rem] text-[rgba(224,233,255,0.88)]">
                  <code>
                    <span className="token keyword">const</span>{" "}
                    <span className="token function">HeroSlide</span> = () =&gt;
                    ({"\n"} &lt;Slide background="gradient"&gt;{"\n"} &lt;Title
                    color="cyan"&gt;Collaborate in Real-Time&lt;/Title&gt;{"\n"}{" "}
                    &lt;CodeSnippet language="tsx"&gt;{"\n"}{" "}
                    {`<LiveDeck room="frontend-sprint" />`}
                    {"\n"} &lt;/CodeSnippet&gt;{"\n"} &lt;/Slide&gt;{"\n"});
                    {"\n"}
                  </code>
                </pre>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(24,30,45,0.8),rgba(11,15,24,0.92))] p-6 shadow-[0_32px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                <div className="flex flex-col gap-6 rounded-2xl border border-cyan-400/20 bg-[#0c0f19]/60 p-6 shadow-[inset_0_0_24px_rgba(0,255,255,0.08)]">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-400/20 px-4 py-1 text-sm font-semibold text-cyan-300">
                      Live Team Review
                    </span>
                    <span className="text-sm font-semibold text-[#9b5cf6b3]">
                      Synced
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-display text-2xl text-[#f4f7ff]">
                      Collaborate. Code. Present.
                    </h3>
                    <ul className="space-y-3 text-white/60">
                      <li className="relative pl-6 before:absolute before:left-0 before:top-[0.45rem] before:h-2.5 before:w-2.5 before:rounded-full before:bg-[linear-gradient(135deg,#00ffff,#9b5cf6)] before:shadow-[0_0_14px_rgba(0,255,255,0.4)]">
                        React-powered slides that stay in sync
                      </li>
                      <li className="relative pl-6 before:absolute before:left-0 before:top-[0.45rem] before:h-2.5 before:w-2.5 before:rounded-full before:bg-[linear-gradient(135deg,#00ffff,#9b5cf6)] before:shadow-[0_0_14px_rgba(0,255,255,0.4)]">
                        Cursor presence and comments with AI summaries
                      </li>
                      <li className="relative pl-6 before:absolute before:left-0 before:top-[0.45rem] before:h-2.5 before:w-2.5 before:rounded-full before:bg-[linear-gradient(135deg,#00ffff,#9b5cf6)] before:shadow-[0_0_14px_rgba(0,255,255,0.4)]">
                        Deploy decks instantly to your team
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          ref={registerSectionRef("pricing")}
          className={`relative flex min-h-screen snap-start snap-always items-center border-t border-white/10 bg-[rgba(7,12,22,0.8)] py-20 backdrop-blur-sm transition-all duration-[1400ms] ${sectionPresentation(
            "pricing"
          )}`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:px-12">
            <div className="max-w-2xl">
              <p className="hero-eyebrow">Pricing</p>
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Simple plans that scale with your team.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "Basic",
                  price: "$0",
                  description: "Personal use — essential editing & previews.",
                  bullets: ["1 personal decks", "10k tokens / month AI quota"],
                  highlighted: false,
                },
                {
                  name: "Pro",
                  price: "$29",
                  description: "For small teams: collaboration and more AI.",
                  bullets: [
                    "30 realtime multi-user decks",

                    "200k tokens / month AI quota",
                    // they can ivite others to decks and join others decks
                  ],
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description:
                    "Security, support, and custom workflows for orgs.",
                  bullets: [
                    "Custom Deck Allocation",
                    "Custom token allocations",
                    "SAML SSO & SCIM",
                  ],
                  highlighted: false,
                },
              ].map((tier) => (
                <article
                  key={tier.name}
                  className={`flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:shadow-[0_32px_60px_rgba(0,0,0,0.45)] ${
                    tier.highlighted
                      ? "border-cyan-400/40 bg-[rgba(0,29,38,0.65)]"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl text-white">
                      {tier.name}
                    </h3>
                    {tier.highlighted && (
                      <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-semibold text-cyan-300">
                    {tier.price}
                  </p>
                  <p className="text-sm text-white/60">{tier.description}</p>
                  <ul className="flex flex-1 flex-col gap-3 text-sm text-white/70">
                    {tier.bullets.map((bullet) => (
                      <li className="relative pl-6" key={bullet}>
                        <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#00ffff,#9b5cf6)] shadow-[0_0_10px_rgba(0,255,255,0.4)]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="inline-flex w-full items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-cyan-400/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                    to={`/auth/register?plan=${tier.name}`}
                  >
                    Choose plan
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="get-started"
          ref={registerSectionRef("get-started")}
          className={`relative flex min-h-screen snap-start snap-always flex-col items-center justify-center gap-10 border-t border-white/10 px-6 py-24 text-center sm:px-10 lg:px-12 transition-all duration-[1400ms] ${sectionPresentation(
            "get-started"
          )}`}
        >
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="hero-eyebrow">Get started</p>
            <h2 className="font-display text-3xl text-white sm:text-5xl">
              Launch a live deck in minutes.
            </h2>
            <p className="text-base text-white/60 sm:text-lg">
              Spin up your first collaborative deck with instant previews, AI
              scene suggestions, and contextual notes that keep everyone in
              sync.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full border-none bg-gradient-to-br from-cyan-400/80 via-[#00ffffcc] to-[#9b5cf6cc] px-8 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(0,255,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              to="/app"
            >
              Create a Deck
            </Link>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              href="#"
            >
              Contact sales
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 px-6 py-12 sm:px-10 lg:px-20">
        <div className="font-display text-xs uppercase tracking-[0.18em] text-white/70">
          DeckLab
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-white/60">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              className="transition hover:text-cyan-300"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} DeckLab. Built for builders.
        </p>
      </footer>
    </div>
  );
}
