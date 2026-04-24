//--------------------------------------------------------------------//
// Imports

//modules
import { useLanguage } from 'r22n';
//stackpress
import type { 
  ServerPageProps,
  ServerConfigProps
} from 'stackpress/view/client';
import { useResponse } from 'stackpress/view/client';
//client
import type { ArticleExtended } from 'blog-client/types';
//plugins/app
import Layout from '../components/Layout.js';

//--------------------------------------------------------------------//
// Helpers

/**
 * Date string formatter consistent with hydration
 */
function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

//--------------------------------------------------------------------//
// Components

export function Body() {
  const response = useResponse<ArticleExtended>();
  const article = response.results!;
  const { _ } = useLanguage();
  return (
    <main className="flex flex-col w-full h-full article-detail">
      <div className="px-p-10 px-mw-960 mx-auto">
        {!!article.published && (
          <em className="inline-flex items-center">
            <i className="fas fa-fw fa-calendar inline-block px-mr-5" />
            {formatDate(article.published)}
          </em>
        )}
        <div className="px-mt-5 px-h-200 overflow-hidden">
          {!!article.banner && (
            <img src={article.banner} alt={article.title} />
          )}
        </div>
        <h1 className="px-mt-5 text-xl font-bold">
          {_(article.title)}
        </h1>
        <em className="inline-flex items-center">
          <i className="fas fa-fw fa-user inline-block px-mr-5" />
          by: {article.profile.name}
        </em>
        <div 
          className="px-mt-10" 
          dangerouslySetInnerHTML={{ __html: article.contents || '' }} 
        />
      </div>
    </main>
  );
}

export function Head(props: ServerPageProps<ServerConfigProps>) {
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

export function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </Layout>
  );
};

//defaults to page
export default Page;