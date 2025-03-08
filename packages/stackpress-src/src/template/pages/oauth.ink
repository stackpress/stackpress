<link rel="import" type="template" href="../layout/head" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/tab" name="element-tab" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/control" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button" name="form-button" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/switch" name="field-switch" />
<link rel="import" type="component" href="../layout/blank" name="blank-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { _, env, props } from 'stackpress/template/client';

  const { 
    config = {},
    //SESSION:
    // id: string, 
    // name: string,
    // image?: string,
    // roles: string[]
    session = { 
      id: 0, 
      token: '', 
      roles: [ 'GUEST' ], 
      permissions: [] 
    },
    request = {},
    response = {}
  } = props('document');

  const redirect = request.data?.redirect_uri || '/';
  //make a revert uri
  const [ uri, query ] = redirect.split('?');
  const params = new URLSearchParams(query);
  params.set('error', 'denied');
  if (state) {
    params.set('state', state);
  }
  const revert = `${uri}?${params.toString()}`;
  //get scopes and endpoints
  const { 
    //SCOPE:
    // icon?: string, 
    // name: string, 
    // description: string
    scopes = {},
    //ENDPOINT:
    // name?: string,
    // description?: string,
    // example?: string,
    // method: Method,
    // route: string,
    // type: 'public'|'app'|'session',
    // scopes?: string[],
    // event: string,
    // priority?: number,
    // data: Record<string, Data>
    endpoints = []
  } = config.api || {};

  //the API scope your client application needs.
  //It tells the Authorization endpoint what kind 
  //of permissions to ask for when displaying the 
  //consent form to the end-user. Use space as 
  //separator if more than one value. If no scope
  //is provided, the app just wants the session data.
  const scope = request.data?.scope;
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
  const application = response.results || {};

  const items = permissions.map(name => {
    const scope = scopes[name];
    if (!scope) return false;
    return {
      id: name,
      icon: scope.icon,
      name: scope.name,
      description: scope.description
    };
  }).filter(Boolean);

  const url = '/auth/oauth';
  const title = _('Grant Access');
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial scroll-auto">
    <blank-app {code} status={error} {errors} class="flex flex-col flex-center">
      <if true={!!app?.logo}>
        <img height="50" alt={app.name} src={app.logo} class="block mx-auto mb-10" />
      <elif true={!!app?.name} />
        <h2 class="mb-10 tx-5xl tx-center">
          {app.name}
        </h2>
      </if>
      <section class="bg-t-1 b-solid b-t-3 b-1 w-360">
        <header class="flex flex-center-y p-10 bg-t-2">
          <element-icon name="lock" />
          <h3 class="ml-5 tx-upper tx-normal tx-md">{title}</h3>
        </header>
        <form method="post" class="px-10">
          <if true={items.length > 0}>
            <p class="b-t-0 b-solid bx-0 bt-0 bb-1 py-10">
              {_('Grant the following permissions:')}
            </p>
            <each value=item from={items}>
              <div class="flex flex-center-y b-t-0 b-solid bx-0 bt-0 bb-1 py-10">
                <div class="flex-grow">
                  <if true={!!item.icon}> 
                    <element-icon name={item.icon} />
                    <span class="ml-5">{item.name}</span>
                  <else />
                    <span>{item.name}</span>
                  </if>
                  <if true={!!item.description}>
                    <p class="tx-sm">{item.description}</p>
                  </if>
                </div>
                <field-switch name="scopes[]" value={item.id} />
              </div>
            </each>
          <else />
            <p class="b-t-0 b-solid bx-0 bt-0 bb-1 py-10">
              {_('%s is asking permissions to access your personal information.', app?.name)}
            </p>
          </if>
          <div class="py-10">
            <form-button class="mt-20 tx-center" type="submit" primary lg>
              {_('Grant')}
            </form-button>
            <form-button href={revert} class="mt-20 tx-center" type="submit" error lg>
              {_('Deny')}
            </form-button>
          </div>
        </form>
      </section>
    </blank-app>
  </body>
</html>