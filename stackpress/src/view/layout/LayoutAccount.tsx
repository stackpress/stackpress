//modules
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { notify, unload } from 'frui/Notifier';
//stackpress/view
import type { LayoutProviderProps, ServerConfigProps } from '../types.js';
//stackpress/view/theme
import { useTheme } from '../theme/hooks.js';
//stackpress/view/server
import { useConfig, useRequest } from '../server/hooks.js';
//stackpress/view/layout/components
import LayoutHead from './components/LayoutHead.js';
import LayoutLeft from './components/LayoutLeft.js';
import LayoutMain from './components/LayoutMain.js';
import LayoutRight from './components/LayoutRight.js';
import LayoutMenu from './components/LayoutMenu.js';
//stackpress/view/layout
import { AdminUserMenu } from './LayoutAdmin.js';
//stackpress/view/layout
import LayoutProvider from './LayoutProvider.js';
import { useToggle } from './hooks.js';

export type LayoutAccountProps = LayoutProviderProps & {
  children: ReactNode;
};

/**
 * Account layout
 */
export function AccountApp(props: { children: ReactNode }) {
  const { children } = props;
  //hooks
  const config = useConfig<ServerConfigProps>();
  const request = useRequest();
  const [left, toggleLeft] = useToggle();
  const [right, toggleRight] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();

  const base = config.path('auth.base', '/auth');
  const pathname = request.url.pathname;

  const menu = [
    //put other menu items here...
    {
      name: 'Security Settings',
      icon: 'shield-halved',
      path: `${base}/account/security`,
      match: `${base}/account/security`,
    },
  ];

  return (
    <div className={`${theme} layout-admin`}>
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
        base={base}
        logo={config.path('brand.icon', 'icon.png')}
        open={left}
        toggle={toggleLeft}
      >
        <LayoutMenu path={pathname} menu={menu.filter((item) => !!item.path)} />
      </LayoutLeft>
      <LayoutRight head open={right}>
        <AdminUserMenu />
      </LayoutRight>
      <LayoutMain head left open={{ left, right }}>
        {children}
      </LayoutMain>
      <div id="popup-root"></div>
      <div id="dialog-root"></div>
      <div id="dropdown-root"></div>
    </div>
  );
}

export default function LayoutAccount(props: LayoutAccountProps) {
  const { cookie, data, session, request, response, children } = props;
  //unload any flash messages from the server
  useEffect(() => {
    unload(cookie);
  }, []);
  //if there is an error in the response, show a notification
  useEffect(() => {
    response?.error && notify('error', response.error);
  }, [response?.error]);
  return (
    <LayoutProvider
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <AccountApp>{children}</AccountApp>
    </LayoutProvider>
  );
}
