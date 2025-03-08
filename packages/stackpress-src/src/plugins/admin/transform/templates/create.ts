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
<link rel="import" type="component" href="stackpress/template/layout/app.ink" name="admin-app" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="../../components/form.ink" name="{{lower}}-form" />
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
    session = { 
      id: 0, 
      token: '', 
      roles: [ 'GUEST' ], 
      permissions: [] 
    },
    request = {},
    response = {}
  } = props('document');

  const { 
    input = {{defaults}}
  } = request.data || {};

  const {
    error,
    code = 200,
    status = 'OK',
    errors = {}
  } = response;

  const settings = config.admin || { 
    root: '/admin',
    name: 'Admin', 
    logo: '/images/logo-square.png',
    menu: []
  };

  const url = \`\${settings.root}/{{lower}}/create\`;
  const title = _('Create {{singular}}');
  const links = { search: \`\${settings.root}/{{lower}}/search\` };
  const crumbs = [
    { icon: 'home', label: 'Home', href: settings.root },
    { icon: '{{icon}}', label: _('{{plural}}'), href: links.search },
    { icon: 'plus', label: title }
  ];
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {settings} {session} {url} {title} {code} {status} {error} {errors}>
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
        <div class="pb-50">
          <{{lower}}-form {input} {errors} action={url} />
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
      `${model.name}/admin/templates/create.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    const defaults = model.defaults;
    // Json: 'string'
    // Object: 'string'
    // Hash: 'string'
    const hash = [ 'Json', 'Object', 'Hash' ];
    Array.from(model.columns.values()).filter(
      column => column.multiple || hash.includes(column.type)
    ).map(column => column.name).forEach(name => {
      if (typeof defaults[name] === 'string') {
        try {
          const json = JSON.parse(defaults[name]);
          if (Array.isArray(json) || (json && typeof json === 'object')) {
            defaults[name] = json;
          }
        } catch(e) {}
      }
    });
    const source = render(template, { 
      icon: model.icon || '',
      defaults: JSON.stringify(defaults),
      lower: model.lower, 
      singular: model.singular,
      plural: model.plural 
    });
    fs.writeFileSync(file, source);
  }
};