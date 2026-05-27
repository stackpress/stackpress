//modules
import { notify } from 'frui/Notifier';
import Button from 'frui/Button';
import FieldControl from 'frui/form/FieldControl';
import Input from 'frui/form/Input';
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

type TwoFactorResults = {
  url?: string,
  secret?: string,
  authId?: string
};

export function AccountTwoFactorBody() {
  //hooks
  const { _ } = useLanguage();
  const base = useAccountBase();
  const { request, response } = useServer<
    AuthConfigProps,
    Record<string, unknown>,
    TwoFactorResults
  >();
  //variables
  const redirect = request.data.path<string>(
    'redirect_uri',
    `${base}/account/security/2fa`
  );
  const url = response.results?.url || '';
  const secret = response.results?.secret || '';
  const authRecordId = response.results?.authId || '';
  //render
  return (
    <main className="account-security-2fa-detail-page account-page">
      <AccountBackHeader
        title={_('Two-Factor Authentication')}
        back={`${base}/account/security`}
      />

      <form method="post" className="account-security-2fa-detail-form">
        <AccountCsrfFields />
        <input type="hidden" name="redirect_uri" value={redirect} />
        {authRecordId && (
          <input type="hidden" name="authId" value={authRecordId} />
        )}

        {url && (
          <FieldControl
            className="account-security-2fa-detail-control"
            label={_('Scan the QR code using Authenticator App')}
          >
            <img
              src={url}
              alt={_('QR Code for Two-Factor Authentication')}
              className="account-security-2fa-detail-qr"
            />
          </FieldControl>
        )}

        <FieldControl
          className="account-security-2fa-detail-control"
          label={_('Or Copy the Secret Key')}
        >
          <Input
            type="text"
            name="secret"
            value={secret}
            readOnly
            className="account-security-2fa-detail-secret"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(secret);
                notify('success', _('Secret key copied to clipboard.'));
              }
            }}
          />
        </FieldControl>

        <a
          className="account-security-2fa-detail-regenerate"
          href={`${base}/account/security/2fa?regenerate`}
        >
          {_('Regenerate Secret')}
        </a>

        <FieldControl
          className="account-security-2fa-detail-otp-control"
          label={_('Enter the code from your Authenticator App')}
        >
          <input
            className="otp-field account-security-2fa-detail-otp"
            type="text"
            name="code"
            maxLength={6}
            autoComplete="off"
            required
          />
        </FieldControl>

        <Button info xl2 className="account-security-2fa-detail-verify-btn">
          {_('Verify')}
        </Button>
        <input type="hidden" name="secret" value={secret} />

        {authRecordId && (
          <Button
            href={`${base}/account/security/2fa/remove?authId=${
              encodeURIComponent(authRecordId)
            }&redirect_uri=${encodeURIComponent(redirect)}`}
            error
            lg
            className="account-security-2fa-detail-remove-btn"
          >
            {_('Remove 2FA')}
          </Button>
        )}
      </form>
    </main>
  );
};

export function AccountTwoFactorHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Two-Factor Authentication')}
      description={_('Manage two-factor authentication for your account.')}
    />
  );
};

export function AccountTwoFactorPage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountTwoFactorBody />
    </AccountLayout>
  );
};

export const Head = AccountTwoFactorHead;
export default AccountTwoFactorPage;
