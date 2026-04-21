
//modules
import type { ChildrenProps } from 'frui/types';
import { useEffect } from 'react';
import { notify, unload } from 'frui/Notifier';
//stackpress-view
import type { ProviderProps } from 'stackpress-view/client/types';
import { Provider, useTheme } from 'stackpress-view/client';

export function App(props: ChildrenProps) {
  //props
  const { children } = props;
  //hooks
  const { theme } = useTheme();
  //render
  return (
    <div className={`${theme} layout-blank`}>
      <main className="layout-main layout-blank-main">
        {children}
      </main>
      <div id="popup-root"></div>
      <div id="dialog-root"></div>
      <div id="dropdown-root"></div>
    </div>
  );
};

export default function Layout(props: ProviderProps) {
  //props
  const { 
    cookie,
    data,
    session,
    request,
    response,
    children 
  } = props;
  //effects
  // unload any flash messages from the server
  useEffect(() => {
    unload(cookie);
  }, []);
  // if there is an error in the response, show a notification
  useEffect(() => {
    response?.error && notify('error', response.error);
  }, [ response?.error ]);
  return (
    <Provider 
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <App>{children}</App>
    </Provider>
  );
};