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
    <main className="w-full h-full overflow-auto">
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold">
          {response.results?.title || 'Store Sample'}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          A small StackPress sample focused on plugin composition.
        </p>
        <ul className="mt-8 flex flex-col gap-3">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex rounded border border-slate-300 px-4 py-2 hover:bg-slate-50"
              >
                {link.label}
              </a>
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
};

export function Page(props: ServerPageProps) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
};

export default Page;
