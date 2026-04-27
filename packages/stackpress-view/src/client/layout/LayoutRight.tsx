import type { LayoutRightProps } from '../types.js';

export type { LayoutRightProps };

export default function LayoutRight(props: LayoutRightProps) {
  const { open, head, children } = props;
  const top = head ? 'head' : '';
  const right = open ? 'open' : '';
  return (
    <aside className={`layout-right ${top} ${right}`}>
      <main className="container">
        {children}
      </main>
    </aside>
  );
};