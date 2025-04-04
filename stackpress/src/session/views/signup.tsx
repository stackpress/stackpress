//modules
import { useLanguage } from 'r22n';
import Control from 'frui/form/Control';
import Button from 'frui/form/Button';
import Input from 'frui/field/Input';
import Password from 'frui/field/Password';
//views
import type { NestedObject, ServerPageProps } from '../../types';
import LayoutBlank from '../../view/layout/LayoutBlank';
import { useServer } from '../../view/server/hooks';
//session
import type { 
  SignupInput, 
  AuthConfigProps,
  Auth
} from '../types';

export type AuthSignupFormProps = {
  input: Partial<SignupInput>;
  errors: NestedObject<string | string[]>;
}

export function AuthSignupForm(props: AuthSignupFormProps) {
  const { input, errors } = props;
  const { _ } = useLanguage();
  
  return (
    <form className="px-px-10" method="post">
      <Control 
        label={`${_('Name')}*`} 
        error={errors.email as string|undefined} 
        className="px-pt-20"
      >
        <Input
          name="name"
          className="block"
          error={!!errors.email}
          defaultValue={input.email}
          required
        />
      </Control>
      <Control 
        label={_('Email Address')} 
        error={errors.email as string|undefined} 
        className="px-pt-20"
      >
        <Input
          name="email"
          className="block"
          error={!!errors.email}
          defaultValue={input.email}
        />
      </Control>
      <Control 
        label={_('Phone Number')} 
        error={errors.phone as string|undefined} 
        className="px-pt-20"
      >
        <Input
          name="phone"
          className="block"
          error={!!errors.phone}
          defaultValue={input.phone}
        />
      </Control>
      <Control 
        label={_('Username')} 
        error={errors.username as string|undefined} 
        className="px-pt-20"
      >
        <Input
          name="username"
          className="block"
          error={!!errors.username}
          defaultValue={input.username}
        />
      </Control>
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
          {_('Sign Up')}
        </Button>
      </div>
    </form>
  );
}

export function AuthSignupBody() {
  const { config, request, response } = useServer<
      AuthConfigProps, 
      Partial<SignupInput>, 
      Auth
    >();
  const input = { 
    ...response.results, 
    ...request.data() 
  } as SignupInput;
  const errors = response.errors();
  const { _ } = useLanguage();
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
            <i className="fas fa-fw fa-user"></i>
            <h3 className="px-ml-5 uppercase font-normal px-fs-16">
              {_('Sign Up')}
            </h3>
          </header>
          <AuthSignupForm errors={errors} input={input} />
        </section>
        <footer className="px-py-10"></footer>
      </div>
    </main>
  );
}

export function AuthSignupHead(props: ServerPageProps<AuthConfigProps>) {
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
      <title>{_('Signup')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function AuthSignupPage(props: ServerPageProps<AuthConfigProps>) {
  return (
    <LayoutBlank head={false} {...props}>
      <AuthSignupBody />
    </LayoutBlank>
  );
}

export const Head = AuthSignupHead;
export default AuthSignupPage;
