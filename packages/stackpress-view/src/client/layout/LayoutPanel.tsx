//modules
import { useEffect, useState } from 'react';
import { notify, unload } from 'frui/Notifier';
//stackpress-view
import type { 
  LayoutPanelProps,
  LayoutPanelAppProps,
  ServerConfigProps
} from '../types.js';
import { 
  useConfig, 
  useRequest
} from '../server/hooks.js';
import { useTheme } from '../theme/hooks.js';
import LayoutHead from './LayoutHead.js';
import LayoutLeft from './LayoutLeft.js';
import LayoutMain from './LayoutMain.js';
import LayoutMenu from './LayoutMenu.js';
import LayoutRight from './LayoutRight.js';
import LayoutProvider from './LayoutProvider.js';
import LayoutUserMenu from './LayoutUser.js';

export function useToggle(ison = false) {
  const [ on, isOn ] = useState(ison);
  const toggle = () => isOn(on => !on);
  return [ on, toggle ] as [ boolean, () => void ];
};

export function LayoutPanelApp(props: LayoutPanelAppProps) {
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
        left
        open={{ left, right }} 
        theme={theme}
        toggleLeft={toggleLeft} 
        toggleRight={toggleRight} 
        toggleTheme={toggleTheme} 
      />
      <LayoutLeft
        brand={config.path('brand.name', 'Stackpress')}
        base={config.path('admin.base', '/admin')}
        logo={config.path('brand.icon', 'icon.png')}
        open={left}
        toggle={toggleLeft}
      >
        {menu ? (
          <LayoutMenu path={pathname} menu={menu} />
        ) : props.left}
      </LayoutLeft>
      <LayoutRight head open={right}>
        <LayoutUserMenu />
      </LayoutRight>
      <LayoutMain head left open={{ left, right }}>{children}</LayoutMain>
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
    menu,
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
      <LayoutPanelApp menu={menu}>{children}</LayoutPanelApp>
    </LayoutProvider>
  );
};