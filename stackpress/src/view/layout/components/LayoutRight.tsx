import type { LayoutRightProps } from '../../types.js'

export default function LayoutRight({ open, head, children }: LayoutRightProps) {
  const top = head ? 'head' : '';
  const right = open ? 'open' : '';
  return (
    <aside className={`layout-right ${top} ${right}`}>
      <main className="container">
        {children}
      </main>
    </aside>
  );
}