//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
import mustache from 'mustache';
//stackpress
import type { FileSystem } from '@stackpress/lib/dist/types';
//registry
import type Registry from '../../../schema/Registry';
//local
import type { FormData } from './types';
import { getFormFields } from './helpers';

export default function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  //for each model
  for (const model of registry.model.values()) {
    //make new data
    const data: FormData = {
      links: [
        { href: '@stackpress/ink-ui/form/control', type: 'component', name: 'form-control' },
        { href: '@stackpress/ink-ui/form/button', type: 'component', name: 'form-button' },
        { href: '@stackpress/ink-ui/element/tab', type: 'component', name: 'element-tab' }
      ],
      tabs: [ { label: 'Info', selector: 'info', active: true } ],
      fields: [],
      sections: []
    };
    //add model fields (less the fieldset)
    data.fields = getFormFields(model.fields, data.links, false);
    //now loop through the fieldset fields
    model.fields.filter(
      column => column.fieldset && column.field.method === 'fieldset'
    ).forEach(column => {
      if (!column.fieldset) return;
      const { name, label } = column;
      const multiple = column.multiple;
      data.links.push({
        href: '@stackpress/ink-ui/form/fieldset', 
        type: 'component', 
        name: 'form-fieldset'
      });
      data.tabs.push({ 
        label: label, 
        selector: name, 
        active: false 
      });
      data.sections.push({
        zindex: null,
        selector: name,
        border: multiple,
        multiple: multiple,
        name: name,
        legend: multiple ? `${label} %s` : label,
        fields: getFormFields(column.fieldset.fields, data.links, true)
      });
    });
    data.links = data.links.filter((link, index, self) => {
      return self.findIndex(l => l.name === link.name) === index
    });
    const file = path.join(
      directory.getPath(), 
      `${model.name}/components/form.ink`
    );
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(file, mustache.render(template, data, { fieldset }));
  }
};

const fieldset = `
<form-fieldset 
  {{#border}}border-muted{{/border}}
  legend="{{legend}}" 
  name="{{name}}" 
  inputs={input.{{name}}} 
  errors={errors.{{name}}} 
  {{#multiple}}multiple={true}{{/multiple}}
>
  {{#fields}}
    {{#field}}
      <form-control control="{{name}}" class="pt-20 relative{{zindex}}" label="{{label}}">
        <field-{{method}} field="{{name}}" class="block" {{{attributes}}} />
      </form-control>
    {{/field}}
    {{#fieldset}}
      <form-control 
        class="pt-20" 
        label="{{label}}" 
        error={typeof errors.{{name}} === 'string' && errors.{{name}}}
      >
        {{> fieldset}}
      </form-control>
    {{/fieldset}}
  {{/fields}}
</form-fieldset>
`.trim();

const template = `
{{#links}}
  <link rel="import" type="{{type}}" href="{{{href}}}.ink" name="{{name}}" />
{{/links}}
<script>
  const { input = {}, errors = {}, action } = this.props;
</script>
<form method="post" {action}>
  <div class="flex flex-center-y">
    {{#tabs}}
      <element-tab 
        {{#active}}on{{/active}}
        class="relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0"
        active="bg-t-1"
        inactive="bg-t-2 tx-muted"  
        group="form" 
        selector="#{{selector}}"
      >
        {{label}}
      </element-tab>
    {{/tabs}}
  </div>
  <div id="info" class="bg-t-1 p-10">
    {{#fields}}
      {{#field}}
        <form-control class="pt-20 relative{{zindex}}" label="{{label}}" error={errors.{{name}}}>
          <field-{{method}} 
            class="block" 
            name="{{name}}{{#multiple}}[]{{/multiple}}" 
            value={input.{{name}}} 
            {{{attributes}}} 
          />
        </form-control>
      {{/field}}
      {{#textarea}}
        <form-control class="pt-20 relative{{zindex}}" label="{{label}}" error={errors.{{name}}}>
          <field-{{method}} 
            class="block" 
            name="{{name}}{{#multiple}}[]{{/multiple}}" 
            {{{attributes}}} 
          >{input.{{name}}}</field-{{method}}>
        </form-control>
      {{/textarea}}
    {{/fields}}
  </div>
  {{#sections}}
    <div id="{{selector}}" class="bg-t-1 p-10" style="display:none">
      {{> fieldset}}
    </div>
  {{/sections}}
  <form-button class="mt-20" type="submit" primary lg>Submit</form-button>
</form>
`.trim();