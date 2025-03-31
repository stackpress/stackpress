//modules
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLanguage } from 'r22n';
//admin
import type { AdminConfigProps } from '../../admin/types';
//views
import type { LayoutProviderProps } from '../types';
//notify
import NotifyContainer from '../notify/NotifyContainer';
import { unload } from '../notify/hooks';
//theme
import { useTheme } from '../theme/hooks';
//client
import { useConfig, useSession, useRequest } from '../server/hooks';
//components
import LayoutHead from './components/LayoutHead';
import LayoutLeft from './components/LayoutLeft';
import LayoutMain from './components/LayoutMain';
import LayoutMenu from './components/LayoutMenu';
import LayoutRight from './components/LayoutRight';
//layout
import LayoutProvider from './LayoutProvider';
import { useToggle } from './hooks';

export function AdminUserMenu() {
  const session = useSession();
  const { changeLanguage } = useLanguage();
  return (
    <section className="flex flex-col px-h-100-0">
      <header>
        {session.data.id ? (
          <div className="px-px-10 px-py-14 theme-tx1 flex items-center">
            <i className="px-fs-26 inline-block px-mr-10 fas fa-user-circle" />
            <span>{session.data.name}</span>
          </div>
        ) : null}
        <nav className="theme-bg-bg3 px-px-10 px-py-12">
          <a 
            className="theme-info theme-bg-bg0 px-fs-10 inline-block px-p-5" 
            onClick={() => changeLanguage('en_US')}
          >EN</a>
          <a 
            className="theme-info theme-bg-bg0 px-fs-10 inline-block px-p-5 px-ml-5" 
            onClick={() => changeLanguage('th_TH')}
          >TH</a>
        </nav>
      </header>
      <main className="flex-grow bg-t-0">
        {session.data.id ? (
          <div className="px-h-100-0">
            {session.data.roles && session.data.roles.includes('ADMIN') && (
              <nav className="theme-bc-bd0 flex items-center px-px-10 px-py-14 border-b" >
                <i className="inline-block px-mr-10 fas fa-guage" />
                <a className="theme-info" href="/admin/profile/search">Admin</a>
              </nav>
            )}
            
            <nav className="theme-bc-bd0 flex items-center px-px-10 px-py-14 border-b">
              <i className="inline-block px-mr-10 fas fa-power-off" />
              <a className="theme-info" href="/auth/signout">Sign Out</a>
            </nav>
          </div>
        ) : (
          <div className="h-full">
            <nav className="theme-bc-bd0 flex items-center px-px-10 px-py-14 border-b">
              <i className="inline-block px-mr-10 fas fa-lock" />
              <a className="theme-info" href="/auth/signin">Sign In</a>
            </nav>
            <nav className="theme-bc-bd0 flex items-center px-px-10 px-py-14 border-b">
              <i className="inline-block px-mr-10 fas fa-trophy" />
              <a className="theme-info" href="/auth/signup">Sign Up</a>
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
        base={config.path('admin.base', '/admin')}
        logo={config.path('brand.icon', 'icon.png')}
        open={left}
        toggle={toggleLeft}
      >
        <LayoutMenu path={pathname} menu={menu} />
      </LayoutLeft>
      <LayoutRight open={right}>
        <AdminUserMenu />
      </LayoutRight>
      <LayoutMain open={left}>{children}</LayoutMain>
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