//modules
import { useLanguage } from 'r22n';
//stackpress-view
import { useSession } from '../server/hooks.js';

export default function LayoutUserMenu() {
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