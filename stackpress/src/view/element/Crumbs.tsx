import type { Crumb, CrumbsProps } from '../types.js';

const Item = ({ href, label, icon, last }: Crumb & { last?: boolean }) => {
  const item = href
    ? <a href={href} className="inline-flex items-center text-t-info">{label}</a>
    : <span className="inline-flex items-center font-semibold text-t1">{label}</span>

  return (
    <>
      {icon && <i className={`theme-tx1 fas fa-fw fa-${icon} inline-block px-mr-5`}></i>}
      {item}
      {!last && <i className="fas fa-fw fa-chevron-right mx-1 text-t1"></i>}
    </>
  )
}

const Header = ({ trail }: { trail: Crumb[] }) => {
  if (trail.length === 0) return null;
  const item = trail[trail.length - 1];
  const href = item.href || trail[trail.length - 2]?.href;
  if (href) {
    return (
      <a 
        className="flex md:hidden items-center cursor-pointer whitespace-nowrap overflow-x-hidden" 
        href={href}
      >
        <i className="theme-tx2 px-mr-5 fas fa-fw fa-chevron-left text-xl"></i>
        {!!item.icon && <i className={`px-mr-2 fas fa-fw fa-${item.icon} text-sm`}></i>}
        <span className="font-bold">{item.label}</span>
      </a>
    );
  }
  return (
    <div className="flex md:hidden items-center whitespace-nowrap overflow-x-hidden">
      {!!item.icon && <i className={`px-mr-2 fas fa-fw fa-${item.icon} text-sm`}></i>}
      <span className="font-bold">{item.label}</span>
    </div>
  );
};

export default function Crumbs({ crumbs, className }: CrumbsProps) {
  const trail = [ ...crumbs ].filter(item => !!item.label);

  const classNames = [ 'hidden md:flex items-center whitespace-nowrap overflow-x-auto' ];

  if (className) {
    classNames.push(className);
  }

  return (
    <nav>
      <div className={classNames.join(' ')}>
        {trail.map((item, key) => (
          <Item 
            key={key} 
            href={item.href} 
            label={item.label} 
            icon={item.icon} 
            last={key === (trail.length - 1)}
          />
        ))}
      </div>
      <Header trail={trail} />
    </nav>
  );
}