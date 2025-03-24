//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
//stackress
import type { FileSystem } from '@stackpress/lib/dist/types';
//schema
import type Model from '../../../../schema/spec/Model';
import type Registry from '../../../../schema/Registry';
import { render } from '../../../../schema/helpers';

const template = `
<link rel="import" type="template" href="stackpress/template/layout/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/tab.ink" name="element-tab" />
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
  import { _, env, props } from 'stackpress/template/client';

  const { 
    data = {},
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

  const settings = data.admin || { 
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
        <div class="flex flex-center-y scroll-x-auto">
          {{#tabs}}
            {{#active}}
              <div class="relative mr-4 px-15 py-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0 bg-t-2">
                {{{label}}}
              </div>
            {{/active}}
            {{#tab}}
              <a
                class="relative mr-4 px-15 py-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0 bg-t-1 tx-muted"
                href="{{href}}"
                title="{{{label}}}"
              >
                {{{label}}}
              </a>
            {{/tab}}
          {{/tabs}}
        </div>
        <div class="py-20 px-10 mb-50 bg-t-2">
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
    //now loop through the fieldset fields
    const tabs = [
      { 
        active: {
          label: `{_('Info')}`
        }
      },
      ...model.related.filter(
        column => !column.related?.child.column.multiple
      ).map(column => {
        //NOTE: this would never happen...
        if (!column.related) return;
        const model = column.related.child.model as Model;
        return { 
          tab: {
            label: model.plural, 
            href: `/admin/${model.dash}/detail/${model.ids.map(
              column => `\${results.${column.name}}`
            ).join('/')}`
          }
        };
      })
    ];
    const file = path.join(
      directory.getPath(), 
      `${model.name}/admin/templates/detail.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    const source = render(template, { 
      tabs,
      icon: model.icon || '',
      ids: model.ids.map(column => `\${results.${column.name}}`).join('/'),
      template: model.template,
      lower: model.lower, 
      plural: model.plural 
    });
    fs.writeFileSync(file, source);
  }
};