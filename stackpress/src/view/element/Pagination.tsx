export type PaginationProps = {
  total?: number,
  skip?: number, 
  take?: number, 
  radius?: number,
  paginate?: Function
};

/**
 * Paginataion Components
 */
export default function Pagination(props: PaginationProps) {
  //hooks
  const { 
    total = 0, skip = 0, take = 50, 
    radius = 2, paginate = () => {} 
  } = props;
  
  const current = Math.floor(skip / take) + 1;
  const max = Math.ceil(total / take);
  const previous = current > 1;
  const next = current < max;
  const refresh = (page: number) => paginate(Math.max(page - 1, 0) * take);
  const pages: number[] = [];
  for (let i = current - 1 - radius; i < max; i++) {
    if (i >= 0 && i < current + radius) {
      pages.push(i + 1);
    }
  }

  if (total <= take) return null;

  //render
  return (
    <div className="flex items-center justify-center bg-b1 px-2 py-3">
      {previous && (
        <button
          onClick={() => refresh(current - 1)}
          className="relative border border-gray-300 bg-b2 px-4 py-2 text-sm font-medium text-t1 hover:bg-gray-600"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      )}
      {pages.map((page, i) => (
        <button
          key={i}
          onClick={() => refresh(page)}
          className={`relative z-10 inline-flex items-center border border-white px-4 py-2 text-sm font-semibold 
            ${page === current ? 'bg-gray-600 text-white border border-white z-10 pointer-events-none' : 'text-t1 hover:bg-gray-600'}`}
        >
          {page}
        </button>
      ))}
      {next && (
        <button
          onClick={() => refresh(current + 1)}
          className="relative border border-gray-300 bg-b2 px-4 py-2 text-sm font-medium text-t1 hover:bg-gray-600"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
};