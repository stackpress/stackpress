//modules
import { R22nProvider } from 'r22n';
import Notifier from 'frui/Notifier';
//stackpress-view
import type { LayoutProviderProps } from '../types.js';
import ServerProvider from '../server/ServerProvider.js';
import ThemeProvider from '../theme/ThemeProvider.js';

export type { LayoutProviderProps };

export default function LayoutProvider(props: LayoutProviderProps) {
  const { 
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
            {children}
          </Notifier.Provider>
        </ThemeProvider>
      </R22nProvider>
    </ServerProvider>
  );
};
