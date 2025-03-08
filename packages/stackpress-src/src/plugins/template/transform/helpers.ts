//stackpress
import type Column from '@/schema/spec/Column';
//local
import type { 
  Link, 
  FormFields, 
  FilterFields, 
  TableData, 
  ViewData 
} from './types';

export const methods = {
  form: [
    'checkbox', 'color',    'country',
    'currency', 'date',     'datetime',
    'editor',   'email',    'file',
    'filelist', 'image',    'imagelist',
    'input',    'markdown', 'mask',
    'metadata', 'number',   'password',
    'phone',    'radio',    'range',
    'rating',   'select',   'slug',
    'switch',   'taglist',  'textarea',
    'textlist', 'text',     'time',
    'url',      'wysiwyg',  'relation'
  ],
  filter: [
    'checkbox', 'color',    'country',
    'currency', 'date',     'datetime',
    'email',    'file',     'image',    
    'input',    'mask',     'number',
    'password', 'phone',    'radio',
    'range',    'rating',   'select',
    'slug',     'switch',   'text',
    'time',     'url',      'relation'
  ],
  table: [
    'code',     'color',     'country',
    'currency', 'date',      'time',
    'datetime', 'email',     'formula',
    'html',     'image',     'imagelist',
    'json',     'link',      'ul',
    'ol',       'list',      'markdown',
    'metadata', 'number',    'overflow',
    'phone',    'rating',    'space',
    'line',     'separated', 'table',
    'taglist',  'text',      'yesno',
    'template', 'none'
  ],
  view: [
    'code',     'color',     'country',
    'currency', 'date',      'time',
    'datetime', 'email',     'formula',
    'html',     'image',     'imagelist',
    'json',     'link',      'ul',
    'ol',       'list',      'markdown',
    'metadata', 'number',    'overflow',
    'phone',    'rating',    'space',
    'line',     'separated', 'table',
    'taglist',  'text',      'yesno',
    'template', 'none'
  ]
};

export const alias: Record<string, Record<string, { 
  method: string, 
  attributes: Record<string, unknown> 
}>> = {
  form: {
    'email': { method: 'input', attributes: { type: 'email' } },
    'image': { method: 'file', attributes: { accept: 'image/*' } }, 
    'imagelist': { method: 'filelist', attributes: { accept: 'image/*' } },
    'phone': { method: 'input', attributes: { type: 'tel' } },
    'text': { method: 'input', attributes: { type: 'text' } },
    'url': { method: 'input', attributes: { type: 'url' } },
  },
  filter: {
    'email': { method: 'input', attributes: { type: 'email' } },
    'phone': { method: 'input', attributes: { type: 'tel' } },
    'text': { method: 'input', attributes: { type: 'text' } },
    'url': { method: 'input', attributes: { type: 'url' } },
  },
  table: {
    'time': { method: 'date', attributes: { format: 'h:mm:ss a' } },
    'datetime': { method: 'date', attributes: { format: 'MMMM D, YYYY, h:mm:ss a' } }, 
    'ul': { method: 'list', attributes: {} },
    'ol': { method: 'list', attributes: { ordered: true } },
    'space': { method: 'separated', attributes: { separator: ' ' } },
    'line': { method: 'separated', attributes: { separator: 'line' } },
  },
  view: {
    'time': { method: 'date', attributes: { format: 'h:mm:ss a' } },
    'datetime': { method: 'date', attributes: { format: 'MMMM D, YYYY, h:mm:ss a' } }, 
    'ul': { method: 'list', attributes: {} },
    'ol': { method: 'list', attributes: { ordered: true } },
    'space': { method: 'separated', attributes: { separator: ' ' } },
    'line': { method: 'separated', attributes: { separator: 'line' } },
  }
};

/**
 * Convers an object of attributes to a string
 * ex. { type: 'text', number: 4, required: true, disabled: false } => 
 *   'type="text" required number={4} disabled={false}'
 * ex. { list: ['a', 2, true] } => 'list={["a", 2, true]}'
 */
export function objectToAttributeString(attributes: Record<string, any>) {
  return Object.entries(attributes).map(([key, value]) => {
    return `${key}={${JSON.stringify(value)}}`;
  }).join(' ');
}

/**
 * Return a real method and attributes for a given method and attributes
 */
export function getMethod(
  method: string, 
  attributes: Record<string, any>,
  alias: Record<string, { 
    method: string, 
    attributes: Record<string, unknown> 
  }>
) {
  if (alias[method]) {
    attributes = Object.assign({}, attributes, alias[method].attributes);
    method = alias[method].method;
  }
  return { method, attributes };
};

/**
 * Generates the template data for form fields
 */
