export type LayoutLeftProps = {
  brand?: string,
  base?: string,
  logo?: string,
  open: boolean,
  toggle: () => void,
  children: React.ReactNode
};
export default function LayoutLeft(props: LayoutLeftProps) {
  const { brand, base, logo, open, toggle, children } = props;
  const left = open ? 'rmd-px-l-0' : 'rmd-px-l--220';
  return (
    <aside className={`duration-200 flex flex-col px-h-100-0 px-z-100 absolute px-w-220 px-b-0 px-l-0 px-t-0 ${left}`}>
      <header className="px-p-10 px-h-60 flex items-center theme-bg-bg0">
        <h3 className="flex-grow px-m-0">
          {base ? (
            <a className="theme-tx1 flex items-center no-underline" href={base}>
              {logo && <img src={logo} alt={brand} className="px-w-30 px-h-30 px-mr-10" />}
              {brand && <span className="uppercase px-fs-16">{brand}</span>}
            </a>
          ): (
            <span className="flex items-center">
              {logo && <img src={logo} alt={brand} className="px-w-30 px-h-30 px-mr-10" />}
              {brand && <span className="uppercase px-fs-16">{brand}</span>}
            </span>
          )}
        </h3>
        <button className="theme-tx1 md-hidden b-0 p-0 bg-transparent text-xl" onClick={toggle}>
          <i className="fas fa-chevron-left"></i>
        </button>
      </header>
      <main className="theme-bg-bg1 flex-grow">
        {children}
      </main>
    </aside>
  );
}