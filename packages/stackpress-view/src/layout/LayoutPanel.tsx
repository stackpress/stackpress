//modules
import { useEffect } from 'react';
import { notify, unload } from 'frui/Notifier';
//stackpress/view
import type { 
  ServerConfigProps, 
  PanelAppProps, 
  LayoutPanelProps 
} from '../types.js';
//stackpress/view/theme
import { useTheme } from '../theme/hooks.js';
//stackpress/view/server
import { useConfig, useRequest } from '../server/hooks.js';
//stackpress/view/layout/components
import LayoutHead from './components/LayoutHead.js';
import LayoutLeft from './components/LayoutLeft.js';
import LayoutMain from './components/LayoutMain.js';
import LayoutMenu from './components/LayoutMenu.js';
import LayoutRight from './components/LayoutRight.js';
//stackpress/view/layout
import LayoutProvider from './LayoutProvider.js';
import { useToggle } from './hooks.js';

export function PanelApp(props: PanelAppProps) {
  //props
  const { menu, children } = props;
  //hooks
  const config = useConfig<ServerConfigProps>();
  const request = useRequest();
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  //variables
  const pathname = request.url.pathname;
  //render
  return (
    <div className={`${theme} layout-panel`}>
      <LayoutHead 
        open={{ left, right }} 
        theme={theme}
        toggleLeft={toggleLeft} 
        toggleRight={toggleRight} 
        toggleTheme={toggleTheme} 
      />
      <LayoutLeft
        brand={config.path('brand.name', 'Stackpress')}
        base={config.path('view.base', '/')}
        logo={config.path('brand.icon', 'icon.png')}
        open={left}
        toggle={toggleLeft}
      >
        {menu ? (
          <LayoutMenu path={pathname} menu={menu} />
        ) : props.left}
      </LayoutLeft>
      <LayoutRight open={right}>{props.right}</LayoutRight>
      <LayoutMain open={{ left, right }}>{children}</LayoutMain>
      <div id="popup-root"></div>
      <div id="dialog-root"></div>
      <div id="dropdown-root"></div>
    </div>
  );
};

export default function LayoutPanel(props: LayoutPanelProps) {
  //props
  const { 
    cookie,
    data,
    session,
    request,
    response,
    menu,
    left,
    right,
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
      <PanelApp left={left} right={right} menu={menu}>
        {children}
      </PanelApp>
    </LayoutProvider>
  );
};