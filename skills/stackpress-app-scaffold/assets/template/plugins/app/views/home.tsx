//--------------------------------------------------------------------//
// Imports

//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { useResponse, LayoutPanel } from 'stackpress/view/client';

//--------------------------------------------------------------------//
// Constants

const title = 'Hello World';
const description = 'Stackpress is a modern headless CMS built with React and Node.js. It provides a powerful and flexible platform for building websites, applications, and APIs. With Stackpress, you can easily create and manage your content, while also having the freedom to design and develop your frontend using your preferred tools and frameworks.';
const url = 'https://stackpress.dev/blog';

//--------------------------------------------------------------------//
// Components

export function Body() {
  const response = useResponse<{ title: string }>();
  
  return (
    <main className="flex flex-col w-full h-full overflow-auto">
      <div className="px-p-10 px-mw-960 mx-auto">
        <h1>{response.results?.title || 'Hello World'}</h1>
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
