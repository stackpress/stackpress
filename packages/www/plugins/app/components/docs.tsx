//modules
import type { ReactNode } from 'react';
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutBlank, useResponse } from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
import Control from 'frui/form/FieldControl';
import Button from 'frui/Button';
import Input from 'frui/form/Input';
import Country from 'frui/form/CountrySelect';
import Taglist from 'frui/form/Taglist';
import { Table, Thead, Trow, Tcol } from 'frui/Table';
import Tags from 'frui/view/Tags';
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

type GuideJourneyItem = {
  href: string,
  label: string,
  level?: number
};

type FoundryProject = {
  description: string,
  github: string,
  image: string,
  label: string,
  npm: string,
  website: string
};

const foundryProjects: FoundryProject[] = [
  {
    description:
      'Idea language specification and parser. Streamline and automate '
      + 'major parts of your software development.',
    github: 'https://github.com/stackpress/idea',
    image: '/images/idea-logo-badge.png',
    label: 'Idea',
    npm: 'https://www.npmjs.com/package/@stackpress/idea',
    website: 'https://www.stackpress.io/idea'
  },
  {
    description:
      'An event driven server/less framework. Deploy to AWS Lambda, GCP '
      + 'Functions, Azure, Netlify, and Vercel.',
    github: 'https://github.com/stackpress/ingest',
    image: '/images/ingest-logo-badge.png',
    label: 'Ingest',
    npm: 'https://www.npmjs.com/package/@stackpress/ingest',
    website: 'https://www.stackpress.io/ingest'
  },
  {
    description:
      'SQL query builder and composite engine for MySQL, Postgres, SQLite, '
      + 'Cockroach DB, Neon DB, Supabase and more.',
    github: 'https://github.com/stackpress/inquire',
    image: '/images/inquire-logo-badge.png',
    label: 'Inquire',
    npm: 'https://www.npmjs.com/package/@stackpress/inquire',
    website: 'https://www.stackpress.io/inquire'
  },
  {
    description:
      'A reactive React template engine for next generation server focused '
      + 'web applications.',
    github: 'https://github.com/stackpress/reactus',
    image: '/images/reactus-logo-badge.png',
    label: 'Reactus',
    npm: 'https://www.npmjs.com/package/reactus',
    website: 'https://www.stackpress.io/reactus'
  }
];

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
        <a href="https://github.com/stackpress" rel="noreferrer" target="_blank">
          github
        </a>
        <a
          href="https://www.npmjs.com/package/stackpress"
          rel="noreferrer"
          target="_blank"
        >
          npm
        </a>
        <a
          href="https://github.com/stackpress/stackpress/blob/main/LICENSE"
          rel="noreferrer"
          target="_blank"
        >
          terms
        </a>
      </footer>
    </div>
  );
}

/**
 * Emits compact guide metadata for client-only progress menus on non-guide pages.
 */
