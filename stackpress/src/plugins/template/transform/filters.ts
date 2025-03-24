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
import type { FilterData } from './types';
import { getFilterFields } from './helpers';

export default function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  //for each model
  for (const model of registry.model.values()) {
    //make new data
    const data: FilterData = {
      links: [
        { href: '@stackpress/ink-ui/form/control', type: 'component', name: 'form-control' },
        { href: '@stackpress/ink-ui/form/button', type: 'component', name: 'form-button' }
      ],
      fields: []
    };
    //add model fields (less the fieldset)
    data.fields = getFilterFields(model.filters, data.links);
    data.links = data.links.filter((link, index, self) => {
      return self.findIndex(l => l.name === link.name) === index
    });
    const file = path.join(
      directory.getPath(), 
      `${model.name}/components/filters.ink`
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
  const { filter = {}, span = {}, errors = {} } = this.props;
</script>
<form>
  {{#fields}}
    {{#filter}}
      <form-control class="pt-20 relative{{zindex}}" label="{{label}}" error={errors.{{name}}}>
        <field-{{method}} 
          class="block" 
          name="filter[{{name}}]" 
          value={filter.{{name}}} 
          {{{attributes}}} 
        />
      </form-control>
    {{/filter}}
    {{#span}}
      <form-control class="pt-20 relative{{zindex}}" label="{{label}}" error={errors.{{name}}}>
        <field-{{method}} 
          class="block relative z-{{index2}}" 
          name="span[{{name}}][0]" 
          value={span.{{name}}?.[0]} 
          {{{attributes}}} 
        />
        <field-{{method}} 
          class="block relative z-{{index3}}" 
          name="span[{{name}}][1]" 
          value={span.{{name}}?.[1]} 
          {{{attributes}}} 
        />
      </form-control>
    {{/span}}
  {{/fields}}
  <form-button class="mt-20" type="submit" primary lg>Submit</form-button>
</form>
`.trim();