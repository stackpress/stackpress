//frui
import Button from 'frui/Button';
import FieldControl from 'frui/form/FieldControl';
import PasswordInput from 'frui/form/PasswordInput';
//stackpress-view
import { useLanguage } from 'stackpress-view/client';
//stackpress-session
import {
  AccountBackHeader,
  AccountCsrfFields,
  AccountHead,
  AccountLayout,
  useAccountBase
} from './helpers.js';
import type { AccountPageProps } from './helpers.js';

export function AccountPasswordBody() {
  //hooks
  const { _ } = useLanguage();
  const base = useAccountBase();
  //render
  return (
    <main className="account-password-page account-page">
      <AccountBackHeader
        title={_('Change Password')}
        back={`${base}/account/security`}
      />
      <form method="post" className="account-card account-form">
        <AccountCsrfFields />
        <FieldControl label={_('Current Password')} className="account-control">
          <PasswordInput
            name="current"
            placeholder={_('Enter your current password')}
            required
          />
        </FieldControl>
        <FieldControl label={_('New Password')} className="account-control">
          <PasswordInput
            name="secret"
            placeholder={_('Enter your new password')}
            required
          />
        </FieldControl>
        <Button info type="submit" className="account-primary-button">
          {_('Update Password')}
        </Button>
      </form>
    </main>
  );
};

export function AccountPasswordHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Change Password')}
      description={_('Change the password used to access your account.')}
    />
  );
};

export function AccountPasswordPage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountPasswordBody />
    </AccountLayout>
  );
};

export const Head = AccountPasswordHead;
export default AccountPasswordPage;
