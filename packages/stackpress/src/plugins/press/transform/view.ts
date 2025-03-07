//modules
import type { Directory } from 'ts-morph';
import path from 'node:path';
import mustache from 'mustache';
//stackpress
import type { FileSystem } from '@stackpress/lib/dist/types';
//schema
import type Registry from '../../../schema/Registry';
//local
import { getViewData } from './helpers';

export default function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  //for each model
  for (const model of registry.model.values()) {
    //make new data
    const data = getViewData(model.views, {
      links: [
        { href: '@stackpress/ink-ui/layout/table', type: 'component', name: 'table-layout' },
        { href: '@stackpress/ink-ui/layout/table/row', type: 'component', name: 'table-row' },
        { href: '@stackpress/ink-ui/layout/table/col', type: 'component', name: 'table-col' }
      ],
      columns: []
    });
    data.links = data.links.filter((link, index, self) => {
      return self.findIndex(l => l.name === link.name) === index
    });
    const file = path.join(
      directory.getPath(), 
      `${model.name}/components/view.ink`
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
  const { data = {} } = this.props;
</script>
<table-layout
  head="py-16 px-12 bg-t-1 b-solid b-black bt-1 bb-0 bx-0" 
  body="py-16 px-12 b-solid b-black bt-1 bb-0 bx-0" 
  odd="bg-t-0"
  even="bg-t-1"
>
  {{#columns}}
    <table-row>
      <table-col>{{label}}</table-col>
      <table-col>
        {{#format}}
          <format-{{method}} {{{attributes}}} value={data.{{name}}} />
        {{/format}}
        {{#none}}
          {data.{{name}}.toString()}
        {{/none}}
      </table-col>
    </table-row>
  {{/columns}}
</table-layout>
`.trim();