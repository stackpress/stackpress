<link rel="import" type="template" href="@stackpress/incept-admin/dist/components/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/tab.ink" name="element-tab" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/control.ink" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/switch.ink" name="field-switch" />
<link rel="import" type="component" href="@stackpress/incept-admin/dist/components/blank.ink" name="blank-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from '@stackpress/ink';
  import { _ } from '@stackpress/incept-i18n';

  const { 
    code = 200, 
    status = 'OK', 
    error,
    errors = {}, 
    revert,
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
    endpoints = [],
    //PERMISSIONS: [ 'profile-write', 'auth-read' ]
    permissions = [],
    //SESSION:
    // id: string, 
    // name: string,
    // image?: string,
    // roles: string[]
    session,
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
    application: app
  } = props('document');

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