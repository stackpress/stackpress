//modules
import type { ReactNode } from 'react';
import { useEffect } from 'react';
//views
import type { LayoutProviderProps } from '../types';
//notify
import NotifyContainer from '../notify/NotifyContainer';
import { unload } from '../notify/hooks';
//theme
import { useTheme } from '../theme/hooks';
//client
import type { ServerConfigProps } from '../types';
import { useConfig } from '../server/hooks';
//components
import LayoutHead from './components/LayoutHead';
import LayoutMain from './components/LayoutMain';
//layout
import LayoutProvider from './LayoutProvider';

export function BlankApp({ children }: { children: ReactNode }) {
  const config = useConfig<ServerConfigProps>();
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div className={`${theme} relative px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
      <LayoutHead 
        theme={theme}
        brand={config.path('brand.name', 'Stackpress')}
        base={config.path('view.base', '/')}
        logo={config.path('brand.icon', 'icon.png')}
        toggleTheme={toggleTheme} 
      />
      <LayoutMain>{children}</LayoutMain>
    </div>
  );
}

export default function LayoutBlank(props: LayoutProviderProps) {
  const { 
    data,
    session,
    request,
    response,
    children 
  } = props;
  //unload flash message
  useEffect(unload, []);
  return (
    <LayoutProvider 
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <BlankApp>{children}</BlankApp>
      <NotifyContainer />
    </LayoutProvider>
  );
}