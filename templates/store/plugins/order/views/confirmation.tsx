//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

const title = 'Order Confirmed';
const description = 'Order confirmation page for the store sample.';

// captures the order header shown after a successful checkout
type OrderConfirmationResults = {
  id: string;
  email: string;
  total: number;
  status: string;
};

/**
 * Renders the placed-order confirmation state.
 */
export function Body() {
  const response = useResponse<OrderConfirmationResults>();

  return (
    <main className="flex h-full w-full flex-col overflow-auto">
      <div className="mx-auto max-w-3xl p-6 md:p-10">
        <section className="rounded-[2rem] border border-[#dacbb9] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,248,236,0.90))] p-8 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4b8b3b]">
            Order Plugin
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#2e2016]">
            Order Confirmed
          </h1>
          <p className="mt-5 text-sm text-[#6a5540]">
            The sample order was created and handed off from checkout into the
            order plugin.
          </p>
          <p className="mt-6 text-sm text-[#6a5540]">
            Order ID: {response.results?.id}
          </p>
          <p className="mt-2 text-sm text-[#6a5540]">
            Email: {response.results?.email}
          </p>
          <p className="mt-2 text-sm text-[#6a5540]">
            Status: {response.results?.status}
          </p>
          <p className="mt-6 inline-flex rounded-full bg-[#2e2016] px-5 py-3 text-lg font-semibold text-white">
            Total: ${response.results?.total?.toFixed(2) || '0.00'}
          </p>
          <a
            href={`/account/orders?email=${encodeURIComponent(response.results?.email || '')}`}
            className="mt-8 inline-flex rounded-full border border-[#ccb79d] bg-white/85 px-5 py-3 text-sm font-semibold text-[#2e2016] hover:border-[#9a6a2f] hover:bg-white"
          >
            View Orders
          </a>
        </section>
      </div>
    </main>
  );
}

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
 * Wraps the confirmation page in the shared panel layout.
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
      <Body />
    </LayoutPanel>
  );
}

export default Page;
