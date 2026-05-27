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
    <main className="w-full h-full overflow-auto">
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-3xl font-bold">Order Confirmed</h1>
        <p className="mt-4 text-sm text-slate-600">
          Order ID: {response.results?.id}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Email: {response.results?.email}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Status: {response.results?.status}
        </p>
        <p className="mt-2 text-lg font-semibold">
          Total: ${response.results?.total?.toFixed(2) || '0.00'}
        </p>
        <a
          href={`/account/orders?email=${encodeURIComponent(response.results?.email || '')}`}
          className="mt-6 inline-flex rounded border border-slate-300 px-4 py-2 hover:bg-slate-50"
        >
          View Orders
        </a>
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
