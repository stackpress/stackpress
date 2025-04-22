import type { LayoutMenuProps } from '../../types.js';

export default function LayoutMenu(props: LayoutMenuProps) {
  const { path = '', menu = [] } = props;
  return (
    <>
      {menu.map((item, index) => (
        <a 
          className={`menu-item ${path.startsWith(item.match) ? 'active' : ''}`} 
          href={item.path} 
          key={index}
        >
          {item.icon && (
            <i className={`icon fas fa-fw fa-${item.icon}`}></i>
          )}
          {item.name}
        </a>
      ))}
    </>
  );
}