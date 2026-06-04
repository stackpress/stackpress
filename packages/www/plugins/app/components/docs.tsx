//stackpress
import type { ReactNode } from 'react';
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutBlank, useResponse } from 'stackpress/view/client';

//--------------------------------------------------------------------//
// Types

export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type TocItem = {
  id: string;
  level: number;
  text: string;
};

export type PagerItem = {
  href: string;
  label: string;
};

export type SiteSection = 'home' | 'concepts' | 'guides' | 'api';

export type DocsPageResults = {
  active: string;
  content: string;
  description: string;
  eyebrow: string;
  nav: NavGroup[];
  next?: PagerItem;
  previous?: PagerItem;
  section: SiteSection;
  title: string;
  toc: TocItem[];
};

export type ShelfCard = {
  description: string;
  href: string;
  label: string;
};

export type ShelfResults = {
  cards: ShelfCard[];
  description: string;
  eyebrow: string;
  section: SiteSection;
  title: string;
};

export type HomeResults = {
  description: string;
  paths: ShelfCard[];
  title: string;
};

//--------------------------------------------------------------------//
// Components

export function DocsHead(props: ServerConfigPageProps & {
  description?: string;
  title: string;
}) {
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
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
      <script src="/scripts/docs.js?v=20260601f" defer></script>
    </>
  );
}

export function DocsFrame(props: ServerConfigPageProps & {
  children: ReactNode;
}) {
  const { children } = props;

  return (
    <LayoutBlank {...props}>
      <div className="docs-site">
        <Header />
        {children}
        <footer className="docs-footer">
          <span>Stackpress documentation</span>
          <span>Generated from specs</span>
        </footer>
      </div>
    </LayoutBlank>
  );
}

export function Header() {
  return (
    <>
      <header className="docs-topbar">
        <a className="docs-brand" href="/">
          <img src="/images/stackpress-logo.png" alt="Stackpress" />
        </a>
        <nav className="docs-topnav" aria-label="Primary">
          <a href="/#start">Start</a>
          <a href="/concepts">Concepts</a>
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
          aria-pressed="false"
          className="docs-theme-switch"
          type="button"
        >
          <span aria-hidden="true">☀</span>
          <span aria-hidden="true">☾</span>
        </button>
        <a className="docs-github" href="https://github.com/stackpress">
          GitHub
        </a>
      </header>
      <nav className="docs-global-panel" id="global-menu-panel">
        <a href="/#start">Start</a>
        <a href="/concepts">Concepts</a>
        <a href="/guides">Guides</a>
        <a href="/api">API</a>
      </nav>
    </>
  );
}

export function Sidebar(props: {
  active: string;
  groups: NavGroup[];
}) {
  return (
    <aside className="docs-sidebar">
      {props.groups.map(group => (
        <div key={group.label}>
          <p>{group.label}</p>
          {group.items.map(item => (
            <a
              className={item.href === props.active ? 'is-current' : ''}
              href={item.href}
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

export function MobilePanels(props: {
  groups: NavGroup[];
  toc: TocItem[];
}) {
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
          <a href={item.href} key={item.href}>{item.label}</a>
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

export function Toc(props: { items: TocItem[] }) {
  return (
    <aside className="docs-toc">
      <p>On this page</p>
      {props.items.map(item => (
        <a href={`#${item.id}`} key={item.id}>{item.text}</a>
      ))}
    </aside>
  );
}

export function Pager(props: {
  next?: PagerItem;
  previous?: PagerItem;
}) {
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

export function DocBody() {
  const response = useResponse<DocsPageResults>();
  const result = response.results;

  if (!result) {
    return <main className="docs-main">Document not found.</main>;
  }

  return (
    <main className="docs-main">
      <section className="docs-layout">
        <MobilePanels groups={result.nav} toc={result.toc} />
        <Sidebar active={result.active} groups={result.nav} />
        <article className="docs-article">
          <p className="docs-eyebrow">{result.eyebrow}</p>
          <div dangerouslySetInnerHTML={{ __html: result.content }} />
          <Pager previous={result.previous} next={result.next} />
        </article>
        <Toc items={result.toc} />
      </section>
    </main>
  );
}

export function ShelfBody() {
  const response = useResponse<ShelfResults>();
  const result = response.results;

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
            <a href={card.href} key={card.href}>
              <strong>{card.label}</strong>
              <span>{card.description}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export function HomeBody() {
  const response = useResponse<HomeResults>();
  const result = response.results;

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
            <a className="docs-button primary" href="/guides/start">
              Start tutorial
            </a>
            <a className="docs-button" href="/concepts">
              Read concepts
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
            <a href={path.href} key={path.href}>
              <strong>{path.label}</strong>
              <span>{path.description}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
