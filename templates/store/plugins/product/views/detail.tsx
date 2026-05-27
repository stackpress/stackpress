//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

// keeps the detail page response typed without leaking server-only types
type ProductDetailResults = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  price: number;
};

/**
 * Renders the product detail and add-to-cart form.
 */
export function Body() {
  const response = useResponse<ProductDetailResults>();
  const product = response.results;

  return (
    <main className="w-full h-full overflow-auto">
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-3xl font-bold">{product?.title}</h1>
        <p className="mt-3 text-slate-600">
          {product?.summary || 'No summary provided.'}
        </p>
        <p className="mt-4 text-lg font-semibold">
          ${product?.price?.toFixed(2) || '0.00'}
        </p>
        <form method="post" action="/cart/items" className="mt-6 flex items-center gap-3">
          <input type="hidden" name="productId" value={product?.id || ''} />
          <input
            type="number"
            name="quantity"
            defaultValue={1}
            min={1}
            className="w-24 rounded border border-slate-300 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            Add to Cart
          </button>
        </form>
        <a
          href="/cart"
          className="mt-4 inline-flex rounded border border-slate-300 px-4 py-2 hover:bg-slate-50"
        >
          View Cart
        </a>
      </div>
    </main>
  );
}

/**
 * Wraps the product detail page in the shared panel layout.
 */
export function Page(props: ServerPageProps) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
}

export default Page;
