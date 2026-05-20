//modules
import type { ReactNode } from 'react';
//stackpress-view
import type { ServerPageProps } from 'stackpress-view/client';
import {
  LayoutPanel,
  useLanguage,
  useServer
} from 'stackpress-view/client';
//stackpress-session
import type { AuthConfigProps } from '../../auth/types.js';

export type AccountPageProps = ServerPageProps<AuthConfigProps>;

export type AccountBackHeaderProps = {
  title: string,
  icon?: string,
  back?: string
};

export type AccountHeadProps = AccountPageProps & {
  title: string,
  description: string
};

export type AccountLayoutProps = AccountPageProps & {
  children: ReactNode
};

export function useAccountBase() {
  //hooks
  const { config } = useServer<AuthConfigProps>();
  //render
  return config.path('auth.base', '/auth');
};

export function AccountCsrfFields() {
  //hooks
  const { config } = useServer<AuthConfigProps>();
  //variables
  const tokenKey = config.path('csrf.name', 'csrf');
  const token = config.path('csrf.token', '');
  //render
  return <input type="hidden" name={tokenKey} value={token} />;
};

export function AccountBackHeader(props: AccountBackHeaderProps) {
  //props
  const { title, icon, back } = props;
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <div className="account-page-header">
      {back && (
        <a
          className="account-page-back"
          href={back}
          aria-label={_('Back')}
        >
          <i className="fa fa-chevron-left" />
        </a>
      )}
      {icon && <i className={`account-page-title-icon fa fa-${icon}`} />}
      <h1 className="account-page-title">{title}</h1>
    </div>
  );
};

export function AccountHead(props: AccountHeadProps) {
  //props
  const { data, description, request, styles = [], title } = props;
  //variables
  const { favicon = '/favicon.ico' } = data?.brand || {};
  const mimetype = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
      ? 'image/svg+xml'
      : 'image/x-icon';
  //render
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={request.url?.pathname || '/'} />
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
};

export function AccountLayout(props: AccountLayoutProps) {
  //props
  const { children } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const base = props.data.auth?.base || '/auth';
  const menu = [
    {
      name: _('Personal Information'),
      icon: 'user',
      path: `${base}/account`,
      match: `${base}/account`
    },
    {
      name: _('Security Settings'),
      icon: 'lock',
      path: `${base}/account/security`,
      match: `${base}/account/security`
    }
  ];
  //render
  return (
    <LayoutPanel {...props} menu={menu}>
      {children}
    </LayoutPanel>
  );
};
