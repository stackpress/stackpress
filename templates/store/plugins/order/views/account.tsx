//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

// shapes the lightweight order history payload
type AccountOrdersResults = {
  email?: string;
  orders: Array<{
    id: string;
    email: string;
    status: string;
    total: number;
  }>;
};

/**
 * Renders the sample order history page.
 */
export function Body() {
  const response = useResponse<AccountOrdersResults>();
  const orders = response.results?.orders || [];

  return (
    <main className="w-full h-full overflow-auto">
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        {!!response.results?.email && (
          <p className="mt-3 text-sm text-slate-600">
            Showing orders for {response.results.email}
          </p>
        )}
        <ul className="mt-6 flex flex-col gap-3">
          {orders.map(order => (
            <li
              key={order.id}
              className="rounded border border-slate-300 p-4"
            >
              <div className="font-medium">{order.id}</div>
              <div className="mt-1 text-sm text-slate-600">
                {order.email}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {order.status}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                ${order.total.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

/**
 * Wraps the account order list in the shared panel layout.
 */
export function Page(props: ServerPageProps) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
}

export default Page;
