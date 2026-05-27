//modules
import { useLanguage } from 'r22n';
//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

type HomeResults = {
  title: string;
  links: Array<{ href: string; label: string }>;
};

export function Body() {
  const response = useResponse<HomeResults>();
  const links = response.results?.links || [];

  return (
    <main className="min-h-full w-full overflow-auto">
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <section className="overflow-hidden rounded-[2rem] border border-[#d9c9b4] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,239,226,0.92))] shadow-[0_24px_60px_rgba(78,53,23,0.10)]">
          <div className="grid gap-10 p-8 md:grid-cols-[minmax(0,1.6fr)_minmax(17rem,1fr)] md:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9a6a2f]">
                Plugin Composition Sample
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-[#2e2016] md:text-5xl">
                {response.results?.title || 'Store Sample'}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#6a5540]">
                A compact StackPress sample that keeps infrastructure and
                feature ownership separate while still walking through a public
                browse, cart, and checkout flow.
              </p>
              <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {links.map((link, index) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={
                        index === 0
                          ? 'inline-flex rounded-full bg-[#2e2016] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(46,32,22,0.18)] hover:bg-[#1f140d]'
                          : 'inline-flex rounded-full border border-[#ccb79d] bg-white/70 px-5 py-3 text-sm font-semibold text-[#2e2016] hover:border-[#9a6a2f] hover:bg-white'
                      }
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="rounded-[1.5rem] border border-[#e2d4c2] bg-[#fffaf2] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a6a2f]">
                What It Shows
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-[#6a5540]">
                <li className="rounded-2xl bg-white/80 px-4 py-3">
                  `store` stays infrastructure-only.
                </li>
                <li className="rounded-2xl bg-white/80 px-4 py-3">
                  `product`, `cart`, `checkout`, and `order` own their flow.
                </li>
                <li className="rounded-2xl bg-white/80 px-4 py-3">
                  The UX stays small enough to inspect end to end quickly.
                </li>
              </ul>
            </aside>
          </div>
        </section>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {links.map(link => (
            <li
              key={link.href}
              className="rounded-[1.5rem] border border-[#ddcfbd] bg-white/70 p-5 shadow-[0_18px_40px_rgba(78,53,23,0.06)]"
            >
              <p className="text-sm font-semibold text-[#2e2016]">
                {link.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#7a6755]">
                Follow the sample flow from entry point to feature-owned route.
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export function Head(props: ServerPageProps) {
  const { styles = [] } = props;
  const { _ } = useLanguage();

  return (
    <>
      <title>{_('Store Sample')}</title>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

export function Page(props: ServerPageProps) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
}

export default Page;
