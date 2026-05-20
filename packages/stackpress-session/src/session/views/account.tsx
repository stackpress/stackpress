//frui
import Table from 'frui/Table';
//stackpress-view
import { useLanguage, useServer } from 'stackpress-view/client';
//stackpress-schema
import { dasherize } from 'stackpress-schema/helpers';
//stackpress-session
import type { Auth, AuthConfigProps } from '../../auth/types.js';
import type { ProfileExtended } from '../../profile/types.js';
import {
  AccountHead,
  AccountLayout,
  useAccountBase
} from './helpers.js';
import type { AccountPageProps } from './helpers.js';

type AccountProfile = ProfileExtended & {
  auth?: Record<string, Partial<Auth>>
};

type AccountProfileField = {
  label: string,
  value?: string | number | null
};

export function AccountProfileBody() {
  //hooks
  const { _ } = useLanguage();
  const base = useAccountBase();
  const { response } = useServer<
    AuthConfigProps,
    Record<string, unknown>,
    AccountProfile
  >();
  //variables
  const profile = response.results || {} as AccountProfile;
  const avatar = profile.image || `/avatar/${
    dasherize(profile.name || 'account')
  }.png`;
  const username = profile.auth?.username?.token || '';
  const email = profile.auth?.email?.token || '';
  const phone = profile.auth?.phone?.token || '';
  const fields: AccountProfileField[] = [
    { label: _('Name'), value: profile.name },
    { label: _('Username'), value: username },
    { label: _('Email Address'), value: email },
    { label: _('Phone Number'), value: phone }
  ];
  //render
  return (
    <main className="account-profile-page account-page">
      <div className="account-page-header">
        <i className="account-page-title-icon fa fa-user" />
        <h1 className="account-page-title">{_('Personal Information')}</h1>
        <div className="actions account-profile-actions">
          <a className="action update" href={`${base}/account/update`}>
            <i className="icon fas fa-edit"></i>
            {_('Update')}
          </a>
        </div>
      </div>
      <section className="account-card account-profile-card">
        <aside className="account-profile-image-panel">
          <img
            className="account-profile-image"
            src={avatar}
            alt={_('Profile Picture')}
          />
        </aside>
        <Table
          className="account-profile-details w-full"
          column={[ 'admin-table-even', 'admin-table-odd' ]}
          head="admin-table-head"
        >
          {fields.map((field, index) => (
            <Table.Row key={field.label} index={index}>
              <Table.Col noWrap addClassName="results-label">
                {field.label}
              </Table.Col>
              <Table.Col noWrap addClassName="results-value">
                {field.value || '-'}
              </Table.Col>
            </Table.Row>
          ))}
        </Table>
      </section>
    </main>
  );
};

export function AccountProfileHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Personal Information')}
      description={_('View your personal information.')}
    />
  );
};

export function AccountProfilePage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountProfileBody />
    </AccountLayout>
  );
};

export const Head = AccountProfileHead;
export default AccountProfilePage;
