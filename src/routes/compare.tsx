import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/theme";
import { Swatch } from "@/components/mira/ThemeSwitcher";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare color schemes · Response Review" },
      { name: "description", content: "Compare the three Parent Vaccine Talk color schemes side by side." },
      { property: "og:title", content: "Compare color schemes · Response Review" },
      { property: "og:description", content: "Compare the three Parent Vaccine Talk color schemes side by side." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ComparePage,
});

const PAGES = [
  { path: "/login", label: "Sign in" },
  { path: "/about", label: "About" },
  { path: "/", label: "Review" },
  { path: "/progress", label: "My progress" },
  { path: "/dashboard", label: "Research dashboard" },
];

const FRAME_W = 1280;
const FRAME_H = 900;

function ComparePage() {
  const [page, setPage] = useState(PAGES[0].path);
  return (
    <main className="mx-auto max-w-[1600px] px-6 py-8">
      <h1 className="text-2xl tracking-tight">Compare color schemes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Each preview uses the current sign-in, so it shows the signed-in role's view.
      </p>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Page">
        {PAGES.map((p) => (
          <button
            key={p.path}
            type="button"
            role="tab"
            aria-selected={page === p.path}
            onClick={() => setPage(p.path)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              page === p.path ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {THEMES.map((t) => (
          <section key={t.id}>
            <h2 className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-heading">
              <Swatch colors={t.swatch} /> {t.label}
            </h2>
            <ScaledFrame src={`${page}?theme=${t.id}`} title={`${t.label} preview`} />
          </section>
        ))}
      </div>
    </main>
  );
}

function ScaledFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / FRAME_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-lg border border-border bg-card"
      style={{ height: FRAME_H * scale }}
    >
      <iframe
        src={src}
        title={title}
        width={FRAME_W}
        height={FRAME_H}
        className="absolute left-0 top-0 origin-top-left border-0"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}
