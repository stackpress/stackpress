//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel } from 'stackpress/view/client';

const title = 'Checkout';
const description = 'Checkout page for the StackPress store sample.';

export function Head(props: ServerConfigPageProps) {
  const { styles = [] } = props;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/icon.png" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  );
}

/**
 * Renders the minimal checkout form for the sample flow.
 */
export function Page(props: ServerConfigPageProps) {
  const { data, session, request, response } = props;

  return (
    <LayoutPanel
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <main className="flex h-full w-full flex-col overflow-auto">
        <div className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,1fr)] md:p-10">
          <section className="rounded-[2rem] border border-[#dacbb9] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,239,226,0.90))] p-8 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a6a2f]">
              Checkout Plugin
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#2e2016]">
              Checkout
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6a5540]">
              This step keeps the flow intentionally minimal: contact details,
              optional account creation, then a demo order placement.
            </p>
          </section>
          <section className="rounded-[2rem] border border-[#dacbb9] bg-white/82 p-8 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
            <form
              method="post"
              action="/checkout"
              className="mt-6 flex flex-col gap-4"
            >
              <label className="flex flex-col gap-2 text-sm font-medium text-[#5f4d3c]">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  className="rounded-2xl border border-[#ccb79d] px-4 py-3"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[#5f4d3c]">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  className="rounded-2xl border border-[#ccb79d] px-4 py-3"
                />
              </label>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-[#e0d4c5] bg-[#fffaf2] px-4 py-3 text-sm text-[#5f4d3c]">
                <input type="checkbox" name="createAccount" value="1" />
                <span>Create account during checkout</span>
              </label>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-full bg-[#2e2016] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1f140d]"
              >
                Place Order
              </button>
            </form>
          </section>
        </div>
      </main>
    </LayoutPanel>
  );
}

export default Page;
