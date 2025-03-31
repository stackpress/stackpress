import type { LayoutMenuProps } from '../../types';

export default function LayoutMenu(props: LayoutMenuProps) {
  const { path = '', menu = [] } = props;
  return (
    <>
      {menu.map((item, index) => (
        <a 
          className={`theme-bc-bd0 ${path.startsWith(item.match) 
            ? 'theme-tx1' 
            : 'theme-info'
          } flex items-center no-underline px-px-10 px-py-14 border-b`} 
          href={item.path} 
          key={index}
        >
          {item.icon && (
            <i className={`theme-tx1 px-mr-10 fas fa-fw fa-${item.icon}`}></i>
          )}
          {item.name}
        </a>
      ))}
    </>
  );
}