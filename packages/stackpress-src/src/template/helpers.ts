export function addQueryParam(search: string, name: string, value: string) {
  search = removeQueryParam(search, name);
  const params = new URLSearchParams(search);
  params.append(name, value);
  return params.toString();
};

export function removeQueryParam(search: string, name: string) {
  const params = new URLSearchParams(search);
  params.delete(name);
  return params.toString();
};

export function filter(name: string, value: string) {
  return `${window.location.pathname}?${
    addQueryParam(window.location.search, `filter[${name}]`, value)
  }`;
};

export function sort(name: string) {
  const params = new URLSearchParams(window.location.search);
  const direction = params.get(`sort[${name}]`);
  return `${window.location.pathname}?${
    direction === 'asc' 
      ? addQueryParam(window.location.search, `sort[${name}]`, 'desc')
      : direction === 'desc' 
      ? removeQueryParam(window.location.search, `sort[${name}]`)
      : addQueryParam(window.location.search, `sort[${name}]`, 'asc')
  }`;
};

export function order(name: string) {
  const params = new URLSearchParams(window.location.search);
  const direction = params.get(`sort[${name}]`);
  return direction === 'asc' 
    ? 'caret-up'
    : direction === 'desc' 
    ? 'caret-down'
    : 'sort';
};