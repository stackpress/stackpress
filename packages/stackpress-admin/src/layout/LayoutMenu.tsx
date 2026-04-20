import type { LayoutMenuProps } from '../types.js';
import { useSession } from 'stackpress-view/client';

export default function LayoutMenu(props: LayoutMenuProps) {
  const { path = '', menu = [] } = props;
  const session = useSession();
  return (
    <>
      {menu.map((item, index) => session.can(
        { method: 'GET', route: item.path }) 
        ? (
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
        )
        : null
      )}
    </>
  );
};