import type Fieldset from '../../schema/fieldset/Fieldset.js';
export function render(fieldset: Fieldset, to = '${data.%s}') {
  const template = fieldset.name.display || '';
  return Array.from(
    template.matchAll(/\{\{([a-zA-Z0-9_\.]+)\}\}/g)
  ).reduce((result, match) => {
    return result.replace(match[0], to.replaceAll('%s', match[1]));
  }, template)
}