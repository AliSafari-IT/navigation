import { useEffect, useState } from "react";
import type { ChangelogCategory } from "@asafarim/changelog-timeline";
import "@asafarim/changelog-timeline/css";
import { CodeBlock } from "./widgets";

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
  issueNumber?: number;
  votes?: number;
}

type ChangelogEntry = {
  id: string;
  version: string;
  date: string;
  category: ChangelogCategory;
  title: string;
  description: string;
  tags: string[];
};

const navigationTimelineData: NavigationRoadmapItem[] = [
  {
    version: "0.1.0",
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
    version: "0.3.0",
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
    version: "0.4.1",
    date: "August 30, 2026",
    isoDate: "2026-08-30",
    status: "released",
    title: "Theme Support with Design Tokens",
    details: [
      "Token-driven light and dark navigation surfaces",
      "High-contrast and custom theme overrides",
    ],
    icon: "🎨",
    category: "feature",
    tags: ["themes", "design-tokens", "dark-mode"],
    proposedApi: `import "@asafarim/design-tokens/css";

document.documentElement.dataset.theme = "dark";`,
    issueUrl: "https://github.com/AliSafari-IT/navigation/issues/1",
    issueNumber: 1,
    votes: 0,
  },
  {
    version: "0.5.0",
    date: "Coming soon",
    isoDate: "2026-12-01",
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
    issueUrl: "https://github.com/AliSafari-IT/navigation/issues/2",
    issueNumber: 2,
    votes: 0,
  },
  {
    version: "1.0.0",
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
    issueUrl: "https://github.com/AliSafari-IT/navigation/issues/3",
    issueNumber: 3,
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

const categoryIcons: Record<ChangelogCategory, string> = {
  feature: "✨",
  fix: "🐛",
  improvement: "⚡",
  security: "🔒",
  breaking: "⚠️",
  docs: "📚",
};

function ChangelogTimeline({ entries, title, subtitle }: {
  entries: ChangelogEntry[];
  title: string;
  subtitle: string;
}) {
  return (
    <div className="changelog-timeline changelog-timeline--left">
      <div className="timeline-header">
        <h1 className="timeline-title">{title}</h1>
        <p className="timeline-subtitle">{subtitle}</p>
      </div>
      <div className="timeline-container">
        <div className="timeline-line" />
        {entries.map((entry) => (
          <div className="timeline-item" key={entry.id}>
            <div
              className="timeline-dot"
              style={{ color: `var(--category-${entry.category}-icon)` }}
            />
            <div className="timeline-card">
              <div className="card-header">
                <span className="category-icon">{categoryIcons[entry.category]}</span>
                <div className="card-content">
                  <h3 className="card-title">{entry.title}</h3>
                  <div className="card-meta">
                    <span
                      className="category-label"
                      style={{
                        background: `var(--category-${entry.category}-bg)`,
                        color: `var(--category-${entry.category}-text)`,
                      }}
                    >
                      {entry.category}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="card-description">{entry.description}</p>
                  <div className="card-tags">
                    {entry.tags.map((tag) => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
          <ChangelogTimeline
            entries={history.map(toChangelogEntry)}
            title="Changelog"
            subtitle="Shipped updates for @asafarim/navigation"
          />
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

type GitHubIssue = {
  reactions?: {
    "+1"?: number;
  };
};

const GITHUB_API_BASE = "https://api.github.com/repos/AliSafari-IT/navigation/issues";

function RoadmapList({ items }: { items: NavigationRoadmapItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((i) => [i.version, i.votes ?? 0]))
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      items
        .filter((item) => item.issueNumber)
        .map(async (item) => {
          const response = await fetch(`${GITHUB_API_BASE}/${item.issueNumber}`);
          if (!response.ok) {
            throw new Error(`GitHub returned ${response.status}`);
          }
          const issue = (await response.json()) as GitHubIssue;
          return [item.version, issue.reactions?.["+1"] ?? 0] as const;
        })
    )
      .then((reactionCounts) => {
        if (!cancelled) {
          setVotes((current) => ({ ...current, ...Object.fromEntries(reactionCounts) }));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [items]);

  function toggle(version: string) {
    setOpen((current) => (current === version ? null : version));
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
                  {item.issueUrl && (
                    <a
                      href={item.issueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roadmap-vote-btn"
                    >
                      Vote on GitHub (+1) ({votes[item.version] ?? 0})
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
