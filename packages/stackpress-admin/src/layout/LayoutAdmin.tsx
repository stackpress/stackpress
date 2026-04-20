//modules
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLanguage } from 'r22n';
import { notify, unload } from 'frui/Notifier';
//stackpress-view
import type { ProviderProps } from 'stackpress-view/types';
import { 
  useConfig, 
  useSession, 
  useRequest,
  useTheme,
  Provider
} from 'stackpress-view/client';
//stackpress-admin
import type { AdminConfigProps } from '../types.js';
import LayoutHead from './LayoutHead.js';
import LayoutLeft from './LayoutLeft.js';
import LayoutMain from './LayoutMain.js';
import LayoutMenu from './LayoutMenu.js';
import LayoutRight from './LayoutRight.js';
import { useToggle } from './hooks.js';

export function AdminUserMenu() {
  //hooks
  const session = useSession();
  const { changeLanguage } = useLanguage();
  //render
  return (
    <section className="user-menu">
      <header>
        {session.data.id ? (
          <div className="info">
            <i className="icon fas fa-user-circle" />
            <span>{session.data.name}</span>
          </div>
        ) : null}
        <nav className="lang">
          <a onClick={() => changeLanguage('en_US')}>EN</a>
          <a onClick={() => changeLanguage('th_TH')}>TH</a>
        </nav>
      </header>
      <main>
        {session.data.id ? (
          <div className="container">
            {session.data.roles && session.data.roles.includes('ADMIN') && (
              <nav className="menu-item">
                <i className="icon fas fa-gauge" />
                <a href="/admin/profile/search">Admin</a>
              </nav>
            )}
            
            <nav className="menu-item">
              <i className="icon fas fa-power-off" />
              <a href="/auth/signout">Sign Out</a>
            </nav>
          </div>
        ) : (
          <div className="container">
            <nav className="menu-item">
              <i className="icon fas fa-lock" />
              <a href="/auth/signin">Sign In</a>
            </nav>
            <nav className="menu-item">
              <i className="icon fas fa-trophy" />
              <a href="/auth/signup">Sign Up</a>
            </nav>
          </div>
        )}
      </main>
    </section>
  );
};

export function AdminApp(props: { children: ReactNode }) {
  //props
  const { children } = props;
  //hooks
  const config = useConfig<AdminConfigProps>();
  const request = useRequest();
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  //variables
  const menu = config.path<{
    name: string;
    icon: string;
    path: string;
    match: string;
  }[]>('admin.menu', []);
  const pathname = request.url.pathname;
  //render
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
        base={config.path('admin.base', '/admin')}
        logo={config.path('brand.icon', 'icon.png')}
        open={left}
        toggle={toggleLeft}
      >
        <LayoutMenu path={pathname} menu={menu} />
      </LayoutLeft>
      <LayoutRight head open={right}>
        <AdminUserMenu />
      </LayoutRight>
      <LayoutMain head left open={{ left, right }}>{children}</LayoutMain>
      <div id="popup-root"></div>
      <div id="dialog-root"></div>
      <div id="dropdown-root"></div>
    </div>
  );
};

export default function LayoutAdmin(props: ProviderProps) {
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
    <Provider 
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <AdminApp>{children}</AdminApp>
    </Provider>
  );
};