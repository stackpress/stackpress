//modules
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLanguage } from 'r22n';
//admin
import type { AdminConfigProps } from '../../admin/types.js';
//views
import type { LayoutProviderProps } from '../types.js';
//notify
import NotifyContainer from '../notify/NotifyContainer.js';
import { unload } from '../notify/hooks.js';
//theme
import { useTheme } from '../theme/hooks.js';
//client
import { useConfig, useSession, useRequest } from '../server/hooks.js';
//components
import LayoutHead from './components/LayoutHead.js';
import LayoutLeft from './components/LayoutLeft.js';
import LayoutMain from './components/LayoutMain.js';
import LayoutMenu from './components/LayoutMenu.js';
import LayoutRight from './components/LayoutRight.js';
//layout
import LayoutProvider from './LayoutProvider.js';
import { useToggle } from './hooks.js';

export function AdminUserMenu() {
  const session = useSession();
  const { changeLanguage } = useLanguage();
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
            <nav className="manu-item">
              <i className="icon fas fa-trophy" />
              <a href="/auth/signup">Sign Up</a>
            </nav>
          </div>
        )}
      </main>
    </section>
  );
}

export function AdminApp({ children }: { children: ReactNode }) {
  const config = useConfig<AdminConfigProps>();
  const request = useRequest();
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  const menu = config.path<{
    name: string;
    icon: string;
    path: string;
    match: string;
  }[]>('admin.menu', []);
  const pathname = request.url.pathname;
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
    </div>
  );
}

export default function LayoutAdmin(props: LayoutProviderProps) {
  const { 
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
      <AdminApp>{children}</AdminApp>
      <NotifyContainer />
    </LayoutProvider>
  );
}