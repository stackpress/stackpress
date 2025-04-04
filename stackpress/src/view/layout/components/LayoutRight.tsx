import type { LayoutRightProps } from '../../types'

export default function LayoutRight({ open, children }: LayoutRightProps) {
  const right = open ? 'px-r-0' : 'px-r--220';
  return (
    <aside className={`duration-200 absolute px-w-220 px-b-0 px-t-0 px-t-60 px-z-100 ${right}`}>
      <div className="px-h-100-0 theme-bg-bg2 flex flex-col">
        {children}
      </div>
    </aside>
  );
}