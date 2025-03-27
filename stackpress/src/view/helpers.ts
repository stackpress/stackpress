export function paginate(name: string, skip: number) {
  const url = new URL(window.location.href);
  const search = url.searchParams;
  search.set(name, String(skip));
  //redirect
  window.location.href = url.href;
};

export function order(name: string) {
  const url = new URL(window.location.href);
  const search = url.searchParams;
  const sort = search.get(name) || '';
  const direction = sort === '' 
    ? 'desc'
    : sort === 'desc'
    ? 'asc' 
    : '';
  if (direction.length > 0) {
    search.set(name, direction);
  } else {
    search.delete(name);
  }
  //redirect
  window.location.href = url.href;
};

export function filter(name: string, value: any) {
  const url = new URL(window.location.href);
  const search = url.searchParams;
  if (typeof value === 'undefined' || value === null ) {
    search.delete(name);
  } else {
    search.set(name, value.toString());
  }
  //redirect
  window.location.href = url.href;
};