//modules
import Button from 'frui/Button';
//stackpress-view
import {
  useLanguage,
  useServer
} from 'stackpress-view/client';
//stackpress-session
import type { AuthConfigProps } from '../../../auth/types.js';
import {
  AccountBackHeader,
  AccountCsrfFields,
  AccountHead,
  AccountLayout,
  useAccountBase
} from '../helpers.js';
import type { AccountPageProps } from '../helpers.js';

export function AccountTwoFactorRemoveBody() {
  //hooks
  const { _ } = useLanguage();
  const base = useAccountBase();
  const { request } = useServer<
    AuthConfigProps,
    Record<string, unknown>
  >();
  //variables
  const authId = request.data.path<string>('authId', '');
  const redirect = request.data.path<string>(
    'redirect_uri',
    `${base}/account/security/2fa`
  );
  //render
  return (
    <main className="account-security-2fa-remove-page account-page">
      <AccountBackHeader
        title={_('Remove Two-Factor Authentication')}
        back={`${base}/account/security/2fa`}
      />

      <section className="account-security-2fa-remove-card">
        <p className="account-security-2fa-remove-message">
          {_('Removing two-factor authentication will make your account less secure.')}
        </p>
        <form method="post" className="account-security-2fa-remove-form">
          <AccountCsrfFields />
          <input type="hidden" name="redirect_uri" value={redirect} />
          <input type="hidden" name="authId" value={authId} />
          <input type="hidden" name="confirmed" value="1" />
          <div className="account-security-2fa-remove-actions">
            <Button
              error
              lg
              type="submit"
              className="account-security-2fa-remove-confirm"
            >
              {_('Remove 2FA')}
            </Button>
            <Button
              href={`${base}/account/security/2fa`}
              lg
              className="account-security-2fa-remove-cancel"
            >
              {_('Cancel')}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export function AccountTwoFactorRemoveHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Remove Two-Factor Authentication')}
      description={_('Confirm removal of two-factor authentication.')}
    />
  );
};

export function AccountTwoFactorRemovePage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountTwoFactorRemoveBody />
    </AccountLayout>
  );
};

export const Head = AccountTwoFactorRemoveHead;
export default AccountTwoFactorRemovePage;
