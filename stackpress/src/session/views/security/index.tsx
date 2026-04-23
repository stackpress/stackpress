//modules
import { useLanguage } from 'r22n';
//views
import type {
  AuthConfigProps,
  ServerConfigProps,
  ServerPageProps
} from '../../../types';
import LayoutAccount from '../../../view/layout/LayoutAccount.js';
//hooks
import { useServer } from '../../../view/server/hooks.js';

export function AuthSecurityBody() {
  //hooks
  const { _ } = useLanguage();
  const { config } = useServer<AuthConfigProps>();
  //variables
  const base = config.path('auth.base', '/auth');

  return (
    <main className="account-security-index-page">
      <div className="account-security-index-header">
        <h1 className="account-security-index-title">
          {_('Security Settings')}
        </h1>
      </div>

      <div className="account-security-index-card">
        <a
          href={`${base}/account/security/2fa`}
          className="account-security-index-link"
        >
          <span className="account-security-index-link-label">
            {_('Set Up Two-Factor Authentication')}
          </span>
          <i className="fas fa-fw fa-chevron-right account-security-index-link-icon" />
        </a>
      </div>
    </main>
  );
};

export function AuthSecurityHead(props: ServerPageProps<AuthConfigProps>) {
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
      <title>{_('Security Settings')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AuthSecurityPage(props: ServerPageProps<ServerConfigProps>) {
  const { data, request, response, session } = props;
  return (
    <LayoutAccount
      data={data}
      request={request}
      response={response}
      session={session}
    >
      <AuthSecurityBody />
    </LayoutAccount>
  );
};

export const Head = AuthSecurityHead;
export default AuthSecurityPage;
