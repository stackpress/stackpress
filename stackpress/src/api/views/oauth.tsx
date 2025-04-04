//modules
import { useLanguage } from 'r22n';
import Button from 'frui/form/Button';
import Switch from 'frui/field/Switch';
//views
import type { ServerPageProps } from '../../view/types';
import LayoutBlank from '../../view/layout/LayoutBlank';
import { useServer } from '../../view/server/hooks';
//api
import type { 
  Scopes,
  ApiOauthInputProps,
  ApiOauthFormProps,
  ApiConfigProps, 
  ApplicationExtended 
} from '../types';

export function ApiOauthForm(props: ApiOauthFormProps) {
  const { appName, revert, items } = props;
  const { _ } = useLanguage();
  
  return (
    <form method="post">
      {items.length > 0 ? (
        <div>
          <p className="b-t-0 b-solid bx-0 bt-0 bb-1 py-10">
            {_('Grant the following permissions:')}
          </p>
          {items.map((item, index) => (
            <div key={index} className="flex flex-center-y b-t-0 b-solid bx-0 bt-0 bb-1 py-10">
              <div className="flex-grow">
                <span>
                  {item.icon ? (
                    <i className={`fas fa-fw fa-${item.icon}`}></i>
                  ) : null}
                  {item.name}
                </span>
                {!!item.description ? (
                  <p className="tx-sm">{item.description}</p>
                ) : null}
              </div>
              <Switch name="scopes[]" value={item.id} />
            </div>
          ))}
        </div>
      ) : (
        <p className="b-t-0 b-solid bx-0 bt-0 bb-1 py-10">
          {_('%s is asking permissions to access your personal information.', appName)}
        </p>
      )}
      <div className="px-pt-20">
        <Button
          className="theme-bc-primary theme-bg-primary border !px-px-14 !px-py-8"
          type="submit"
        >
          {_('Grant')}
        </Button>
        <a 
          className="theme-bc-error theme-bg-primary border px-px-14 px-py-8"
          href={revert}
        >
          {_('Deny')}
        </a>
      </div>
    </form>
  );
}

export function OAuthBody() {
  const { config, request, response } = useServer<
    ApiConfigProps,
    Partial<ApiOauthInputProps>,
    ApplicationExtended
  >();
  //make a revert uri
  const redirect = request.data.path('redirect_uri', '/');
  const [ uri, query ] = redirect.split('?');
  const params = new URLSearchParams(query);
  params.set('error', 'denied');
  const revert = `${uri}?${params.toString()}`;

  //the API scope your client application needs.
  //It tells the Authorization endpoint what kind 
  //of permissions to ask for when displaying the 
  //consent form to the end-user. Use space as 
  //separator if more than one value. If no scope
  //is provided, the app just wants the session data.
  const scope = request.data.path('scope', '');
  const scopes = config.path<Scopes>('api.scopes', {});
  //PERMISSIONS: [ 'profile-write', 'auth-read' ]
  const permissions = scope ? scope.split(' ') : [];
  //APPLICATION:
  // id: string;
  // name: string;
  // logo?: string;
  // website?: string;
  // secret: string;
  // scopes: string[];
  // active: boolean;
  // expires: Date;
  // created: Date;
  // updated: Date;
  const application = response.results;
  const appName = application?.name || 'Unknown';

  const items = permissions.map(name => {
    const scope = scopes[name];
    if (!scope) return false;
    return {
      id: name,
      icon: scope.icon,
      name: scope.name,
      description: scope.description
    };
  }).filter(Boolean) as {
    id: string;
    icon: string | undefined;
    name: string;
    description: string;
  }[];
  const { _ } = useLanguage();
  //render
  return (
    <main className="flex flex-col px-h-100-0 theme-bg-bg0 relative">
      <div className="px-p-10">
        {config.has('brand', 'logo') ? (
          <img 
            height="50" 
            alt={config.path('brand.name')} 
            src={config.path('brand.logo')} 
            className="block mx-auto px-mb-10" 
          />
        ): (
          <h2 className="px-mb-10 px-fs-20 text-center">
            {config.path('brand.name')}
          </h2>
        )}
        <section className="theme-bg-bg1 theme-bc-bd3 border px-w-360">
          <header className="theme-bg-bg2 flex items-center px-p-10">
            <i className="fas fa-fw fa-user"></i>
            <h3 className="px-ml-5 uppercase font-normal px-fs-16">
              {_('Sign Up')}
            </h3>
          </header>
          <ApiOauthForm appName={appName} revert={revert} items={items} />
        </section>
      </div>
    </main>
  );
}

export function ApiOauthHead(props: ServerPageProps<ApiConfigProps>) {
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
      <title>{_('Grant Access')}</title>
      {favicon && <link rel="icon" type={mimetype} href={favicon} />}
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function ApiOauthPage(props: ServerPageProps<ApiConfigProps>) {
  return (
    <LayoutBlank {...props}>
      <OAuthBody />
    </LayoutBlank>
  );
}

export const Head = ApiOauthHead;
export default ApiOauthPage;
