//stackpress/schema
import type Fieldset from '../../schema/Fieldset.js';
//stackpress/view
import type { Helper, Resolver } from '../../view/te4tt.js';
import { TE4TT, helpers as runtime } from '../../view/te4tt.js';

//transform helpers
export const helpers: Record<string, Helper> = {
  ...runtime,
  //if
  '?': ({ path, body, engine }) => {
    //ex. {{~?:"user.active"}}'Active'{{|}}'Inactive'{{/?~:"user.active"}}
    //ex. {{~?:user.active}}'Active'{{|}}'Inactive'{{/?~:user.active}}
    //to. user.active ? 'Active' : 'Inactive'
    const [ truthy, falsy = "''" ] = body.split(engine.delimiters.join('|'));
    return engine.container.replace('%s', `${path} ? ${
      engine.render(truthy)
    } : ${
      engine.render(falsy)
    }`);
  },
  //if not
  '!': ({ path, body, engine }) => {
    //ex. {{~!:"user.active"}}'Inactive'{{|}}'Active'{{/?~!:"user.active"}}
    //ex. {{~!:user.active}}'Inactive'{{|}}'Active'{{/?~!:user.active}}
    //to. !user.active ? 'Inactive' : 'Active'
    const [ falsy, truthy = "''" ] = body.split(engine.delimiters.join('|'));
    return engine.container.replace('%s', `!${path} ? ${
      engine.render(falsy)
    } : ${
      engine.render(truthy)
    }`);
  },
  //either
  '|': ({ path, args, engine }) => {
    //ex. {{|:status 'user.active' false 4}}
    //to. ${`${data.status}` || 'user.active' || false || 4}
    return '${' + [ path ].concat(args.split(' ').filter(Boolean)).map(
      option => option === 'true' ? option
        : option === 'false' ? option
        : !isNaN(Number(option)) ? option
        : option.startsWith("'") && option.endsWith("'") ? option
        : '`' + engine.container.replace('%s', option) + '`'
    ).join(' || ') + '}';
  },
  //for each (array)
  '@': ({ path, body, args, engine }) => {
    //ex. {{@:list item i}}{{i}} - {{item}}{{/@:list}}
    //to. list.map((item, i) => `\${i} - \${item}`).join('')
    const [ itemName, keyName, ...join ] = args.split(' ');
    const argsString = [ itemName, keyName ].filter(Boolean).join(', ');
    return engine.container.replace('%s', 
      `${path}.map((${argsString}) => \`${engine.render(body, {
        [keyName]: keyName, 
        [itemName]: itemName 
      })}\`).join('${join.join(' ')}')`
    );
  },
  //substring
  '.': ({ path, args, engine }) => {
    //ex. {{~.:description 0 25}}
    //ex. {{~.:"description" 0 25}}
    const [ start = 0, end = 25 ] = args.split(' ');
    return engine.container.replace(
      '%s', 
      `${path}.substring(${start}, ${end})`
    );
  },
  //uppercase
  'A': ({ path, engine }) => {
    return engine.container.replace('%s', `${path}.toUpperCase()`);
  },
  //lowercase
  'a': ({ path, engine }) => {
    return engine.container.replace('%s', `${path}.toLowerCase()`);
  }
};

/**
 * Renders a fieldset name template with the provided data reference
 * 
 * ex display: {{id}} - {{.:title 0 10}} -> ${data.id} - ${data.title.substring(0, 10)}
 */
export function render(fieldset: Fieldset, container = '${data.%s}') {
  const template = fieldset.name.display || 'Detail';
  const resolve: Resolver = ({ path }) => container.replace('%s', path);
  const engine = new TE4TT({ helpers, container, resolve });
  return engine.render(template);
}