//modules
import { useEffect } from 'react';
import { useLanguage } from 'r22n';
//views
import type { 
  PanelAppProps, 
  LayoutPanelProps 
} from 'stackpress/view/client';
import { 
  unload,
  useSession, 
  useTheme,
  useToggle,
  NotifyContainer,
  LayoutHead,
  LayoutRight,
  LayoutMain,
  LayoutProvider
} from 'stackpress/view/client';

export function UserMenu() {
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
                <i className="inline-block px-mr-10 fas fa-gauge" />
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

export function PanelApp(props: PanelAppProps) {
  const { children } = props;
  const [ right, toggleRight ] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div className={`${theme} relative overflow-hidden px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
      <LayoutHead  
        theme={theme}
        toggleRight={toggleRight} 
        toggleTheme={toggleTheme} 
      />
      <LayoutRight head open={right}><UserMenu /></LayoutRight>
      <LayoutMain head right open={{ right }}>{children}</LayoutMain>
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