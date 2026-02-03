//modules
import mustache from 'mustache';

/**
 * Quick rendering using mustache
 */
export function render(
  template: string, 
  data: Record<string, any> = {},
  delimiter?: string //{{=<% %>=}}
) {
  if (delimiter) {
    template = delimiter + template;
  }
  return mustache.render(template, data);
};

/**
 * Used to "transform" a code template string
 * using code safe variable handlers
 */
export function renderCode(
  template: string, 
  data: Record<string, any> = {},
  delimiter = '{{=<% %>=}}'
) {
  return render(template, data, delimiter);
};