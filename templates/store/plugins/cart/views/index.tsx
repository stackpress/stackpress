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
    <main className="min-h-full w-full overflow-auto">
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_20rem]">
          <section className="rounded-[2rem] border border-[#dacbb9] bg-white/82 p-8 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a6a2f]">
              Cart Plugin
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#2e2016]">
              Your Cart
            </h1>
            <ul className="mt-6 flex flex-col gap-4">
          {items.map(item => (
            <li
              key={item.id}
              className="rounded-[1.5rem] border border-[#e0d4c5] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,243,235,0.92))] p-5"
            >
              <div className="text-lg font-semibold text-[#2e2016]">
                {item.product?.title || 'Product'}
              </div>
              <div className="mt-2 text-sm text-[#6a5540]">
                Quantity: {item.quantity}
              </div>
              <div className="mt-1 text-sm text-[#6a5540]">
                Unit Price: ${item.unitPrice.toFixed(2)}
              </div>
            </li>
          ))}
            </ul>
          </section>
          <aside className="rounded-[2rem] border border-[#dacbb9] bg-[#fffaf2] p-6 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a6a2f]">
              Summary
            </p>
            <p className="mt-6 text-sm text-[#6a5540]">Current total</p>
            <p className="mt-2 text-4xl font-bold text-[#2e2016]">
              ${total.toFixed(2)}
            </p>
            <a
              href="/checkout"
              className="mt-8 inline-flex w-full justify-center rounded-full bg-[#2e2016] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1f140d]"
            >
              Continue to Checkout
            </a>
          </aside>
        </div>
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
