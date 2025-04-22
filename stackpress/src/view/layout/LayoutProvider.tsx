//modules
import { R22nProvider } from 'r22n';
//views
import type { LayoutProviderProps } from '../types.js';
//providers
import ServerProvider from '../server/ServerProvider.js';
import ModalProvider from '../modal/ModalProvider.js';
import NotifyProvider from '../notify/NotifyProvider.js';
import ThemeProvider from '../theme/ThemeProvider.js';

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
          <NotifyProvider config={notify}>
            <ModalProvider className="layout-modal">
              {children}
            </ModalProvider>
          </NotifyProvider>
        </ThemeProvider>
      </R22nProvider>
    </ServerProvider>
  );
}
