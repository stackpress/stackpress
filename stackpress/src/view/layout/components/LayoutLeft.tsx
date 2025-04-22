import type { LayoutLeftProps } from '../../types.js';

export default function LayoutLeft(props: LayoutLeftProps) {
  const { brand, base, logo, head, open, toggle, children } = props;
  const classNames = [ 'layout-left' ];
  if (head) {
    classNames.push('head');
  }
  if (open) {
    classNames.push('open');
  }
  return (
    <aside className={classNames.join(' ')}>
      <header>
        <h3 className="brand">
          {base ? (
            <a href={base}>
              {logo && <img src={logo} alt={brand} className="logo" />}
              {brand && <span className="label">{brand}</span>}
            </a>
          ): (
            <span>
              {logo && <img src={logo} alt={brand} className="logo" />}
              {brand && <span className="label">{brand}</span>}
            </span>
          )}
        </h3>
        <button className="back" onClick={toggle}>
          <i className="fas fa-chevron-left"></i>
        </button>
      </header>
      <main>{children}</main>
    </aside>
  );
}