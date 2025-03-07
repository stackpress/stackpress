export function safeValue(value: any) {
  return typeof value !== 'undefined' ? value: '';
};

//general
export function required(value: any) {
  return value !== null && typeof value !== 'undefined';
};

export function notempty(value: any) {
  if (Array.isArray(value)) {
    return value.length > 0;
  } else if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  } else if (typeof value === 'number') {
    return value !== 0;
  }
  return safeValue(value).toString().length > 0;
};

export function eq(value: any, compare: any) { 
  return value == compare;
};

export function ne(value: any, compare: any) { 
  return value != compare;
};

export function option(value: any, options: any[]) { 
  return options.includes(value);
};

export function regex(value: any, regex: string|RegExp) { 
  return new RegExp(regex).test(safeValue(value).toString());
};

export function date(value: any) { 
  if (value instanceof Date) {
    return true;
  }
  return new Date(value).toString() !== 'Invalid Date';
};

export function future(value: any) { 
  return assert.date(value) && new Date(value || 0) > new Date();
};

export function past(value: any) { 
  return assert.date(value) && new Date(value || 0) < new Date();
};

export function present(value: any) { 
  return assert.date(value) 
    && new Date(value || 0).toDateString() === new Date().toDateString();
};

export function gt(value: number|string, compare: number) { 
  return (Number(value) || 0) > compare;
};

export function ge(value: number|string, compare: number) { 
  return (Number(value) || 0) >= compare;
};

export function lt(value: number|string, compare: number) { 
  return (Number(value) || 0) < compare;
};

export function le(value: number|string, compare: number) { 
  return (Number(value) || 0) <= compare;
};

export function ceq(value: string|number, compare: number) { 
  return eq(safeValue(value).toString().length, compare);
};

export function cgt(value: string|number, compare: number) { 
  return gt(safeValue(value).toString().length, compare);
};

export function cge(value: string|number, compare: number) { 
  return ge(safeValue(value).toString().length, compare);
};

export function clt(value: string|number, compare: number) { 
  return lt(safeValue(value).toString().length, compare);
};

export function cle(value: string|number, compare: number) { 
  return le(safeValue(value).toString().length, compare);
};

export function weq(value: string|number, compare: number) { 
  return eq(safeValue(value).toString().split(' ').length, compare);
};

export function wgt(value: string|number, compare: number) { 
  return gt(safeValue(value).toString().split(' ').length, compare);
};

export function wge(value: string|number, compare: number) { 
  return ge(safeValue(value).toString().split(' ').length, compare);
};

export function wlt(value: string|number, compare: number) { 
  return lt(safeValue(value).toString().split(' ').length, compare);
};

export function wle(value: string|number, compare: number) { 
  return le(safeValue(value).toString().split(' ').length, compare);
};

export function cc(value: any) { 
  return regex(value, /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
};

export function color(value: any) { 
  return regex(value, /^#?([a-f0-9]{6}|[a-f0-9]{3})$/);
};

export function email(value: any) { 
  return regex(value, /^(?:(?:(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff]))(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff])|\.(?=[^\.])){1,62}(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff])|[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]{1,2})|"(?:[^"]|(?<=\x5c)"){1,62}")@(?:(?!.{64})(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.?|[a-zA-Z0-9]\.?)+\.(?:xn--[a-zA-Z0-9]+|[a-zA-Z]{2,6})|\[(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])(?:\.(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])){3}\])$/);
};

export function hex(value: any) { 
  return regex(value, /^[a-f0-9]+$/);
};

export function price(value: any) { 
  return regex(value.toString(), /^(\d*(\.\d{2}){0, 1})|(\d+)$/);
};

export function url(value: any) { 
  return regex(value,/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\/?/i);
};

export function boolean(value: any) {
  return typeof value === 'boolean';
};

export function string(value: any) {
  return typeof value === 'string';
};

export function number(value: any) { 
  return typeof value === 'number' || regex(value.toString(), /^\d+(\.\d+)*$/);
};

export function float(value: any) { 
  return typeof value === 'number' || regex(value.toString(), /^\d+\.\d+$/);
};

export function integer(value: any) { 
  return typeof value === 'number' || regex(value.toString(), /^\d+$/);
};

export function object(value: any) {
  return value !== null 
    && !Array.isArray(value) 
    && value?.constructor?.name === 'Object';
};

export function array(values: any[], validator: string, ...args: any[]) {
  return Array.isArray(values) && values.every(
    value => assert[validator].apply(assert, [value, ...args])
  );
}

const assert: Record<string, (value: any, ...args: any[]) => boolean> = {
  required, notempty, eq,      ne,
  option,   regex,    date,    future,
  past,     present,  gt,      ge,
  lt,       le,       ceq,     cgt,
  cge,      clt,      cle,     weq,
  wgt,      wge,      wlt,     wle,
  cc,       color,    email,   hex,
  price,    url,      boolean, string,  
  number,   float,    integer, object,
  array
};

export default assert;