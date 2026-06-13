//modules
import type { ReactNode } from 'react';
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutBlank, useResponse } from 'stackpress/view/client';
//client
import type {
  DocsPageResults,
  HomeResults,
  NavGroup,
  PagerItem,
  ShelfResults,
  TocItem
} from '../types.js';

//--------------------------------------------------------------------//
// Types

type DocsFrameProps = ServerConfigPageProps & {
  children: ReactNode
};

type DocsHeadProps = ServerConfigPageProps & {
  description?: string,
  title: string
};

type DocsShellProps = {
  children: ReactNode
};

type MobilePanelsProps = {
  groups: NavGroup[],
  toc: TocItem[]
};

type PagerProps = {
  next?: PagerItem,
  previous?: PagerItem
};

type SidebarProps = {
  active: string,
  groups: NavGroup[]
};

type TocProps = {
  items: TocItem[]
};

//--------------------------------------------------------------------//
// Components

/**
 * Renders shared SEO, script, and stylesheet tags for docs pages.
 */
export function DocsHead(props: DocsHeadProps) {
  const { description = '', styles = [], title } = props;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/icon.png" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
      />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
        defer
      ></script>
      <script src="/scripts/docs.js?v=20260612t" defer></script>
    </>
  );
}

/**
 * Wraps docs pages in the Stackpress blank layout and docs shell.
 */
export function DocsFrame(props: DocsFrameProps) {
  const { children } = props;

  return (
    <LayoutBlank {...props}>
      <DocsShell>{children}</DocsShell>
    </LayoutBlank>
  );
}

/**
 * Provides the initial light visitor shell before client progress is applied.
 */
function DocsShell(props: DocsShellProps) {
  return (
    <div
      className="docs-site docs-level-1 docs-theme-light"
      data-reader-level="1"
      data-theme="light"
      suppressHydrationWarning
    >
      <Header />
      {props.children}
      <footer className="docs-footer">
        <span>Stackpress documentation</span>
        <span>Generated from specs</span>
      </footer>
    </div>
  );
}

/**
 * Renders the shared docs top navigation and progress controls.
 */
export function Header() {
  return (
    <>
      <header className="docs-topbar">
        <a className="docs-brand" href="/">
          <img src="/images/stackpress-logo-icon.png" alt="Stackpress" />
        </a>
        <nav className="docs-topnav" aria-label="Primary">
          <a href="/#start">Start</a>
          <a href="/guides">Guides</a>
          <a href="/api">API</a>
        </nav>
        <button
          aria-expanded="false"
          aria-label="Open main menu"
          className="docs-menu-button"
          data-panel-toggle="global-menu-panel"
          type="button"
        >
          ☰
        </button>
        <button
          aria-label="Toggle dark mode"
          className="docs-theme-switch"
          data-theme-toggle
          disabled
          hidden
          aria-pressed="false"
          suppressHydrationWarning
          type="button"
        >
          <span aria-hidden="true">☀</span>
          <span aria-hidden="true">☾</span>
        </button>
        <button
          aria-label="Guide progress"
          className="docs-progress-badge"
          data-badge-toggle
          suppressHydrationWarning
          type="button"
        >
          <i className="fa-solid fa-circle-info" aria-hidden="true" />
          <strong data-progress-count suppressHydrationWarning>Visitor</strong>
        </button>
        <a className="docs-github" href="https://github.com/stackpress">
          GitHub
        </a>
      </header>
      <div className="docs-progress-popover" data-badge-popover hidden>
        <p className="docs-eyebrow">Guide progress</p>
        <strong data-badge-label suppressHydrationWarning>Visitor</strong>
        <p>
          Current path:{' '}
          <span data-current-path suppressHydrationWarning>
            100 Develop
          </span>
        </p>
        <ul data-progress-list suppressHydrationWarning />
      </div>
      <nav className="docs-global-panel" id="global-menu-panel">
        <a href="/#start">Start</a>
        <a href="/guides">Guides</a>
        <a href="/api">API</a>
      </nav>
    </>
  );
}

/**
 * Renders article navigation for the levels currently visible to the reader.
 */
