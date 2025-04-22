import type { LayoutMainProps } from '../../types.js';

export default function LayoutMain(props: LayoutMainProps) {
  const { head, left, right, open, children } = props;
  const classNames = [ 'layout-main' ];
  if (left) {
    classNames.push('left');
  }
  if (right) {
    classNames.push('right');
  }
  if (head) {
    classNames.push('head');
  }
  if (open?.left) {
    classNames.push('open-left');
  }
  if (open?.right) {
    classNames.push('open-right');
  }
  return (
    <main className={classNames.join(' ')}>
      {children}
    </main>
  );
}