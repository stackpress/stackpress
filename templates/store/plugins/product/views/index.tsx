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
    <main className="min-h-full w-full overflow-auto">
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <section className="rounded-[2rem] border border-[#dacbb9] bg-white/80 p-8 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a6a2f]">
            Product Plugin
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#2e2016]">Products</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6a5540]">
            This page is intentionally narrow: it demonstrates the public
            product surface while keeping ownership inside the product plugin.
          </p>
        </section>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {products.map(product => (
            <li
              key={product.id}
              className="rounded-[1.75rem] border border-[#dacbb9] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,239,226,0.88))] p-6 shadow-[0_20px_45px_rgba(78,53,23,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a6a2f]">
                Simple Product
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#2e2016]">
                {product.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#6a5540]">
                {product.summary || 'No summary provided.'}
              </p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="text-lg font-semibold text-[#2e2016]">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs uppercase tracking-[0.25em] text-[#8e7a66]">
                  demo seed
                </p>
              </div>
              <a
                href={`/products/${product.slug}`}
                className="mt-6 inline-flex rounded-full border border-[#ccb79d] bg-white/80 px-4 py-2 text-sm font-semibold text-[#2e2016] hover:border-[#9a6a2f] hover:bg-white"
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
