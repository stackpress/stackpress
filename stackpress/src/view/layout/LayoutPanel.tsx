//modules
import { useEffect } from 'react';
//views
import type { 
  ServerConfigProps, 
  PanelAppProps, 
  LayoutPanelProps 
} from '../types.js';
//notify
import NotifyContainer from '../notify/NotifyContainer.js';
import { unload } from '../notify/hooks.js';
//theme
import { useTheme } from '../theme/hooks.js';
//client
import { useConfig, useRequest } from '../server/hooks.js';
//components
import LayoutHead from './components/LayoutHead.js';
import LayoutLeft from './components/LayoutLeft.js';
import LayoutMain from './components/LayoutMain.js';
import LayoutMenu from './components/LayoutMenu.js';
import LayoutRight from './components/LayoutRight.js';
//layout
import LayoutProvider from './LayoutProvider.js';
import { useToggle } from './hooks.js';

export function PanelApp(props: PanelAppProps) {
  const { menu, children } = props;
  const config = useConfig<ServerConfigProps>();
  const request = useRequest();
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  const pathname = request.url.pathname;
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
    </div>
  );
}

export default function LayoutPanel(props: LayoutPanelProps) {
  const { 
    data,
    session,
    request,
    response,
    menu,
    left,
    right,
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
      <PanelApp left={left} right={right} menu={menu}>
        {children}
      </PanelApp>
      <NotifyContainer />
    </LayoutProvider>
  );
}