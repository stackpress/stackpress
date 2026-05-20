//frui
import Button from 'frui/Button';
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

export function AccountExportBody() {
  //hooks
  const { _ } = useLanguage();
  const base = useAccountBase();
  //render
  return (
    <main className="account-export-page account-page">
      <AccountBackHeader
        title={_('Export User Data')}
        back={`${base}/account/security`}
      />
      <section className="account-card account-export-card">
        <p className="account-export-description">
          {_(
            'Download a complete copy of your account data including '
            + 'personal information and sign-in identifiers.'
          )}
        </p>
        <div className="account-export-notice">
          <h2>
            <i className="fa fa-exclamation-triangle" />
            <span>{_('Important Security Notice')}</span>
          </h2>
          <ul>
            <li>
              {_(
                'This file contains sensitive personal information including '
                + 'emails, phone numbers, and account details'
              )}
            </li>
            <li>
              {_(
                'Do not share this file with unauthorized personnel or upload '
                + 'it to unsecured services'
              )}
            </li>
            <li>
              {_(
                'Store the file securely and delete it after you have finished '
                + 'using it'
              )}
            </li>
            <li>
              {_(
                'If you need to keep the file long-term, use encrypted storage '
                + 'or password-protected archives'
              )}
            </li>
          </ul>
        </div>
        <Button
          info
          href={`${base}/account/security/export?download=true`}
          className="account-primary-button"
        >
          <i className="fa fa-download" />
          <span>{_('Download My Data')}</span>
        </Button>
      </section>
    </main>
  );
};

export function AccountExportHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Export User Data')}
      description={_('Export a copy of your account data.')}
    />
  );
};

export function AccountExportPage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountExportBody />
    </AccountLayout>
  );
};

export const Head = AccountExportHead;
export default AccountExportPage;
