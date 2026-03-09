//--------------------------------------------------------------------//
// Imports

import type { ServerPageProps } from 'stackpress/view/client';
import { useResponse } from 'stackpress/view/client';
import Layout from '../components/Layout.js';

//--------------------------------------------------------------------//
// Constants

const title = 'The Blog';
const description = 'A simple blog built with Stackpress.';
const url = 'https://stackpress.dev/blog';

//--------------------------------------------------------------------//
// Components

export function Body() {
  const response = useResponse<{ title: string }>();
  return (
    <div className="flex flex-col w-full h-full">
      <h1>{response.results?.title || 'The Blog'}</h1>
    </div>
  );
}

export function Head(props: ServerPageProps) {
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

export function Page(props: ServerPageProps) {
  const { session, request, response } = props;
  return (
    <Layout
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