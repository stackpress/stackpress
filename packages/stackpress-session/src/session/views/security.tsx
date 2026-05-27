//stackpress-view
import { useLanguage } from 'stackpress-view/client';
//stackpress-session
import {
  AccountBackHeader,
  AccountHead,
  AccountLayout,
  useAccountBase
} from './helpers.js';
import type { AccountPageProps } from './helpers.js';

export function AccountSecurityBody() {
  //hooks
  const { _ } = useLanguage();
  const base = useAccountBase();
  //variables
  const links = [
    {
      label: _('Change Your Password'),
      href: `${base}/account/security/password`
    },
    {
      label: _('Set Up Two-Factor Authentication'),
      href: `${base}/account/security/2fa`
    },
    {
      label: _('Delete your account'),
      href: `${base}/account/security/remove`
    },
    {
      label: _('Export your data'),
      href: `${base}/account/security/export`
    }
  ];
  //render
  return (
    <main className="account-security-page account-page">
      <AccountBackHeader title={_('Security Settings')} icon="lock" />
      <section className="account-card account-security-list">
        {links.map(link => (
          <a
            className="account-security-list-item"
            href={link.href}
            key={link.href}
          >
            <span>{link.label}</span>
            <i className="fas fa-chevron-right" />
          </a>
        ))}
      </section>
    </main>
  );
};

export function AccountSecurityHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Security Settings')}
      description={_('Manage your account security settings.')}
    />
  );
};

export function AccountSecurityPage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountSecurityBody />
    </AccountLayout>
  );
};

export const Head = AccountSecurityHead;
export default AccountSecurityPage;
