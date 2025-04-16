import type { LayoutMainProps } from '../../types.js';

export default function LayoutMain(props: LayoutMainProps) {
  const { head = true, open, children } = props;
  const left = open ? 'rmd-px-l-220' : 'rmd-px-l-0';
  const full = typeof open === 'undefined' ? 'px-l-0' : 'px-l-220';
  const top = head ? 'px-t-60' : 'px-t-0';
  return (
    <main className={`theme-bg-bg0 duration-200 absolute px-b-0 px-r-0 ${top} ${full} ${left}`}>
      {children}
    </main>
  );
}