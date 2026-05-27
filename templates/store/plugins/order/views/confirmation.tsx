//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

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
    <main className="min-h-full w-full overflow-auto">
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

/**
 * Wraps the confirmation page in the shared panel layout.
 */
export function Page(props: ServerPageProps) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
}

export default Page;
