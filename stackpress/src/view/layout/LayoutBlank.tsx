//modules
import { useEffect } from 'react';
//notify
import NotifyContainer from '../notify/NotifyContainer.js';
import { unload } from '../notify/hooks.js';
//theme
import { useTheme } from '../theme/hooks.js';
//client
import type { 
  ServerConfigProps, 
  BlankAppProps, 
  LayoutBlankProps 
} from '../types.js';
import { useConfig } from '../server/hooks.js';
//components
import LayoutHead from './components/LayoutHead.js';
import LayoutMain from './components/LayoutMain.js';
//layout
import LayoutProvider from './LayoutProvider.js';

export function BlankApp({ head = true, children }: BlankAppProps) {
  const config = useConfig<ServerConfigProps>();
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div className={`${theme} layout-blank`}>
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