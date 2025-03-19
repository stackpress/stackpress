<link rel="import" type="template" href="@/plugins/app/layouts/head.ink" name="html-head" />
<link rel="import" type="template" href="@/plugins/app/layouts/header.ink" name="app-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { _, env, props } from 'stackpress/template/client';
  const {
    data = {},
    session = { 
      id: 0, 
      token: '', 
      roles: [ 'GUEST' ], 
      permissions: [] 
    },
    request = {},
    response = {}
  } = props('document');

  const title = _('Home Page');
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-1 tx-t-1 tx-arial">
    <app-head />
    <main class="p-10">
      <h1 class="pt-10 pb-20">{_('Home Page')}</h1>
      <p>
        Welcome to the home page.
      </p>
    </main>
  </body>
</html>