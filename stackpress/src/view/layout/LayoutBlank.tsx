//modules
import { useEffect } from 'react';
//notify
import NotifyContainer from '../notify/NotifyContainer';
import { unload } from '../notify/hooks';
//theme
import { useTheme } from '../theme/hooks';
//client
import type { 
  ServerConfigProps, 
  BlankAppProps, 
  LayoutBlankProps 
} from '../types';
import { useConfig } from '../server/hooks';
//components
import LayoutHead from './components/LayoutHead';
import LayoutMain from './components/LayoutMain';
//layout
import LayoutProvider from './LayoutProvider';

export function BlankApp({ head = true, children }: BlankAppProps) {
  const config = useConfig<ServerConfigProps>();
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div className={`${theme} relative px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
      {head ? (
        <LayoutHead 
          theme={theme}
          brand={config.path('brand.name', 'Stackpress')}
          base={config.path('view.base', '/')}
          logo={config.path('brand.icon', 'icon.png')}
          toggleTheme={toggleTheme} 
        />
      ) : null}
      <LayoutMain head={head}>{children}</LayoutMain>
    </div>
  );
}

export default function LayoutBlank(props: LayoutBlankProps) {
  const { 
    head,
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
      <BlankApp head={head}>{children}</BlankApp>
      <NotifyContainer />
    </LayoutProvider>
  );
}