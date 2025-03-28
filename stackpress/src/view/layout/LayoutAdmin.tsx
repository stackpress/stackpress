//modules
import { useEffect } from 'react';
import { useLanguage } from 'r22n';
//
import type { SessionTokenData } from '../../session/types';
//view
import { unload, ToastContainer } from '../notify';
import { useTheme } from '../theme';
//components
import LayoutHead from './components/LayoutHead';
import LayoutLeft from './components/LayoutLeft';
import LayoutMain from './components/LayoutMain';
import LayoutMenu from './components/LayoutMenu';
import LayoutRight from './components/LayoutRight';
//local
import LayoutProvider from './LayoutProvider';
import { useToggle } from './hooks';

export type AdminUserMenuProps = {
  session?: SessionTokenData
};

export function AdminUserMenu(props: AdminUserMenuProps) {
  const { session } = props;
  const { changeLanguage } = useLanguage();
  return (
    <section className="flex flex-col px-h-100-0">
      <header>
        {session?.id ? (
          <div className="px-px-10 px-py-14 theme-tx1 flex items-center">
            <i className="px-fs-26 inline-block px-mr-10 fas fa-user-circle" />
            <span>{session?.name}</span>
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
        {session?.id ? (
          <div className="px-h-100-0">
            {session?.roles && session.roles.includes('ADMIN') && (
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

export type AdminAppProps = { 
  base?: string,
  logo?: string,
  brand?: string,
  session?: SessionTokenData,
  children?: React.ReactNode,
  path?: string,
  menu?: {
    name: string;
    icon: string;
    path: string;
    match: string;
  }[]
};

export function AdminApp(props: AdminAppProps) {
  const { base, logo, brand, path, menu, session, children } = props;
  const [ left, toggleLeft ] = useToggle();
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
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
        brand={brand}
        base={base}
        logo={logo}
        open={left}
        toggle={toggleLeft}
      >
        <LayoutMenu path={path} menu={menu || []} />
      </LayoutLeft>
      <LayoutRight open={right}>
        <AdminUserMenu session={session} />
      </LayoutRight>
      <LayoutMain open={left}>{children}</LayoutMain>
    </div>
  );
}

export type LayoutAdminProps = { 
  base?: string,
  logo?: string,
  brand?: string,
  theme?: string,
  language?: string,
  session?: SessionTokenData,
  translations?: Record<string, string>,
  children?: React.ReactNode,
  path?: string,
  menu?: {
    name: string;
    icon: string;
    path: string;
    match: string;
  }[]
};

export default function LayoutAdmin(props: LayoutAdminProps) {
  const { 
    base, 
    logo, 
    brand, 
    path,
    menu,
    theme,
    session,
    language, 
    translations, 
    children 
  } = props;
  //unload flash message
  useEffect(unload, []);
  return (
    <LayoutProvider theme={theme} language={language} translations={translations}>
      <AdminApp 
        base={base} 
        logo={logo} 
        brand={brand} 
        path={path}
        menu={menu}
        session={session}
      >
        {children}
      </AdminApp>
      <ToastContainer />
    </LayoutProvider>
  );
}