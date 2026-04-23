//modules
import { useLanguage } from 'r22n';
import { useEffect } from 'react';
import Input from 'frui/form/Input';
import FieldControl from 'frui/form/FieldControl';
import Button from 'frui/Button';
import { notify } from 'frui/Notifier';
//views
import type { AuthConfigProps, ServerConfigProps, ServerPageProps } from '../../../../types';
import LayoutAccount from '../../../../view/layout/LayoutAccount';
//session
import { Auth, Profile } from '../../../types';
//hooks
import { useServer } from '../../../../view/server/hooks.js';

export type ProfileAuth = Profile & { auth: Auth[] };

type ResponseData = {
  url: string,
  secret: string,
  authRecordId?: string
};

export function AuthSecurity2FASetupBody() {
  //hooks
  const { _ } = useLanguage();
  const { config, response } = useServer<AuthConfigProps, {}, ResponseData>();
  //variables
  const base = config.path('auth.base', '/auth');
  const url = response.results?.url || '';
  const secret = response.results?.secret || '';
  const authRecordId = response.results?.authRecordId;
  //csrf
  const csrf = {
    name: config.path('csrf.name', 'csrf'),
    token: config.path('csrf.token', '')
  }
  //effects
  useEffect(() => {
    if (response.error) {
      notify('error', response.error);
    }
  }, []);
  //render
  return (
    <main className="account-security-2fa-setup-page">
      <div className="account-security-2fa-setup-header">
        <a 
          className="account-security-2fa-setup-back" 
          href={`${base}/account/security`}
        >
          <i className="fa fa-chevron-left" />
        </a>
        <h1 className="account-security-2fa-setup-title">
          {_('Two-Factor Authentication')}
        </h1>
      </div>
      <form method="post" className="account-security-2fa-setup-form">
        {/* CSRF Token and Auth Record ID */}
        <input type="hidden" name={csrf.name} value={csrf.token} />
        <input type="hidden" name="authId" value={authRecordId}/>
        {url && (
          <FieldControl
            className="account-security-2fa-setup-control"
            label={_('Scan the QR code using Authenticator App')}
          >
            <img 
              src={url} 
              alt={_('QR Code for Two-Factor Authentication')} 
              className="account-security-2fa-setup-qr"
            />
          </FieldControl>
        )}
        <FieldControl
          className="account-security-2fa-setup-control"
          label={_('Or Copy the Secret Key')}
        >
          <Input 
            type="text" 
            name="secret" 
            value={secret} 
            readOnly 
            className="account-security-2fa-setup-secret"
            onClick={() => {
              navigator.clipboard.writeText(secret);
              notify('success', _('Secret key copied to clipboard.'));
            }}
          />
        </FieldControl>
        <a
          className="account-security-2fa-setup-regenerate"
          href={`${base}/account/security/2fa?regenerate`}
        >
          {_('Regenerate Secret')}
        </a>
        <FieldControl
          className="account-security-2fa-setup-otp-control"
          label={_('Enter the code from your Authenticator App')}
        >
          <input
            className="otp-field account-security-2fa-setup-otp" 
            type="text" 
            name="code" 
            maxLength={6} 
            autoComplete="off"
            />
        </FieldControl>
        <Button info xl2 className="account-security-2fa-setup-verify-btn">
          {_('Verify')}
        </Button>
        <input type="hidden" name="secret" value={secret} />
        {authRecordId && (
          <form
            method="post" 
            action={`${base}/account/security/2fa/remove`}
            className="account-security-2fa-setup-remove-form"
          >
            {/* CSRF Token and Auth Record ID */}
            <input type="hidden" name={csrf.name} value={csrf.token} />
            <input type="hidden" name="authId" value={authRecordId}/>
            <Button
              type="submit"
              error 
              lg
              className="account-security-2fa-setup-remove-btn" 
            >
              {_('Remove 2FA')}
            </Button>
          </form>
        )}
      </form>
    </main>
  );
};

export function AuthSecurity2FASetupHead(props: ServerPageProps<AuthConfigProps>) {
  const { data, styles = [] } = props;
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const { _ } = useLanguage();
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
    ? 'image/svg+xml'
    : 'image/x-icon';
  return (
    <>
      <title>{_('Two-Factor Authentication - Security Settings')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AuthSecurity2FASetupPage(props: ServerPageProps<ServerConfigProps>) {
  const { data, request, response, session } = props;
  return (
    <LayoutAccount
      data={data}
      request={request}
      response={response}
      session={session}
    >
      <AuthSecurity2FASetupBody />
    </LayoutAccount>
  );
};

export const Head = AuthSecurity2FASetupHead;
export default AuthSecurity2FASetupPage;