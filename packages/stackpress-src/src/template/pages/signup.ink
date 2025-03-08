<link rel="import" type="template" href="../layout/head" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/control" name="form-control" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button" name="form-button" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/input" name="field-input" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/password" name="field-password" />
<link rel="import" type="component" href="../layout/blank" name="blank-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from 'stackpress/template/client';
  import { _ } from 'stackpress/i18n';

  const { 
    config = {},
    request = {},
    response = {}
  } = props('document');

  const code = response.code || 200;
  const error = response.error;
  const errors = response.errors || {};
  const input = request.data || {};
  const settings = config.auth || {};

  const url = '/auth/signup';
  const title = _('Sign Up');
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
          <element-icon name="user" />
          <h3 class="ml-5 tx-upper tx-normal tx-md">{_('Sign Up')}</h3>
        </header>
        <form method="post" class="px-10">
          <form-control class="pt-20 relative z-6" label="Name" error={errors.name}>
            <field-input 
              class="block" 
              type="text"
              name="name" 
              value={input.name} 
              required
            />
          </form-control>
          <form-control class="pt-20 relative z-6" label="Email" error={errors.email}>
            <field-input 
              class="block" 
              type="email"
              name="email" 
              value={input.email} 
              required
            />
          </form-control>
          <form-control class="pt-20 relative z-6" label="Phone" error={errors.phone}>
            <field-input 
              class="block" 
              type="text"
              name="phone" 
              value={input.phone} 
              required
            />
          </form-control>
          <form-control class="pt-20 relative z-6" label="Username" error={errors.username}>
            <field-input 
              class="block" 
              type="text"
              name="username" 
              value={input.username} 
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
          <span>{_('Already have an account?')}</span>
          <a class="tx-info" href="/auth/signin">
            {_('Sign In')}
          </a>
        </footer>
      </section>
    </blank-app>
  </body>
</html>