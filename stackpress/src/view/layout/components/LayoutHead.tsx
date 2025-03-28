export type LayoutHeadProps = {
  open?: boolean,
  theme: string,
  base?: string,
  logo?: string,
  brand?: string,
  toggleLeft?: () => void,
  toggleRight?: () => void,
  toggleTheme?: () => void
};

export default function LayoutHead(props: LayoutHeadProps) {
  const { 
    open, 
    theme, 
    base,
    logo,
    brand,
    toggleLeft, 
    toggleRight, 
    toggleTheme 
  } = props;
  const left = open ? 'rmd-px-l-220' : 'rmd-px-l-0';
  const full = typeof open === 'undefined' ? 'px-l-0' : 'px-l-220';
  const themeColor = theme === 'dark' ? 'bg-gray-600': 'bg-orange-600';
  const themeIcon = theme === 'dark' ? 'fa-moon': 'fa-sun';
  return (
    <header className={`theme-bg-bg1 duration-200 absolute px-h-60 px-r-0 px-t-0 ${full} ${left}`}>
      <div className="flex items-center px-px-20 px-h-100-0">
        {toggleLeft && (
          <button className="theme-tx1 md-hidden b-0 p-0 bg-transparent text-xl" onClick={toggleLeft}>
            <i className="fas fa-bars"></i>
          </button>
        )}
        <div className="flex-grow">
          {base ? (
            <a className="theme-tx1 flex items-center no-underline" href={base}>
              {logo && <img src={logo} alt={brand} className="px-w-30 px-h-30 px-mr-10" />}
              {brand && <span className="uppercase px-fs-16">{brand}</span>}
            </a>
          ): brand || logo ? (
            <span>
              {logo && <img src={logo} alt={brand} className="px-w-30 px-h-30 px-mr-10" />}
              {brand && <span className="uppercase px-fs-16">{brand}</span>}
            </span>
          ): undefined}
        </div>
        {toggleTheme && (
          <button 
            className={`flex justify-center items-center b-0 px-mr-10 px-h-26 px-w-26 px-fs-18 rounded-full text-white ${themeColor}`}
            onClick={() => toggleTheme()}
          >
            <i className={`fas ${themeIcon}`}></i>
          </button>
        )}
        {toggleRight && (
          <button className="theme-tx1 b-0 p-0 bg-transparent px-fs-26" onClick={toggleRight}>
            <i className="fas fa-user-circle"></i>
          </button>
        )}
      </div>
    </header>
  );
}