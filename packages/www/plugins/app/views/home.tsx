//--------------------------------------------------------------------//
// Imports

import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutBlank, useResponse } from 'stackpress/view/client';
import { useLanguage } from 'r22n';

//--------------------------------------------------------------------//
// Components

export function Body() {
  const response = useResponse<{ title: string }>();
  return (
    <main className="border-t theme-bc-1 w-full h-full">
      <div className="flex flex-col w-full h-full">
        <h1>{response.results?.title || 'Welcome to Stackpress'}</h1>
      </div>
    </main>
  );
}

export function Head(props: ServerConfigPageProps) {
  const { styles = [] } = props;
  const { _ } = useLanguage();
  return (
    <>
      <title>{_('Welcome to Stackpress')}</title>
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
    <LayoutBlank
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </LayoutBlank>
  );
};

//defaults to page
export default Page;
