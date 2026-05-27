//--------------------------------------------------------------------//
// Imports

//modules
import { useLanguage } from 'r22n';
//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { useResponse, LayoutPanel } from 'stackpress/view/client';
//client
import type { ArticleExtended, CommentExtended } from 'blog-client/types';
//plugins/app
import {
  formatArticleDate,
  getCommentCountLabel,
  getReadingTimeLabel
} from '../helpers.js';

//--------------------------------------------------------------------//
// Components

type ArticlePageArticle = ArticleExtended & {
  comments?: CommentExtended[];
};

export function Body() {
  const response = useResponse<ArticlePageArticle>();
  const article = response.results!;
  const { _ } = useLanguage();
  const tags = [
    ...(article.tags || []).slice(0, 3),
    ...(article.keywords || []).slice(0, 2)
  ].slice(0, 4);
  const comments = article.comments || [];

  return (
    <main className='knowledge-app article-detail'>
      <div className='knowledge-shell knowledge-shell-reading'>
        <a className='article-backlink' href='/'>
          {_('Back to knowledge console')}
        </a>

        <header className='article-hero knowledge-panel'>
          <p className='knowledge-section-label'>{_('Publication Entry')}</p>
          <h1 className='article-title'>{_(article.title)}</h1>
          <div className='article-meta'>
            <span>{formatArticleDate(article.published)}</span>
            <span>{article.profile?.name || _('Stackpress')}</span>
            <span>{getReadingTimeLabel(article.contents)}</span>
          </div>
          {!!tags.length && (
            <div className='article-tags'>
              {tags.map(tag => (
                <span key={tag} className='article-tag'>{tag}</span>
              ))}
            </div>
          )}
        </header>

        {!!article.banner && (
          <div className='article-banner knowledge-panel'>
            <img src={article.banner} alt={article.title} />
          </div>
        )}

        <section className='article-reading-surface knowledge-panel'>
          <div
            className='article-prose'
            dangerouslySetInnerHTML={{ __html: article.contents || '' }}
          />
        </section>

        <section className='article-comments knowledge-panel'>
          <div className='article-comments-head'>
            <div>
              <p className='knowledge-section-label'>{_('Discussion')}</p>
              <h2 className='article-comments-title'>
                {_(getCommentCountLabel(comments))}
              </h2>
            </div>
            <p className='article-comments-copy'>
              {_('Reader responses attached to this entry appear here as part of the article record.')}
            </p>
          </div>
          {!!comments.length ? (
            <div className='article-comment-list'>
              {comments.map(comment => (
                <article key={comment.id} className='article-comment-card'>
                  <div className='article-comment-meta'>
                    <strong>{comment.profile?.name || _('Reader')}</strong>
                    <span>{formatArticleDate(comment.created)}</span>
                  </div>
                  <p className='article-comment-body'>
                    {comment.comment || _('No comment text provided.')}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className='article-comments-empty'>
              <p>{_('No discussion has been attached to this article yet.')}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export function Head(props: ServerConfigPageProps) {
  const { styles = [], response } = props;
  const article = response.results as Record<string, any>;
  const title = article.title;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/icon.png" />

      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      <link rel="stylesheet" type="text/css" href="/styles/article.css" />
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
