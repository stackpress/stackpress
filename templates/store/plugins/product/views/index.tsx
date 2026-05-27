//stackpress
import type { ServerPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

// keeps the generated payload typed at the page boundary
type ProductResults = {
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    summary: string | null;
  }>;
};

/**
 * Renders the public product listing.
 */
export function Body() {
  const response = useResponse<ProductResults>();
  const products = response.results?.products || [];

  return (
    <main className="w-full h-full overflow-auto">
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {products.map(product => (
            <li
              key={product.id}
              className="rounded border border-slate-300 p-4"
            >
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {product.summary || 'No summary provided.'}
              </p>
              <p className="mt-4 font-medium">${product.price.toFixed(2)}</p>
              <a
                href={`/products/${product.slug}`}
                className="mt-4 inline-flex rounded border border-slate-300 px-3 py-2 hover:bg-slate-50"
              >
                View Product
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

/**
 * Wraps the product listing in the shared panel layout.
 */
export function Page(props: ServerPageProps) {
  return (
    <LayoutPanel {...props}>
      <Body />
    </LayoutPanel>
  );
}

export default Page;
