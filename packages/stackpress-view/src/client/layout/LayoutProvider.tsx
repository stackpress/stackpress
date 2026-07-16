//modules
import { useEffect } from 'react';
import { R22nProvider } from 'r22n';
import Notifier, { unload, useNotifier } from 'frui/Notifier';
//stackpress-view
import type { LayoutProviderProps } from '../types.js';
import ServerProvider from '../server/ServerProvider.js';
import ThemeProvider from '../theme/ThemeProvider.js';

export type { LayoutProviderProps };

function LayoutNotifier(
  props: Pick<LayoutProviderProps, 'cookie'|'response'>
) {
  const { cookie, response } = props;
  const notifier = useNotifier();
  // unload any flash messages from the server
  useEffect(() => {
    cookie
      ? unload(cookie, notifier.config.name)
      : notifier.unload();
  }, []);
  // if there is an error in the response, show a notification
  useEffect(() => {
    response?.error && notifier.notify('error', response.error);
  }, [ response?.error ]);
  return null;
};

export default function LayoutProvider(props: LayoutProviderProps) {
  const { 
    cookie,
    data,
    session,
    request,
    response,
    children 
  } = props || {};
  const { languages = {}, locale = 'en_US' } = data?.language || {};
  const { label = 'EN', translations = {} } = languages[locale] || {};
  const notify = data?.view?.notify;
  const theme = request?.session?.theme as string || 'light';
  return (
    <ServerProvider
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <R22nProvider language={label} translations={translations}>
        <ThemeProvider theme={theme}>
          <Notifier.Provider {...notify}>
            <LayoutNotifier cookie={cookie} response={response} />
            {children}
          </Notifier.Provider>
        </ThemeProvider>
      </R22nProvider>
    </ServerProvider>
  );
};
