//modules
import { useEffect } from 'react';
//views
import type { 
  ServerConfigProps, 
  PanelAppProps, 
  LayoutPanelProps 
} from '../types';
//notify
import NotifyContainer from '../notify/NotifyContainer';
import { unload } from '../notify/hooks';
//theme
import { useTheme } from '../theme/hooks';
//client
import { useConfig, useRequest } from '../server/hooks';
//components
import LayoutHead from './components/LayoutHead';
import LayoutLeft from './components/LayoutLeft';
import LayoutMain from './components/LayoutMain';
import LayoutMenu from './components/LayoutMenu';
import LayoutRight from './components/LayoutRight';
//layout
import LayoutProvider from './LayoutProvider';
import { useToggle } from './hooks';

export function PanelApp(props: PanelAppProps) {
  const { menu, children } = props;
  const config = useConfig<ServerConfigProps>();
  const request = useRequest();
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  const pathname = request.url.pathname;
  return (
    <div className={`${theme} relative overflow-hidden px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
      <LayoutHead 
        open={left} 
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
      <LayoutMain open={left}>{children}</LayoutMain>
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