export function Sidebar(props: SidebarProps) {
  return (
    <aside className="docs-sidebar">
      {props.groups.map(group => (
        <div
          data-unlock-level={group.level || 1}
          hidden={(group.level || 1) > 1}
          key={group.label}
        >
          <p>{group.label}</p>
          {group.items.map(item => (
            <a
              data-unlock-level={item.level || group.level || 1}
              className={item.href === props.active ? 'is-current' : ''}
              href={item.href}
              hidden={(item.level || group.level || 1) > 1}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}

/**
 * Renders the mobile article menu and table of contents panels.
 */
export function MobilePanels(props: MobilePanelsProps) {
  return (
    <>
      <div className="docs-mobile-controls">
        <button data-panel-toggle="mobile-docs-panel" type="button">
          Docs menu
        </button>
        <button data-panel-toggle="mobile-toc-panel" type="button">
          On this page
        </button>
      </div>
      <nav className="docs-mobile-panel" id="mobile-docs-panel">
        {props.groups.flatMap(group => group.items).map(item => (
          <a
            data-unlock-level={item.level || 1}
            hidden={(item.level || 1) > 1}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <nav className="docs-mobile-panel" id="mobile-toc-panel">
        {props.toc.map(item => (
          <a href={`#${item.id}`} key={item.id}>{item.text}</a>
        ))}
      </nav>
    </>
  );
}

/**
 * Renders the desktop table of contents for article headings.
 */
export function Toc(props: TocProps) {
  return (
    <aside className="docs-toc">
      <p>On this page</p>
      {props.items.map(item => (
        <a href={`#${item.id}`} key={item.id}>{item.text}</a>
      ))}
    </aside>
  );
}

/**
 * Renders previous and next article links when a neighbor exists.
 */
export function Pager(props: PagerProps) {
  // empty pager slots should not reserve space on standalone pages
  if (!props.previous && !props.next) return null;

  return (
    <nav className="docs-pager" aria-label="Article navigation">
      {props.previous ? (
        <a href={props.previous.href}>
          <span>Previous</span>
          <strong>{props.previous.label}</strong>
        </a>
      ) : <span />}
      {props.next ? (
        <a href={props.next.href}>
          <span>Next</span>
          <strong>{props.next.label}</strong>
        </a>
      ) : <span />}
    </nav>
  );
}

/**
 * Renders a guide or API article from the route response payload.
 */
export function DocBody() {
  const response = useResponse<DocsPageResults>();
  const result = response.results;

  // route data is required before the article shell has useful content
  if (!result) {
    return <main className="docs-main">Document not found.</main>;
  }

  return (
    <main className="docs-main">
      <section className="docs-layout">
        <MobilePanels groups={result.nav} toc={result.toc} />
        <Sidebar active={result.active} groups={result.nav} />
        <article
          className="docs-article"
          data-guide-level={result.guideLevel || 1}
          data-guide-path={result.active}
        >
          <p className="docs-eyebrow">{result.eyebrow}</p>
          <div dangerouslySetInnerHTML={{ __html: result.content }} />
          <Pager previous={result.previous} next={result.next} />
        </article>
        <Toc items={result.toc} />
      </section>
    </main>
  );
}

/**
 * Renders a guide or API index shelf from the route response payload.
 */
export function ShelfBody() {
  const response = useResponse<ShelfResults>();
  const result = response.results;

  // route data is required before the shelf can list cards
  if (!result) {
    return <main className="docs-main">Section not found.</main>;
  }

  return (
    <main className="docs-main">
      <section className="docs-shelf">
        <p className="docs-eyebrow">{result.eyebrow}</p>
        <h1>{result.title}</h1>
        <p className="docs-lead">{result.description}</p>
        <div className="docs-card-grid">
          {result.cards.map(card => (
            <a
              data-unlock-level={card.level || 1}
              hidden={(card.level || 1) > 1}
              href={card.href}
              key={card.href}
            >
              <strong>{card.label}</strong>
              <span>{card.description}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

/**
 * Renders the documentation home page from the route response payload.
 */
export function HomeBody() {
  const response = useResponse<HomeResults>();
  const result = response.results;

  // the fallback keeps the page readable if a route is missing results
  if (!result) {
    return <main className="docs-main">Stackpress documentation</main>;
  }

  return (
    <main className="docs-main">
      <section className="docs-hero">
        <div>
          <p className="docs-eyebrow">Docs for developers</p>
          <h1>{result.title}</h1>
          <p className="docs-lead">{result.description}</p>
          <div className="docs-actions">
            <a className="docs-button primary" href="/guides/100-develop">
              Start tutorial
            </a>
            <a className="docs-button" href="/api">
              API reference
            </a>
          </div>
        </div>
        <div className="docs-code-card">
          <span>schema.idea</span>
          <span>generate</span>
          <span>push</span>
          <span>serve</span>
        </div>
      </section>
      <section className="docs-paths" id="start">
        <div>
          <p className="docs-eyebrow">Start here</p>
          <h2>Choose the right path</h2>
        </div>
        <div>
          {result.paths.map(path => (
            <a
              data-unlock-level={path.level || 1}
              hidden={(path.level || 1) > 1}
              href={path.href}
              key={`${path.level || 1}-${path.href}-${path.label}`}
            >
              <strong>{path.label}</strong>
              <span>{path.description}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
