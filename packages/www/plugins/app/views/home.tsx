//--------------------------------------------------------------------//
// Imports

import type { ServerPageProps } from 'stackpress/view/client';
import { LayoutAdmin, useResponse } from 'stackpress/view/client';
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

export function Head(props: ServerPageProps) {
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

export function Page(props: ServerPageProps) {
  const { session, request, response } = props;
  return (
    <LayoutAdmin
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </LayoutAdmin>
  );
};

//defaults to page
export default Page;