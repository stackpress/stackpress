import type { LayoutMenuProps } from '../client/types.js';
import { useSession } from '../server/hooks.js';

export type { LayoutMenuProps };

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