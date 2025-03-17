//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
import mustache from 'mustache';
//stackpress
import type { FileSystem } from '@stackpress/lib/dist/types';
//schema
import type Registry from '../../../schema/Registry';
//local
import { getTableData } from './helpers';

export default function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  //for each model
  for (const model of registry.model.values()) {
    //make new data
    const data = getTableData(model.lists, {
      links: [
        { href: '@stackpress/ink-ui/layout/table', type: 'component', name: 'table-layout' },
        { href: '@stackpress/ink-ui/layout/table/head', type: 'component', name: 'table-head' },
        { href: '@stackpress/ink-ui/layout/table/row', type: 'component', name: 'table-row' },
        { href: '@stackpress/ink-ui/layout/table/col', type: 'component', name: 'table-col' },
        { href: '@stackpress/ink-ui/element/alert', type: 'component', name: 'element-alert' },
        { href: '@stackpress/ink-ui/element/icon', type: 'component', name: 'element-icon' },
        { href: '@stackpress/ink-ui/form/button', type: 'component', name: 'form-button' }
      ],
      headers: [],
      columns: []
    });
    data.links = data.links.filter((link, index, self) => {
      return self.findIndex(l => l.name === link.name) === index
    });
    const file = path.join(
      directory.getPath(), 
      `${model.name}/components/table.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(file, mustache.render(template, data));
  }
};

const template = `

{{#links}}
  <link rel="import" type="{{type}}" href="{{{href}}}.ink" name="{{name}}" />
{{/links}}
<script>
  import mustache from 'mustache';
  import { filter, sort, order } from 'stackpress/template/helpers';
  const { detail, update, rows = [], none = 'No results found.' } = this.props;


  const updateHeaderVisibility = () => {
    const isMobile = window.innerWidth <= 768;
    const actionsHeader = this.querySelector('table-head.mobile-hidden-header');
    if (actionsHeader) {
      const textSpan = actionsHeader.querySelector('span');
      const icon = actionsHeader.querySelector('element-icon');
      if (isMobile) {
        if (textSpan) textSpan.style.display = 'none'; // Hide text
        if (!icon) {
          actionsHeader.innerHTML = '<element-icon name="cog" />'; 
        }
      } else {
        if (textSpan) textSpan.style.display = ''; // Show text
        if (icon && !textSpan) {
          actionsHeader.innerHTML = '<span>Actions</span>'; 
        }
      }
    }
  };

 
  window.addEventListener('load', updateHeaderVisibility);
  window.addEventListener('resize', updateHeaderVisibility);
</script>


<if true={rows.length > 0}>
  <table-layout
    head="py-16 px-12 bg-t-1 b-solid b-black bt-1 bb-0 bx-0 tx-bold" 
    body="py-16 px-12 b-solid b-black bt-1 bb-0 bx-0" 
    odd="bg-t-0"
    even="bg-t-1"
    top
    right
  >
    {{#headers}}
      {{#head}}
        <table-head class="tx-{{direction}}">{{label}}</table-head>
      {{/head}}
      {{#sort}}
        <table-head class="tx-{{direction}}">
          <a class="tx-primary cursor-pointer" href={sort('{{name}}')}>
            {{label}} <element-icon name={order('{{name}}')} />
          </a>
        </table-head>
      {{/sort}}
    {{/headers}}
    <table-head class="mobile-hidden-header tx-left"><span>Actions</span></table-head>
    <each key=i value=data from={rows}>
      <table-row>
        {{#columns}}
          <table-col class="tx-{{direction}}" nowrap>
            {{#column}}
              {{#format}}
                <format-{{method}} {{{attributes}}} value={data.{{name}}} />
              {{/format}}
              {{#none}}
                {data.{{name}}.toString()}
              {{/none}}
            {{/column}}
            {{#filter}}
              <a class="tx-primary cursor-pointer" href={filter('{{name}}', data.{{name}})}>
                {{#format}}
                  <format-{{method}} {{{attributes}}} value={data.{{name}}} />
                {{/format}}
                {{#none}}
                  {data.{{name}}.toString()}
                {{/none}}
              </a>
            {{/filter}}
          </table-col>
        {{/columns}}
        <table-col class="tx-left" nowrap>
          <form-button primary href={mustache.render(detail || '', data)}>
            <element-icon xl3 name="caret-right" />
          </form-button>
        </table-col>
      </table-row>
    </each>
  </table-layout>
<else /> 
  <element-alert info>
    <element-icon name="info-circle" />
    {none}
  </element-alert>
</if>
`.trim();