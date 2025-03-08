<link rel="import" type="template" href="../layout/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/tab.ink" name="element-tab" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/control.ink" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/input.ink" name="field-input" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/password.ink" name="field-password" />
<link rel="import" type="component" href="../layout/blank.ink" name="blank-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from '../client';
  import { _ } from '../../i18n';

  const { 
    config = {},
    request = {},
    response = {}
  } = props('document');

  const code = response.code || 200;
  const error = response.error;
  const errors = response.errors || {};
  const input = request.data || {};
  const type = input.type || 'username';
  const settings = config.auth || {};
  const label = type === 'phone' 
    ? _('Phone') 
    : type === 'email' 
    ? _('Email') 
    : _('Username');

  const options = new Set<string>();
  if (settings.username) options.add('username');
  if (settings.email) options.add('email');
  if (settings.phone) options.add('phone');
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
      class: type === option 
        ? 'relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0 bg-t-1 tx-t-1 inline-flex flex-center-y'
        : 'relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0 bg-t-0 tx-t-1 inline-flex flex-center-y',
      url: `/auth/signin/${option}`
    })): [];

  const url = `/auth/signin/${type}`;
  const title = _('Sign In');
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial scroll-auto">
    <blank-app {code} status={error} {errors} class="flex flex-col flex-center">
      <if true={settings.logo}>
        <img height="50" alt={settings.name} src={settings.logo} class="block mx-auto mb-10" />
      <elif true={settings.name} />
        <h2 class="mb-10 tx-5xl tx-center">
          {settings.name}
        </h2>
      </if>
      <section class="bg-t-1 b-solid b-t-3 b-1 w-360">
        <header class="flex flex-center-y p-10 bg-t-2">
          <element-icon name="lock" />
          <h3 class="ml-5 tx-upper tx-normal tx-md">{_('Sign In')}</h3>
        </header>
        <if true={tabs.length}>
          <div class="flex scroll-x-auto pt-5 pl-5 bg-t-0">
            <each value=tab from=tabs>
              <a href={tab.url} class={tab.class}>
                <element-icon name={tab.icon} />
                <span class="inline-block ml-2">{tab.label}</span>
              </a>
            </each>
          </div>
        </if>
        <form method="post" class="px-10">
          <form-control class="pt-20 relative z-6" {label} error={errors.name}>
            <field-input 
              class="block" 
              type="text"
              name={type}
              value={input[type]} 
              required
            />
          </form-control>
          <form-control class="pt-20 relative z-4" label="Password" error={errors.password}>
            <field-password class="block" name="secret" required />
          </form-control>
          <form-button class="mt-20 w-full tx-center" type="submit" primary lg>
            {_('Submit')}
          </form-button>
        </form>
        <footer class="tx-center px-10 pt-10 pb-20">
          <hr class="my-15 b-t-0 b-solid" />
          <span>{_('No account?')}</span>
          <a class="tx-info" href="/auth/signup">
            {_('Sign Up')}
          </a>
          <hr class="my-15 b-t-0 b-solid" />
          <span>{_('Forgot your password?')}</span>
          <a class="tx-info" href="/auth/forgot">
            {_('Recover')}
          </a>
        </footer>
      </section>
    </blank-app>
  </body>
</html>