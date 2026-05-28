//modules
import { useState } from 'react';
//frui
import Button from 'frui/Button';
import FieldControl from 'frui/form/FieldControl';
import Input from 'frui/form/Input';
import PasswordInput from 'frui/form/PasswordInput';
import PhoneInput from 'frui/form/PhoneInput';
//stackpress-view
import { useLanguage, useServer } from 'stackpress-view/client';
//stackpress-schema
import { dasherize } from 'stackpress-schema/helpers';
//stackpress-session
import type { Auth, AuthConfigProps } from '../../auth/types.js';
import type { ProfileExtended } from '../../profile/types.js';
import {
  AccountBackHeader,
  AccountCsrfFields,
  AccountHead,
  AccountLayout
} from './helpers.js';
import type { AccountPageProps } from './helpers.js';

type AccountProfile = ProfileExtended & {
  auth?: Record<string, Partial<Auth>>
};


export function AccountUpdateBody() {
  //hooks
  const { _ } = useLanguage();
  const { response } = useServer<
    AuthConfigProps,
    Record<string, unknown>,
    AccountProfile
  >();
  const [ image, setImage ] = useState(response.results?.image || '');
  //variables
  const profile = response.results || {} as AccountProfile;
  const avatar = image || `/avatar/${
    dasherize(profile.name || 'account')
  }.png`;
  const username = profile.auth?.username?.token || '';
  const email = profile.auth?.email?.token || '';
  const phone = profile.auth?.phone?.token || '';
  //render
  return (
    <main className="account-profile-page account-page">
      <AccountBackHeader title={_('Personal Information')} icon="user" />
      <section className="account-card account-profile-card">
        <aside className="account-profile-image-panel">
          <img
            className="account-profile-image"
            src={avatar}
            alt={_('Profile Picture')}
          />
        </aside>
        <form method="post" className="account-form account-profile-form">
          <AccountCsrfFields />
          <FieldControl label={_('Image')} className="account-control">
            <Input
              name="image"
              value={image}
              placeholder={_('Enter your image URL')}
              onChange={e => setImage(e.target.value)}
            />
          </FieldControl>
          <FieldControl label={_('Name')} className="account-control">
            <Input
              name="name"
              defaultValue={profile.name}
              placeholder={_('Enter your full name')}
              required
            />
          </FieldControl>
          <FieldControl label={_('Username')} className="account-control">
            <Input
              name="username"
              defaultValue={username}
              placeholder={_('Enter your username')}
            />
          </FieldControl>
          <FieldControl label={_('Email Address')} className="account-control">
            <Input
              name="email"
              defaultValue={email}
              placeholder={_('Enter your email address')}
            />
          </FieldControl>
          <FieldControl label={_('Phone Number')} className="account-control">
            <PhoneInput
              name="phone"
              defaultCountry="PH"
              defaultValue={phone}
              placeholder={_('Enter your phone number')}
              className="account-phone-input"
            />
          </FieldControl>
          <FieldControl
            label={_('Current Password')}
            className="account-control"
          >
            <PasswordInput
              name="current"
              placeholder={_('Enter your current password')}
            />
            <p className="account-control-note">
              {_(
                'Required only when adding a new username, email, or phone sign-in method.'
              )}
            </p>
          </FieldControl>
          <Button info type="submit" className="account-primary-button">
            {_('Update')}
          </Button>
        </form>
      </section>
    </main>
  );
};

export function AccountUpdateHead(props: AccountPageProps) {
  //hooks
  const { _ } = useLanguage();
  //render
  return (
    <AccountHead
      {...props}
      title={_('Personal Information')}
      description={_('View and update your personal information.')}
    />
  );
};

export function AccountUpdatePage(props: AccountPageProps) {
  //render
  return (
    <AccountLayout {...props}>
      <AccountUpdateBody />
    </AccountLayout>
  );
};

export const Head = AccountUpdateHead;
export default AccountUpdatePage;
