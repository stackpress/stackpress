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

export function AccountRemoveBody() {
  //hooks
  const { _ } = useLanguage();
  const base = useAccountBase();
  //render
  return (
    <main className="account-remove-page account-page">
      <AccountBackHeader
        title={_('Delete Account')}
        back={`${base}/account/security`}
      />
      <form method="post" className="account-card account-form">
        <AccountCsrfFields />
        <input type="hidden" name="confirmed" value="true" />
        <FieldControl label={_('Password')} className="account-control">
          <PasswordInput
            name="secret"
            placeholder={_('Enter your password to confirm')}
            required
          />
        </FieldControl>
        <Button error type="submit" className="account-danger-button">
          {_('Delete Account')}
        </Button>
      </form>
    </main>
  );
};

export function AccountRemoveHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Delete Account')}
      description={_('Confirm deletion of your account.')}
    />
  );
};

export function AccountRemovePage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountRemoveBody />
    </AccountLayout>
  );
};

export const Head = AccountRemoveHead;
export default AccountRemovePage;
