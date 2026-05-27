//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

// shapes the cart payload consumed by the public cart page
type CartResults = {
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    product?: {
      title: string;
    };
  }>;
  total: number;
};

/**
 * Renders the current cart contents and running total.
 */
export function Body() {
  const response = useResponse<CartResults>();
  const items = response.results?.items || [];
  const total = response.results?.total || 0;

  return (
    <main className="w-full h-full overflow-auto">
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <ul className="mt-6 flex flex-col gap-3">
          {items.map(item => (
            <li
              key={item.id}
              className="rounded border border-slate-300 p-4"
            >
              <div className="font-medium">
                {item.product?.title || 'Product'}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Quantity: {item.quantity}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Unit Price: ${item.unitPrice.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-lg font-semibold">
          Total: ${total.toFixed(2)}
        </p>
        <a
          href="/checkout"
          className="mt-4 inline-flex rounded border border-slate-300 px-4 py-2 hover:bg-slate-50"
        >
          Continue to Checkout
        </a>
      </div>
    </main>
  );
}

/**
 * Wraps the cart page in the shared panel layout.
 */
export function Page(props: ServerPageProps) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
}

export default Page;
