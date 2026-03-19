//modules
import { useEffect } from 'react';
import { notify, unload } from 'frui/Notifier';
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

export function BlankApp(props: BlankAppProps) {
  //props
  const { head = true, children } = props;
  //hooks
  const config = useConfig<ServerConfigProps>();
  const { theme, toggle: toggleTheme } = useTheme();
  //render
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
      <div id="popup-root"></div>
      <div id="dialog-root"></div>
      <div id="dropdown-root"></div>
    </div>
  );
};

export default function LayoutBlank(props: LayoutBlankProps) {
  //props
  const { 
    cookie,
    data,
    head,
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
    <LayoutProvider 
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <BlankApp head={head}>{children}</BlankApp>
    </LayoutProvider>
  );
};