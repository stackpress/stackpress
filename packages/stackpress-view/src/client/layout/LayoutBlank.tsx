//modules
import { useEffect } from 'react';
import { notify, unload } from 'frui/Notifier';
//stackpress-view
import type { 
  LayoutBlankProps,
  LayoutBlankAppProps,
  ServerConfigProps
} from '../types.js';
import { useConfig } from '../server/hooks.js';
import { useTheme } from '../theme/hooks.js';
import LayoutHead from './LayoutHead.js';
import LayoutMain from './LayoutMain.js';
import LayoutProvider from './LayoutProvider.js';

export function LayoutBlankApp(props: LayoutBlankAppProps) {
  //props
  const { head, children } = props;
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
  //render
  return (
    <LayoutProvider 
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <LayoutBlankApp>{children}</LayoutBlankApp>
    </LayoutProvider>
  );
};