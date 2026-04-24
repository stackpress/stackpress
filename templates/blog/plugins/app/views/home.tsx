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
// Constants

const title = 'The Blog';
const description = 'A simple blog built with Stackpress.';
const url = 'https://stackpress.dev/blog';

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
  const response = useResponse<ArticleExtended[]>();
  const rows = response.results || [];
  const { _ } = useLanguage();
  return (
    <main className="flex flex-col w-full h-full overflow-auto">
      <div className="px-p-10 px-mw-960 mx-auto">
        <h1 className="text-2xl font-bold px-pb-10">
          {_('Whats New')}
        </h1>
        {rows.map((article, index) => (
          <div key={index} className="px-mt-10 px-pt-10 border-t theme-bc-2">
            {!!article.published && (
              <em className="inline-flex items-center">
                <i className="fas fa-fw fa-calendar inline-block px-mr-5" />
                {formatDate(article.published)}
              </em>
            )}
            <div className="px-mt-5 px-h-200 overflow-hidden">
              {!!article.banner && (
                <a href={`/articles/${article.slug}`}>
                  <img src={article.banner} alt={article.title} />
                </a>
              )}
            </div>
            <h2 className="px-mt-5 text-xl font-bold">
              <a href={`/articles/${article.slug}`} className="text-blue-500 hover:underline">
                {article.title}
              </a>
            </h2>
          </div>
        ))}
      </div>
    </main>
  );
}

export function Head(props: ServerPageProps<ServerConfigProps>) {
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