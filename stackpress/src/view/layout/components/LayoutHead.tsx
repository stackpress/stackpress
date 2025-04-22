import type { LayoutHeadProps } from '../../types.js';

export default function LayoutHead(props: LayoutHeadProps) {
  const { 
    open, 
    theme, 
    base,
    logo,
    brand,
    left,
    right,
    toggleLeft, 
    toggleRight, 
    toggleTheme 
  } = props;
  const classNames = [ 'layout-head' ];
  if (left) {
    classNames.push('left');
  }
  if (right) {
    classNames.push('right');
  }
  if (open?.left) {
    classNames.push('open-left');
  }
  if (open?.right) {
    classNames.push('open-right');
  }
  const themeIcon = theme === 'dark' ? 'fa-moon': 'fa-sun';
  return (
    <header className={classNames.join(' ')}>
      <div className="container">
        {toggleLeft && (
          <button className="menu" onClick={toggleLeft}>
            <i className="fas fa-bars"></i>
          </button>
        )}
        <div className="bar">
          {base ? (
            <a href={base}>
              {logo && <img src={logo} alt={brand} className="logo" />}
              {brand && <span className="brand">{brand}</span>}
            </a>
          ): brand || logo ? (
            <span>
              {logo && <img src={logo} alt={brand} className="logo" />}
              {brand && <span className="brand">{brand}</span>}
            </span>
          ): undefined}
        </div>
        {toggleTheme && (
          <button className="theme" onClick={() => toggleTheme()}>
            <i className={`fas ${themeIcon}`}></i>
          </button>
        )}
        {toggleRight && (
          <button className="user" onClick={toggleRight}>
            <i className="fas fa-user-circle"></i>
          </button>
        )}
      </div>
    </header>
  );
}