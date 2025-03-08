//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
//stackress
import type { FileSystem } from '@stackpress/lib/dist/types';
//schema
import type Registry from '@/schema/Registry';
import { render } from '@/schema/helpers';

const template = `
<link rel="import" type="template" href="stackpress/template/layout/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="../../components/view.ink" name="{{lower}}-view" />
<link rel="import" type="component" href="stackpress/template/layout/app.ink" name="admin-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import mustache from 'mustache';
  import { env, props } from 'stackpress/template/client';
  import { _ } from 'stackpress/i18n';

  const { 
    config = {},
    session = { 
      id: 0, 
      token: '', 
      roles: [ 'GUEST' ], 
      permissions: [] 
    },
    response = {}
  } = props('document');

  const {
    error,
    code = 200,
    status = 'OK',
    results = {}
  } = response;

  const settings = config.admin || { 
    root: '/admin',
    name: 'Admin', 
    logo: '/images/logo-square.png',
    menu: []
  };

  const detail = mustache.render('{{template}}', results);
  const url = \`\${settings.root}/{{lower}}/detail/{{ids}}\`;
  const title = detail || _('Profile Detail');
  const links = {
    search: \`\${settings.root}/{{lower}}/search\`,
    update: \`\${settings.root}/{{lower}}/update/{{ids}}\`,
    remove: \`\${settings.root}/{{lower}}/remove/{{ids}}\`,
    restore: \`\${settings.root}/{{lower}}/restore/{{ids}}\`
  };
  const crumbs = [
    { icon: 'home', label: 'Home', href: settings.root },
    { icon: '{{icon}}', label: _('{{plural}}'), href: links.search },
    { label: title }
  ];
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {settings} {session} {url} {title} {code} {status} {error}>
      <header class="p-10 bg-t-1">
        <element-crumbs 
          crumbs={crumbs} 
          block 
          bold 
          white 
          icon-muted
          link-primary
          spacing={2}
        />
      </header>
      <main class="flex-grow p-10 scroll-auto h-calc-full-38">
        <div class="tx-right mb-20">
          <form-button 
            md warning
            href={links.update} 
          >
            <element-icon name="edit" class="mr-5" />
            {_('Update')}
          </form-button>
          <form-button 
            md error
            class={results.active ? 'inline-block' : 'none'}
            href={links.remove} 
          >
            <element-icon name="trash" class="mr-5" />
            {_('Remove')}
          </form-button>
          <form-button 
            md success
            class={!results.active ? 'inline-block' : 'none'}
            href={links.restore} 
          >
            <element-icon name="arrows-rotate" class="mr-5" />
            {_('Restore')}
          </form-button>
        </div>
        <div class="pb-50">
          <{{lower}}-view data={results} />
        </div>
      </main>
    </admin-app>
  </body>
</html>
`.trim();

export default function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  for (const model of registry.model.values()) {
    const file = path.join(
      directory.getPath(), 
      `${model.name}/admin/templates/detail.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    const source = render(template, { 
      icon: model.icon || '',
      ids: model.ids.map(column => `\${results.${column.name}}`).join('/'),
      template: model.template,
      lower: model.lower, 
      plural: model.plural 
    });
    fs.writeFileSync(file, source);
  }
};