//modules
import Handlebars from 'handlebars';

//----------------------------------------------------------------------
// Handlebars Helpers

//clip - {{clip comment 25}}
Handlebars.registerHelper('clip', (value: any, length: any) => {
  const text = typeof value === 'undefined' || value === null
    ? ''
    : String(value);
  const max = Number(length) || 0;
  if (max <= 0) return text;
  return text.slice(0, max);
});

//either - {{either name email}}
Handlebars.registerHelper('either', (...args: any[]) => {
  //last arg is handlebars options, so ignore it...
  args.pop();
  for (const value of args) {
    if (typeof value === 'undefined' || value === null) continue;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length) return trimmed;
      continue;
    }
    if (typeof value === 'number') {
      if (!Number.isNaN(value)) return String(value);
      continue;
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    if (Array.isArray(value)) {
      if (value.length) return value.join(', ');
      continue;
    }
    if (typeof value === 'object') {
      if (Object.keys(value).length) return JSON.stringify(value);
      continue;
    }
    if (value) return String(value);
  }
  return '';
});

//uppercase - {{uppercase country}}
Handlebars.registerHelper('uppercase', (value: any) => {
  return String(value ?? '').toUpperCase();
});

//lowercase - {{lowercase status}}
Handlebars.registerHelper('lowercase', (value: any) => {
  return String(value ?? '').toLowerCase();
});

//formula - {{#formula}} {{order.subtotal}} + {{order.shipping}} {{/formula}}
Handlebars.registerHelper('formula', function(this: any, options: any) {
  //Render inner block first, then evaluate.
  const expression = String(options.fn(this) ?? '').trim();
  //Only allow basic arithmetic characters.
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    return '';
  }
  try {
    const result = Function(`"use strict"; return (${expression});`)();
    return String(result);
  } catch (e) {
    return '';
  }
});

export default Handlebars;
