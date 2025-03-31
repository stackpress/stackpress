//modules
import { R22nProvider } from 'r22n';
//views
import type { LayoutProviderProps } from '../types';
//providers
import ServerProvider from '../server/ServerProvider';
import ModalProvider from '../modal/ModalProvider';
import NotifyProvider from '../notify/NotifyProvider';
import ThemeProvider from '../theme/ThemeProvider';

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
  const modal = [
    'border-2 p-4 bg-[#EBF0F6] border-[#C8D5E0] text-[#222222]',
    'dark:bg-[#090D14] dark:border-[#1F2937] dark:text-[#DDDDDD]'
  ];
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
            <ModalProvider className={modal.join(' ')}>
              {children}
            </ModalProvider>
          </NotifyProvider>
        </ThemeProvider>
      </R22nProvider>
    </ServerProvider>
  );
}
