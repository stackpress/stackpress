import 'frui/frui.css';
import 'stackpress/fouc.css';

import type { NestedObject, PageHeadProps, PageBodyProps, 
AdminDataProps } from 'stackpress/view';
import type { ProfileInput, ProfileExtended } from '../types';

import { useLanguage } from 'r22n';
import { Crumbs, LayoutAdmin } from 'stackpress/view';
import Button from 'frui/element/Button';

import { ActiveControl } from '../components/fields/ActiveField';
import { ImageControl } from '../components/fields/ImageField';
import { NameControl } from '../components/fields/NameField';
import { ReferencesControl } from '../components/fields/ReferencesField';
import { RolesControl } from '../components/fields/RolesField';
import { TypeControl } from '../components/fields/TypeField';

export function AdminProfileUpdateCrumbs(props: {
  results: ProfileExtended
}) {
  const { results } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const crumbs = [
    {
      label: (<span className="theme-info">{_('Profiles')}</span>),
      icon: 'user',
      href: '../search'
    },
    {
      label: (<span className="theme-info">{results.name}</span>),
      icon: 'user',
      href: `detail/${results.id}`
    },
    {
      label: _('Update'),
      icon: 'edit'
    }
  ];
  return (<Crumbs crumbs={crumbs} />);
}

export function AdminProfileUpdateForm(props: { 
  input: Partial<ProfileInput>,
  errors: NestedObject<string | string[]>
}) {
  const { input, errors } = props;
  const { _ } = useLanguage();
  return (
    <form method="post">
      <TypeControl 
        className="px-mb-20"
        value={input.type} 
        error={errors.type?.toString()} 
      />
      <NameControl 
        className="px-mb-20"
        value={input.name} 
        error={errors.name?.toString()} 
      />
      <ImageControl 
        className="px-mb-20"
        value={input.image} 
        error={errors.image?.toString()} 
      />
      <RolesControl 
        className="px-mb-20"
        value={input.roles} 
        error={errors.roles?.toString()} 
      />
      <ReferencesControl 
        className="px-mb-20"
        value={input.references} 
        error={errors.references?.toString()} 
      />
      <ActiveControl 
        className="px-mb-20"
        value={input.active} 
        error={errors.active?.toString()} 
      />
      <div>
        <Button 
          className="theme-bc-bd2 theme-bg-bg2 border !px-px-14 !px-py-8 px-mr-5" 
          type="submit"
        >
          <i className="text-sm fas fa-fw fa-save"></i>
          {_('Save')}
        </Button>
      </div>
    </form>
  ); 
}

export function AdminProfileUpdateBody(props: PageBodyProps<
  AdminDataProps, 
  Partial<ProfileInput>, 
  ProfileExtended
>) {
  const { request, response } = props;
  const input = response.results || request.data || {};
  const errors = response.errors || {};
  const results = response.results as ProfileExtended;
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-px-10 px-py-14 theme-bg-bg2">
        <AdminProfileUpdateCrumbs results={results}  />
      </div>
      <div className="px-p-10">
        <AdminProfileUpdateForm errors={errors} input={input} />
      </div>
    </main>
  );
}

export function AdminProfileUpdateHead(props: PageHeadProps<
  AdminDataProps, 
  Partial<ProfileInput>, 
  ProfileExtended
>) {
  const { data, styles = [] } = props;
  const { _ } = useLanguage();
  return (
    <>
      <title>{_('Update Profile')}</title>
      {data.icon && <link rel="icon" type="image/svg+xml" href={data.icon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );  
}

export function AdminProfileUpdatePage(props: PageBodyProps<
  AdminDataProps, 
  Partial<ProfileInput>, 
  ProfileExtended
>) {
  const { data, session, request } = props;
  const theme = request.session.theme as string | undefined;
  const {
    root = '/admin',
    name = 'Admin',
    logo = '/images/logo-square.png',
    menu = []
  } = data.admin;
  const path = request.url.pathname;
  return (
    <LayoutAdmin
      theme={theme} 
      brand={name}
      base={root}
      logo={logo}
      path={path} 
      menu={menu}
      session={session}
    >
      <AdminProfileUpdateBody {...props} />
    </LayoutAdmin>
  );
}

export const Head = AdminProfileUpdateHead;
export default AdminProfileUpdatePage;