//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
//stackress
import type { FileSystem } from '@stackpress/lib/dist/types';
//schema
import type Registry from '../../../../schema/Registry';
import { render } from '../../../../schema/helpers';

const template = `
<link rel="import" type="template" href="stackpress/template/layout/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/pager.ink" name="element-pager" />
<link rel="import" type="component" href="@stackpress/ink-ui/field/input.ink" name="field-input" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="../../components/table.ink" name="{{lower}}-table" />
<link rel="import" type="component" href="../../components/filters.ink" name="{{lower}}-filters" />
<link rel="import" type="component" href="stackpress/template/layout/app.ink" name="admin-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import Papa from 'papaparse/papaparse.min';
  import { _, env, props } from 'stackpress/template/client';
  import { addQueryParam } from 'stackpress/template/helpers';
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

  const {
    q,
    span = {}, 
    filter = {},
    skip = 0,
    take = 50,
  } = request.data || {};

  const {
    error,
    code = 200,
    status = 'OK',
    errors = {},
    results = [],
    total = 0
  } = response;

  const settings = data.admin || { 
    root: '/admin',
    name: 'Admin', 
    logo: '/images/logo-square.png',
    menu: []
  };

  const url = \`\${settings.root}/{{lower}}/search\`;
  const title = _('{{plural}}');
  const links = { 
    create: \`\${settings.root}/{{lower}}/create\`,
    detail: \`\${settings.root}/{{lower}}/detail/{{ids}}\`,
    export: \`\${settings.root}/{{lower}}/export\`,
    import: \`\${settings.root}/{{lower}}/import\`,
    update: \`\${settings.root}/{{lower}}/update/{{ids}}\`
  };
  const crumbs = [
    { icon: 'home', label: 'Home', href: settings.root },
    { icon: '{{icon}}', label: title }
  ];
  const page = (page: number) => {
    window.location.search = addQueryParam(
      window.location.search, 
      'skip', 
      (page - 1) * take
    );
  };
  const init = (e: CustomEvent) => {
    //button wrapper
    const button = e.detail.target;
    //file input in button
    const input = button.querySelector('input');
    //global notifier
    const notifier = document.querySelector('element-notify');
    if (!input) return;
    button.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
      e.preventDefault();
      if (!input?.files?.[0]) return;
      const file = input.files[0];
      Papa.parse(file, { 
        header: true,
        skipEmptyLines: true,
        complete(results: { 
          data: Record<string, unknown>[],
          errors: {
            code: string,
            message: string,
            row: number,
            type: string
          }[]
        }) {
          if (results.errors.length) {
            results.errors.forEach(error => {
              console.error(error);
              if (notifier) {
                notifier.notify('error', \`ROW \${error.row}: \${error.message}\`);
              }
            });
            return;
          }
          const data = new FormData();
          for (let i = 0; i < results.data.length; i++) {
            for (const [ key, value ] of Object.entries(results.data[i])) {
              data.append(\`rows[\${i}][\${key}]\`, value);
            }
          }
          fetch(links.import, {
            method: 'POST',
            body: data,
            headers: { 'Authorization': session.token }
          }).then(response => {
            response.json().then(response => {
              if (response.code === 200) {
                window.location.reload();
              } else if (notifier) {
                if (response.results) {
                  response.results.forEach((result, i) => {
                    const errors = result.errors ? Object.entries(result.errors).map(
                      error => \`\${error[0]}: \${error[1]}\`
                    ): [];
                    notifier.notify('error', [
                      \`ROW \${i}: \${result.error}\`,
                      ...errors
                    ].join(' - '));
                  });
                } else if (response.error) {
                  notifier.notify('error', response.error);
                }
              }
            });
          });
        }
      });
    });
  };
  const toggle = () => {
    const filter = document.querySelector('.filter');
    if (filter?.classList.contains('right-0')) {
      filter?.classList.remove('right-0');
      filter?.classList.add('right--360');
    } else {
      filter?.classList.remove('right--360');
      filter?.classList.add('right-0');
    }
  };
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {settings} {session} {url} {title} {code} {error} {status}>
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
      <main class="flex-grow scroll-auto h-calc-full-38 flex flex-col">
        <div class="flex flex-y-center p-10 justify-between">
          <div class="flex flex-y-center flex-grow">
            {{filterBar}}
            {{searchBar}}
          </div>
          <div class="flex flex-y-center">
            <span mount=init>
              <form-button warning padding={10} class="ml-10">
                <element-icon name="upload" />
                <input type="file" style="display:none" />
              </form-button>
            </span>
              <form-button info padding={10} class="ml-10" href={links.export}>
                <element-icon name="download" />
              </form-button>
              <form-button success padding={10} class="ml-10" href={links.create}>
                <element-icon name="plus" />
              </form-button>
          </div>
        </div>
        <div class="flex-grow p-10">
          <{{lower}}-table 
            rows={results} 
            detail={links.detail} 
            update={links.update} 
            none={_('No Results Found')} 
          />
        </div>
        <div class="p-10">
          <element-pager 
            total={total} 
            range={take} 
            start={skip} 
            show={3} 
            next
            prev
            rewind
            forward
            white
            bold
            bg-info
            border-theme="bd-2"
            square={40}
            {page}
          />
        </div>
      </main>
      <aside class="filter absolute z-5 bottom-0 top-0 right--360 w-360 flex flex-col transition-500">
        <header class="flex flex-center-y bg-t-0 px-5 py-8" click=toggle>
          <element-icon name="chevron-left" class="pr-10 cursor-pointer" />
          <h3 class="tx-upper">{_('Filters')}</h3>
        </header>
        <main class="flex-grow bg-t-1">
          <div class="px-10">
            <{{lower}}-filters {filter} {span} />
          </div>
        </main>
      </aside>
    </admin-app>
  </body>
</html>
`.trim();

export default function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  const searchableTables = ['profile', 'auth', 'application'];
  const filterableTables = ['profile', 'auth', 'application', 'connection', 'file', 'address', 'session'];

  for (const model of registry.model.values()) {
    const file = path.join(
      directory.getPath(), 
      `${model.name}/admin/templates/search.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }

    const searchBar = searchableTables.includes(model.lower.toLowerCase()) ? `
    <if true={results.length > 0}>
      <form class="flex-grow flex flex-y-center">
        <field-input border-white class="flex-grow" name="q" value=q />
        <form-button info padding={10}>
          <element-icon name="search" />
        </form-button>
      </form>
    </if>
  ` : '';
  
  const filterBar = filterableTables.includes(model.lower.toLowerCase()) ? `
    <if true={results.length > 0}>
      <form-button muted padding={10}>
        <element-icon name="filter" click=toggle />
      </form-button>
    </if>
  ` : '';  
  
    const source = render(template, { 
      icon: model.icon || '',
      ids: model.ids.map(column => `{{${column.name}}}`).join('/'),
      lower: model.lower, 
      plural: model.plural,
      searchBar, // show the search bar
      filterBar //show the filter bar
    });

    fs.writeFileSync(file, source);
  }
};