export function getFormFields(columns: Column[], links: Link[], fieldsets = true) {
  const fields: FormFields = [];
  for (let index = 0; index < columns.length; index++) {
    const column = columns[index];
    const { name, label } = column;
    const { method, attributes } = getMethod(
      column.field.method, 
      column.field.attributes,
      alias.form
    );
    if (fieldsets && method === 'fieldset' && column.fieldset) {
      fields.push({
        fieldset: {
          border: true, 
          legend: column.multiple ? `${label} %s` : label, 
          name: name, 
          multiple: Boolean(attributes.multiple), 
          index: columns.length - index,
          fields: getFormFields(column.fieldset.fields, links, true)
        }
      });
      continue;
    } else if (!methods.form.includes(method)) {
      continue;
    }
    links.push(method === 'relation' ? { 
      href: `stackpress/template/field/${method}`, 
      type: 'component', 
      name: `field-${method}` 
    }: { 
      href: `@stackpress/ink-ui/field/${method}`, 
      type: 'component', 
      name: `field-${method}` 
    });
    fields.push({
      field: {
        label, 
        name, 
        method, 
        multiple: [
          'filelist', 'imagelist', 
          'taglist', 'textlist'
        ].includes(method),
        index: columns.length - index,
        attributes: objectToAttributeString(attributes)
      }
    });
  }
  return fields;
};

/**
 * Generates the template data for filter fields
 */
export function getFilterFields(columns: Column[], links: Link[]) {
  const fields: FilterFields = [];
  for (let index = 0; index < columns.length; index++) {
    const column = columns[index];
    const { name, label } = column;
    const { method, attributes } = getMethod(
      column.filter.method, 
      column.filter.attributes,
      alias.filter
    );
    if (!methods.filter.includes(method)) {
      continue;
    }
    if (column.filter.method !== 'none') {
      links.push(method === 'relation' ? { 
        href: `stackpress/template/field/${method}`, 
        type: 'component', 
        name: `field-${method}` 
      }: { 
        href: `@stackpress/ink-ui/field/${method}`, 
        type: 'component', 
        name: `field-${method}` 
      });
      fields.push({
        filter: {
          label, 
          name, 
          method, 
          index: columns.length - index,
          index2: columns.length + 1 - index,
          index3: columns.length + 2 - index,
          attributes: objectToAttributeString(attributes)
        }
      });
    } else if (column.span.method !== 'none') {
      links.push(method === 'relation' ? { 
        href: `stackpress/template/field/${method}`, 
        type: 'component', 
        name: `field-${method}` 
      } : { 
        href: `@stackpress/ink-ui/field/${method}`, 
        type: 'component', 
        name: `field-${method}` 
      });

      fields.push({
        filter: {
          label, 
          name, 
          method, 
          index: columns.length - index,
          index2: columns.length + 1 - index,
          index3: columns.length + 2 - index,
          attributes: objectToAttributeString(attributes)
        }
      });
    }
  }
  return fields;
};

export function getDirection(type: string) {
  return [ 
    'Boolean', 'Date', 'Time', 'Datetime', 
    'Number', 'Integer', 'Float' 
  ].includes(type) ? 'right' : 'left';
}

export function getTableData(columns: Column[], data: TableData) {
  for (const column of columns) {
    const { name, label } = column;
    const direction = getDirection(column.type);
    const { method, attributes } = getMethod(
      column.list.method, 
      column.list.attributes,
      alias.table
    );
    if (!methods.table.includes(method)) {
      continue;
    }
    if (method !== 'none') {
      data.links.push({ 
        href: `@stackpress/ink-ui/format/${method}`, 
        type: 'component', 
        name: `format-${method}` 
      });
    }
    if (method === 'metadata') {
      Object.assign(attributes, {
        padding: 10,
        'stripe-theme': 'bg-3', 
        'background-theme': 'bg-2'
      }); 
    }
    data.headers.push({
      head: !column.sortable ? { label, direction } : undefined,
      sort: column.sortable ? { label, direction, name } : undefined 
    });
    data.columns.push({
      direction,
      ...(column.filter.method !== 'none' ? {
        filter: {
          name,
          format: method !== 'none' ? {
            name: method === 'template' ? attributes.key : name, 
            method, 
            attributes: objectToAttributeString(attributes)
          }: undefined,
          none: method === 'none' ? { name }: undefined
        }
      }: {
        column: {
          format: method !== 'none' ? {
            name: method === 'template' ? attributes.key : name, 
            method, 
            attributes: objectToAttributeString(attributes)
          }: undefined,
          none: method === 'none' ? { name }: undefined
        }
      })
    });
  }
  return data;
}

export function getViewData(columns: Column[], data: ViewData) {
  for (const column of columns) {
    const { name, label } = column;
    const { method, attributes } = getMethod(
      column.view.method, 
      column.view.attributes,
      alias.view
    );
    if (!methods.table.includes(method)) {
      continue;
    }
    if (method !== 'none') {
      data.links.push({ 
        href: `@stackpress/ink-ui/format/${method}`, 
        type: 'component', 
        name: `format-${method}` 
      });
    }
    if (method === 'metadata') {
      Object.assign(attributes, {
        padding: 10,
        'stripe-theme': 'bg-3', 
        'background-theme': 'bg-2'
      }); 
    }
    data.columns.push({
      label,
      format: method !== 'none' ? {
        name: method === 'template' ? attributes.key : name, 
        method, 
        attributes: objectToAttributeString(attributes)
      }: undefined,
      none: method === 'none' ? { name } : undefined
    });
  }
  return data;
}