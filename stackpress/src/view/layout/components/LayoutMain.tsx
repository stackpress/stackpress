export type LayoutMainProps = {
  open?: boolean
  children: React.ReactNode
};
export default function LayoutMain(props: LayoutMainProps) {
  const { open, children } = props;
  const left = open ? 'rmd-px-l-220' : 'rmd-px-l-0';
  const full = typeof open === 'undefined' ? 'px-l-0' : 'px-l-220';
  return (
    <main className={`theme-bg-bg0 duration-500 absolute px-b-0 px-r-0 px-t-60 ${full} ${left}`}>
      {children}
    </main>
  );
}