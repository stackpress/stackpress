//modules
import { useLanguage } from 'r22n';
import Control from 'frui/form/Control';
import Button from 'frui/form/Button';
import Input from 'frui/field/Input';
import Password from 'frui/field/Password';
//views
import type { NestedObject, ServerPageProps } from '../../view/types';
import LayoutBlank from '../../view/layout/LayoutBlank';
import { useServer } from '../../view/server/hooks';
//session
import type { 
  SigninInput, 
  AuthConfigProps,
  AuthExtended
} from '../types';

export type AuthSigninFormProps = {
  input: Partial<SigninInput>;
  errors: NestedObject<string | string[]>;
}

export function AuthSigninForm(props: AuthSigninFormProps) {
  const { input, errors } = props;
  const { _ } = useLanguage();
  return (
    <form className="px-px-10" method="post">
      {input.type === 'phone' ? (
        <Control 
          label={`${_('Phone Number')}*`} 
          error={errors.phone as string|undefined} 
          className="px-pt-20"
        >
          <Input
            name="phone"
            className="block"
            error={!!errors.phone}
            defaultValue={input.phone}
            required
          />
        </Control>
      ) : input.type === 'email' ? (
        <Control 
          label={`${_('Email Address')}*`} 
          error={errors.email as string|undefined} 
          className="px-pt-20"
        >
          <Input
            name="email"
            className="block"
            error={!!errors.email}
            defaultValue={input.email}
            required
          />
        </Control>
      ) : (
        <Control 
          label={`${_('Username')}*`} 
          error={errors.username as string|undefined} 
          className="px-pt-20"
        >
          <Input
            name="username"
            className="block"
            error={!!errors.username}
            defaultValue={input.username}
            required
          />
        </Control>
      )}
      <Control 
        label={`${_('Password')}*`} 
        error={errors.secret as string|undefined} 
        className="px-pt-20"
      >
        <Password
          name="secret"
          error={!!errors.secret}
          defaultValue={input.secret}
          required
        />
      </Control>
      <div className="px-py-20">
        <Button
          className="theme-bc-primary theme-bg-primary border px-w-100-0 !px-px-14 !px-py-8"
          type="submit"
        >
          {_('Sign In')}
        </Button>
      </div>
    </form>
  );
}

export function AuthSigninBody() {
  const { config, request, response } = useServer<
    AuthConfigProps, 
    Partial<SigninInput>, 
    AuthExtended
  >();
  const { _ } = useLanguage();
  const input = { 
    type: 'username',
    ...response.results, 
    ...request.data() 
  } as SigninInput;
  const base = config.path('auth.base', '/auth');
  const options = new Set<string>();
  if (config.path('auth.username')) options.add('username');
  if (config.path('auth.email')) options.add('email');
  if (config.path('auth.phone')) options.add('phone');
  const tabs = options.size > 1 ? Array.from(options).map(option => ({
    icon: option === 'phone' 
      ? 'phone'
      : option === 'email' 
      ? 'envelope'
      : 'user',
    label: option === 'phone' 
      ? _('Phone') 
      : option === 'email' 
      ? _('Email') 
      : _('Username'),
    class: input.type === option 
      ? 'theme-tx1 theme-bg-bg1 relative px-ml-2 px-p-10 inline-flex items-center'
      : 'theme-tx1 theme-bc-bd1 relative px-ml-2 px-p-10 border px-bx-1 px-bt-1 px-bb-0 inline-flex items-center',
    url: `${base}/signin/${option}`
  })): [];
  //render
  return (
    <main className="theme-bg-bg0 px-w-100-0 px-h-100-0 overflow-auto">
      <div className="flex flex-col mx-auto items-center px-w-360">
        {config.has('brand', 'logo') ? (
          <img 
            height="50" 
            alt={config.path('brand.name')} 
            src={config.path('brand.logo')} 
            className="block mx-auto px-mt-20 px-mb-10" 
          />
        ): (
          <h2 className="px-mb-10 px-fs-20 text-center">
            {config.path('brand.name')}
          </h2>
        )}
        <section className="theme-bg-bg1 theme-bc-bd3 border px-w-100-0">
          <header className="theme-bg-bg2 flex items-center px-p-10">
            <i className="fas fa-fw fa-lock"></i>
            <h3 className="px-ml-5 uppercase font-normal px-fs-16">
              {_('Sign In')}
            </h3>
          </header>
          {tabs.length > 0 ? (
            <div className="theme-bg-bg0 flex overflow-x-auto px-pt-5 px-pl-5">
              {tabs.map((tab, index) => (
                <a key={index} href={tab.url} className={tab.class}>
                  <i className={`fas fa-fw fa-${tab.icon}`}></i>
                  <span className="inline-block px-ml-2">{tab.label}</span>
                </a>
              ))}
            </div>
          ) : null}
          <AuthSigninForm errors={response.errors()} input={input} />
        </section>
        <footer className="px-py-10"></footer>
      </div>
    </main>
  );
}

export function AuthSigninHead(props: ServerPageProps<AuthConfigProps>) {
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
      <title>{_('Sign In')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AuthSigninPage(props: ServerPageProps<AuthConfigProps>) {
  return (
    <LayoutBlank head={false} {...props}>
      <AuthSigninBody />
    </LayoutBlank>
  );
}

export const Head = AuthSigninHead;
export default AuthSigninPage;
