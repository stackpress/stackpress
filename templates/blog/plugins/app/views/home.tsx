//--------------------------------------------------------------------//
// Imports

//modules
import { useLanguage } from 'r22n';
//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { useResponse, LayoutPanel } from 'stackpress/view/client';
//client
import type { ArticleExtended } from 'blog-client/types';
//plugins/app
import {
  formatArticleDate,
  getArticleSummary,
  getContentSignals,
  getFeaturedArticle,
  getReadingTimeLabel,
  getTopicHighlights
} from '../helpers.js';

//--------------------------------------------------------------------//
// Constants

const title = 'The Blog';
const description = 'A simple blog built with Stackpress.';
const url = 'https://stackpress.dev/blog';

//--------------------------------------------------------------------//
// Components

export function Body() {
  const response = useResponse<ArticleExtended[]>();
  const rows = response.results || [];
  const { _ } = useLanguage();
  const [ featured, recent ] = getFeaturedArticle(rows);
  const signals = getContentSignals(rows);
  const topics = getTopicHighlights();

  return (
    <main className='knowledge-app'>
      <div className='knowledge-shell'>
        <header className='knowledge-topbar'>
          <div>
            <p className='knowledge-kicker'>{_('Stackpress Publication')}</p>
            <a className='knowledge-brand' href='/'>
              {title}
            </a>
          </div>
          <p className='knowledge-topbar-copy'>
            {_('System-minded notes for builders shaping content, tooling, and interface work.')}
          </p>
          <a className='knowledge-topbar-action' href={featured ? `/articles/${featured.slug}` : '#recent-writing'}>
            {featured ? _('Open Featured') : _('Browse Writing')}
          </a>
        </header>

        <section className='knowledge-hero'>
          <div className='knowledge-hero-copy knowledge-panel'>
            <p className='knowledge-section-label'>{_('Knowledge Console')}</p>
            <h1 className='knowledge-display'>
              {_('A product-style reading surface for structured ideas.')}
            </h1>
            <p className='knowledge-lead'>
              {_('This template treats publishing like an interface: featured context up front, modular entry points below, and calmer reading once you enter an article.')}
            </p>
            <div className='knowledge-signal-grid'>
              {signals.map(signal => (
                <div key={signal.label} className='knowledge-signal'>
                  <span className='knowledge-signal-label'>{_(signal.label)}</span>
                  <strong className='knowledge-signal-value'>{signal.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <aside className='knowledge-feature knowledge-panel knowledge-panel-strong'>
            <p className='knowledge-section-label'>{_('Featured Entry')}</p>
            {featured ? (
              <>
                {!!featured.banner && (
                  <a href={`/articles/${featured.slug}`} className='knowledge-feature-media'>
                    <img src={featured.banner} alt={featured.title} />
                  </a>
                )}
                <div className='knowledge-meta-row'>
                  <span>{formatArticleDate(featured.published)}</span>
                  <span>{featured.profile?.name || _('Stackpress')}</span>
                  <span>{getReadingTimeLabel(featured.contents)}</span>
                </div>
                <h2 className='knowledge-feature-title'>
                  <a href={`/articles/${featured.slug}`}>{featured.title}</a>
                </h2>
                <p className='knowledge-feature-summary'>
                  {getArticleSummary(featured, 240)}
                </p>
                <a className='knowledge-inline-link' href={`/articles/${featured.slug}`}>
                  {_('Read the full entry')}
                </a>
              </>
            ) : (
              <div className='knowledge-empty-state'>
                <h2>{_('No published articles yet')}</h2>
                <p>{_('Populate the template to see the console layout fill with featured writing and recent entries.')}</p>
              </div>
            )}
          </aside>
        </section>

        <section className='knowledge-section'>
          <div className='knowledge-section-heading'>
            <div>
              <p className='knowledge-section-label'>{_('Recent Writing')}</p>
              <h2 className='knowledge-section-title' id='recent-writing'>
                {_('Browse the latest entries')}
              </h2>
            </div>
            <p className='knowledge-section-copy'>
              {_('Each card behaves like a compact entry point into the publication rather than a plain chronological line item.')}
            </p>
          </div>
          <div className='knowledge-card-grid'>
            {recent.map((article, index) => (
              <article key={article.slug || index} className='knowledge-card knowledge-panel'>
                {!!article.banner && (
                  <a href={`/articles/${article.slug}`} className='knowledge-card-media'>
                    <img src={article.banner} alt={article.title} />
                  </a>
                )}
                <div className='knowledge-meta-row'>
                  <span>{formatArticleDate(article.published)}</span>
                  <span>{article.profile?.name || _('Stackpress')}</span>
                </div>
                <h3 className='knowledge-card-title'>
                  <a href={`/articles/${article.slug}`}>{article.title}</a>
                </h3>
                <p className='knowledge-card-summary'>
                  {getArticleSummary(article, 140)}
                </p>
                <div className='knowledge-card-footer'>
                  <span>{getReadingTimeLabel(article.contents)}</span>
                  <a className='knowledge-inline-link' href={`/articles/${article.slug}`}>
                    {_('Open article')}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className='knowledge-section knowledge-topics'>
          <div className='knowledge-section-heading'>
            <div>
              <p className='knowledge-section-label'>{_('Orientation')}</p>
              <h2 className='knowledge-section-title'>
                {_('What this surface is built to cover')}
              </h2>
            </div>
          </div>
          <div className='knowledge-topic-grid'>
            {topics.map(topic => (
              <div key={topic} className='knowledge-topic-chip'>
                {_(topic)}
              </div>
            ))}
          </div>
        </section>

        <section className='knowledge-section knowledge-closing knowledge-panel'>
          <p className='knowledge-section-label'>{_('Reading Mode')}</p>
          <h2 className='knowledge-section-title'>
            {_('Built to move from scanning to focused reading without changing visual language.')}
          </h2>
          <p className='knowledge-section-copy'>
            {_('The homepage carries more energy so users can orient quickly. Article pages pull the system back into a calmer rhythm for long-form trust and readability.')}
          </p>
        </section>
      </div>
    </main>
  );
}

export function Head(props: ServerConfigPageProps) {
  const { styles = [] } = props;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/icon.png" />

      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function Page(props: ServerConfigPageProps) {
  const { data, session, request, response } = props;
  return (
    <LayoutPanel
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </LayoutPanel>
  );
};

//defaults to page
export default Page;