function GuideJourneyData(props: { items?: GuideJourneyItem[] }) {
  if (!props.items?.length) return null;

  const items = props.items.map(({ href, label, level }) => ({
    href,
    label,
    level
  }));
  const json = JSON.stringify(items).replace(/</g, '\\u003c');

  return (
    <script
      dangerouslySetInnerHTML={{ __html: json }}
      id="docs-guide-journey-data"
      type="application/json"
    />
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
        <a
          className="docs-github"
          href="https://github.com/stackpress"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </header>
      <div className="docs-progress-popover" data-badge-popover hidden>
        <p className="docs-eyebrow">Stackpress mastery</p>
        <strong data-badge-label suppressHydrationWarning>Visitor</strong>
        <div
          aria-label="Experience progress"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={0}
          className="docs-exp-meter"
          data-exp-meter
          role="progressbar"
          suppressHydrationWarning
        >
          <span data-exp-fill suppressHydrationWarning />
        </div>
        <p className="docs-exp-value" data-exp-value suppressHydrationWarning>
          0
        </p>
        <p className="docs-eyebrow">Your next journey</p>
        <ul
          className="docs-journey-list"
          data-progress-list
          suppressHydrationWarning
        />
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

  const guideAttributes = result.section === 'guides' ? {
    'data-guide-count': result.guideCount || 0,
    'data-guide-level': result.guideLevel || 1,
    'data-guide-path': result.active
  } : {};

  return (
    <>
      <GuideJourneyData items={result.guideJourney} />
      <main className="docs-main">
        <section className="docs-layout">
          <MobilePanels groups={result.nav} toc={result.toc} />
          <Sidebar active={result.active} groups={result.nav} />
          <article
            className="docs-article"
            {...guideAttributes}
          >
            <p className="docs-eyebrow">{result.eyebrow}</p>
            <div dangerouslySetInnerHTML={{ __html: result.content }} />
            <Pager previous={result.previous} next={result.next} />
          </article>
          <Toc items={result.toc} />
        </section>
      </main>
    </>
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
    <>
      <GuideJourneyData items={result.guideJourney} />
      <main className="docs-main">
        <section className="docs-shelf" data-guide-count={result.guideCount || 0}>
          <p className="docs-eyebrow">{result.eyebrow}</p>
          <h1>{result.title}</h1>
          <p className="docs-lead">{result.description}</p>
          <div className="docs-card-grid">
            {result.cards.map(card => (
              <a
                data-journey-label={card.label}
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
    </>
  );
}

/**
 * Renders the documentation home page from the route response payload.
 */
export function HomeBody() {
  const { _ } = useLanguage();
  const response = useResponse<HomeResults>();
  const result = response.results;

  // the fallback keeps the page readable if a route is missing results
  if (!result) {
    return <main className="docs-main">Stackpress documentation</main>;
  }

  return (
    <>
      <GuideJourneyData items={result.guideJourney} />
      <main className="docs-main">
        <section className="docs-hero">
          <div>
            <p className="docs-eyebrow">Stackpress</p>
            <h1>{result.title}</h1>
            <p className="docs-lead">{result.description}</p>
            <div className="docs-actions">
              <a className="docs-button primary" href="/guides/100-develop">
                Get Started
              </a>
              <a className="docs-button" href="/api">
                API Reference
              </a>
            </div>
          </div>
          <div className="docs-example-card">
            <div className="theme-bg-bg0 px-p-20">
              <h4 className="font-bold px-fs-20 px-mb-20">
                {_('Search Users')}
              </h4>
              <div className="overflow-x-auto">
                <Table>
                  <Thead noWrap className="theme-bg-bg2 theme-info text-right cursor-pointer border-0">
                    {_('ID')}
                    <i className="inline-block px-ml-10 fas fa-sort" />
                  </Thead>
                  <Thead className="theme-bg-bg2 text-left border-0">
                    {_('Name')}
                  </Thead>
                  <Thead className="theme-bg-bg2 text-center border-0">
                    {_('Role')}
                  </Thead>
                  <Thead className="theme-bg-bg2 text-left border-0">
                    {_('Tags')}
                  </Thead>
                  <Thead className="theme-bg-bg2 text-left border-0">
                    {_('Country')}
                  </Thead>
                  <Thead className="theme-bg-bg2 text-center border-0">
                    {_('Active')}
                  </Thead>
                  <Thead noWrap className="theme-bg-bg2 theme-info text-right cursor-pointer border-0">
                    {_('Created')}
                    <i className="inline-block px-ml-10 fas fa-sort" />
                  </Thead>
                  <Thead className="theme-bg-bg2 px-r--1 border-0" stickyRight>
                    &nbsp;
                  </Thead>
                  <Trow>
                    <Tcol className="theme-bg-bg0 text-right border-0">
                      10431
                    </Tcol>
                    <Tcol noWrap className="theme-bg-bg0 text-left border-0">
                      John Doe
                    </Tcol>
                    <Tcol className="theme-bg-bg0 theme-info text-center cursor-pointer border-0">
                      user
                    </Tcol>
                    <Tcol className="theme-bg-bg0 theme-info text-left border-0">
                      <Tags className="rounded-full theme-bg-warning" value={[ 'location', 'commerce', 'address' ]} />
                    </Tcol>
                    <Tcol noWrap className="theme-bg-bg0 theme-info text-left cursor-pointer border-0">
                      United States
                    </Tcol>
                    <Tcol className="theme-bg-bg0 theme-info text-center cursor- border-0">
                      Yes
                    </Tcol>
                    <Tcol noWrap className="theme-bg-bg0 text-right border-0">
                      2 days ago
                    </Tcol>
                    <Tcol className="theme-bg-bg0 border-0 px-r--1" stickyRight>
                      <Button info>
                        <i className="fas fa-fw fa-caret-right"></i>
                      </Button>
                    </Tcol>
                  </Trow>
                  <Trow>
                    <Tcol className="theme-bg-bg1 text-right border-0">
                      10432
                    </Tcol>
                    <Tcol noWrap className="theme-bg-bg1 text-left border-0">
                      Jane Doe
                    </Tcol>
                    <Tcol className="theme-bg-bg1 theme-info text-center cursor-pointer border-0">
                      admin
                    </Tcol>
                    <Tcol className="theme-bg-bg1 theme-info text-left border-0">
                      <Tags className="rounded-full theme-bg-warning" value={[ 'location', 'commerce', 'address' ]} />
                    </Tcol>
                    <Tcol className="theme-bg-bg1 theme-info text-left cursor-pointer border-0">
                      Canada
                    </Tcol>
                    <Tcol className="theme-bg-bg1 theme-info text-center cursor-pointer border-0">
                      Yes
                    </Tcol>
                    <Tcol noWrap className="theme-bg-bg1 text-right border-0">
                      last week
                    </Tcol>
                    <Tcol className="theme-bg-bg1 border-0 px-r--1" stickyRight>
                      <Button info>
                        <i className="fas fa-fw fa-caret-right"></i>
                      </Button>
                    </Tcol>
                  </Trow>
                </Table>
              </div>
              <div className="rmd-hidden">
                <Control label="Name">
                  <Input placeholder="ie. John Doe" />
                </Control>
                <Control className="px-py-10" label="Country">
                  <Country />
                </Control>
                <Control className="px-py-10" label="Tags">
                  <Taglist value={['commerce', 'address']} />
                </Control>
                <Button info>{_('Create User')}</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          className="docs-paths"
          data-guide-count={result.guideCount || 0}
          id="start"
        >
          <div>
            <p className="docs-eyebrow">Start here</p>
            <h2>Choose the right path</h2>
          </div>
          <div>
            {result.paths.map(path => (
              <a
                data-journey-label={path.label}
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
        <section className="docs-foundry" aria-labelledby="docs-foundry-title">
          <div className="docs-foundry-intro">
            <p className="docs-eyebrow">Open source</p>
            <h2 id="docs-foundry-title">Open Source Foundry</h2>
            <p>
              Built on top of both popular and open source projects we manage
              with Apache GPLv3 Licenses.
            </p>
          </div>
          <div className="docs-foundry-grid">
            {foundryProjects.map(project => (
              <article className="docs-foundry-card" key={project.label}>
                <a
                  className="docs-foundry-badge"
                  href={project.website}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={project.image} alt={`${project.label} logo`} />
                </a>
                <h3>
                  <a href={project.website} rel="noreferrer" target="_blank">
                    {project.label}
                  </a>
                </h3>
                <p>{project.description}</p>
                <nav aria-label={`${project.label} links`}>
                  <a
                    aria-label={`${project.label} on GitHub`}
                    href={project.github}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-github" aria-hidden="true" />
                  </a>
                  <a
                    aria-label={`${project.label} on npm`}
                    className="docs-foundry-npm"
                    href={project.npm}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-npm" aria-hidden="true" />
                  </a>
                  <a
                    aria-label={`${project.label} website`}
                    href={project.website}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="fas fa-globe" aria-hidden="true" />
                  </a>
                </nav>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
