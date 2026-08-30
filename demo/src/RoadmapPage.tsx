import { Component, lazy, Suspense, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import type { ChangelogCategory, ChangelogEntry } from "@asafarim/changelog-timeline";
import "@asafarim/changelog-timeline/css";
import { CodeBlock } from "./widgets";

const ChangelogTimeline = lazy(() =>
  import("@asafarim/changelog-timeline").then(({ ChangelogTimeline: Timeline }) => ({
    default: Timeline,
  }))
);

type RoadmapStatus = "released" | "current" | "planned" | "ideation";

interface NavigationRoadmapItem {
  version: string;
  date: string;
  isoDate: string;
  status: RoadmapStatus;
  title: string;
  details: string[];
  icon: string;
  category: ChangelogCategory;
  tags: string[];
  proposedApi?: string;
  issueUrl?: string;
  votes?: number;
}

const navigationTimelineData: NavigationRoadmapItem[] = [
  {
    version: "1.0.0",
    date: "June 2026",
    isoDate: "2026-06-01",
    status: "released",
    title: "Initial Release",
    details: ["Basic routing", "Static breadcrumbs"],
    icon: "✅",
    category: "feature",
    tags: ["routing", "breadcrumbs"],
  },
  {
    version: "1.1.0",
    date: "August 2026",
    isoDate: "2026-08-01",
    status: "current",
    title: "Dynamic Route Matching",
    details: ["Added dynamic parameter extraction", "Improved bundle size"],
    icon: "🚀",
    category: "improvement",
    tags: ["dynamic-routes", "performance"],
  },
  {
    version: "1.2.0",
    date: "Q4 2026",
    isoDate: "2026-10-01",
    status: "planned",
    title: "Smart Prefetching & View Transitions",
    details: [
      "Hover-based data prefetching",
      "Native View Transitions API wrapper",
    ],
    icon: "🛠️",
    category: "feature",
    tags: ["prefetch", "view-transitions"],
    proposedApi: `<Navigation prefetch="hover" />`,
    issueUrl: "https://github.com/AliSafari-IT/navigation/issues/1",
    votes: 0,
  },
  {
    version: "2.0.0",
    date: "2027",
    isoDate: "2027-01-01",
    status: "ideation",
    title: "React Server Components Support",
    details: [
      "Full RSC compatibility",
      "Zero-JS navigation fallback",
    ],
    icon: "💡",
    category: "docs",
    tags: ["rsc", "server-components"],
    proposedApi: `<NavProvider ssrMode="rsc" />`,
    issueUrl: "https://github.com/AliSafari-IT/navigation/issues/2",
    votes: 0,
  },
];

function toChangelogEntry(item: NavigationRoadmapItem): ChangelogEntry {
  return {
    id: `${item.version}-${item.status}-${item.title.replace(/\s+/g, "-")}`,
    version: item.version,
    date: item.isoDate,
    category: item.category,
    title: item.title,
    description: `${item.details.join(". ")}.`,
    tags: [item.status, ...item.tags],
  };
}

export function RoadmapPage() {
  const [view, setView] = useState<"history" | "roadmap" | "all">("all");

  const history = navigationTimelineData.filter(
    (i) => i.status === "released" || i.status === "current"
  );
  const future = navigationTimelineData.filter(
    (i) => i.status === "planned" || i.status === "ideation"
  );

  return (
    <div className="roadmap-page">
      <header className="roadmap-header">
        <h1 className="roadmap-title">Navigation journey</h1>
        <p className="roadmap-subtitle">
          A continuous view of where <code>@asafarim/navigation</code> has been
          and where it is heading.
        </p>
      </header>

      <div className="roadmap-toggle" role="group" aria-label="Timeline view">
        {(["history", "roadmap", "all"] as const).map((v) => (
          <button
            key={v}
            type="button"
            className={`roadmap-toggle__btn${
              view === v ? " roadmap-toggle__btn--active" : ""
            }`}
            onClick={() => setView(v)}
            aria-pressed={view === v}
          >
            {v === "history"
              ? "View History (Changelog)"
              : v === "roadmap"
              ? "View Future (Roadmap)"
              : "View All"}
          </button>
        ))}
      </div>

      {view !== "roadmap" && (
        <section className="roadmap-section">
          <ChangelogErrorBoundary>
            <Suspense fallback={<div className="timeline-loading">Loading changelog…</div>}>
              <ChangelogTimeline
                entries={history.map(toChangelogEntry)}
                title="Changelog"
                subtitle="Shipped updates for @asafarim/navigation"
                layout="left"
                showPagination={false}
                maxVisible={10}
              />
            </Suspense>
          </ChangelogErrorBoundary>
        </section>
      )}

      {view !== "history" && (
        <section className="roadmap-section">
          <h2 className="roadmap-section__title">Roadmap</h2>
          <RoadmapList items={future} />
        </section>
      )}
    </div>
  );
}

class ChangelogErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.error("Unable to load @asafarim/changelog-timeline", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="timeline-fallback" role="status">
          <strong>Changelog preview unavailable</strong>
          <span>The roadmap remains available below.</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function RoadmapList({ items }: { items: NavigationRoadmapItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((i) => [i.version, i.votes ?? 0]))
  );

  function toggle(version: string) {
    setOpen((current) => (current === version ? null : version));
  }

  function vote(version: string) {
    setVotes((v) => ({ ...v, [version]: (v[version] ?? 0) + 1 }));
  }

  return (
    <div className="roadmap-list">
      {items.map((item, index) => {
        const isOpen = open === item.version;
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.version}
            className={`roadmap-item roadmap-item--${item.status}`}
          >
            <div className="roadmap-item__track">
              <span className="roadmap-item__dot" aria-hidden="true">
                {item.icon}
              </span>
              {!isLast && <div className="roadmap-item__line" aria-hidden="true" />}
            </div>

            <div className="roadmap-item__body">
              <button
                type="button"
                className="roadmap-item__summary"
                onClick={() => toggle(item.version)}
                aria-expanded={isOpen}
              >
                <span className="roadmap-item__version">v{item.version}</span>
                <span className="roadmap-item__date">{item.date}</span>
                <span
                  className={`roadmap-item__status roadmap-item__status--${item.status}`}
                >
                  {item.status}
                </span>
                <h3 className="roadmap-item__title">{item.title}</h3>
              </button>

              <div className="roadmap-item__details">
                <ul>
                  {item.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>

              {isOpen && (
                <div className="roadmap-item__preview">
                  {item.proposedApi && (
                    <CodeBlock code={item.proposedApi} />
                  )}
                  {item.issueUrl && (
                    <a
                      href={item.issueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roadmap-issue"
                    >
                      Discuss on GitHub ↗
                    </a>
                  )}
                  <button
                    type="button"
                    className="roadmap-vote-btn"
                    onClick={() => vote(item.version)}
                  >
                    Vote for this feature ({votes[item.version] ?? 0})
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
