//modules
import { useEffect } from 'react';
import Notifier, { unload } from 'frui/Notifier';
//stackpress/view
import type { 
  ServerConfigProps, 
  BlankAppProps, 
  LayoutBlankProps 
} from '../types.js';
//stackpress/view/theme
import { useTheme } from '../theme/hooks.js';
//stackpress/view/server
import { useConfig } from '../server/hooks.js';
//stackpress/view/layout/components
import LayoutHead from './components/LayoutHead.js';
import LayoutMain from './components/LayoutMain.js';
//stackpress/view/layout
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
};

export default function LayoutBlank(props: LayoutBlankProps) {
  const { 
    cookie,
    data,
    head,
    session,
    request,
    response,
    children 
  } = props;
  //unload flash message
  useEffect(() => {
    unload(cookie);
  }, []);
  return (
    <LayoutProvider 
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <BlankApp head={head}>{children}</BlankApp>
      <Notifier.Container />
    </LayoutProvider>
  );
};