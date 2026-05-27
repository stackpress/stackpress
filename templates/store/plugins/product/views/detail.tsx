//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

const title = 'Product Detail';
const description = 'Public product detail page for the store sample.';

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
    <main className="flex h-full w-full flex-col overflow-auto">
      <div className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-[minmax(0,1.5fr)_20rem] md:p-10">
        <section className="rounded-[2rem] border border-[#dacbb9] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,239,226,0.90))] p-8 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a6a2f]">
            Product Detail
          </p>
          <h1 className="mt-4 text-4xl font-bold text-[#2e2016]">
            {product?.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6a5540]">
            {product?.summary || 'No summary provided.'}
          </p>
          <div className="mt-8 inline-flex rounded-full bg-[#2e2016] px-5 py-3 text-lg font-semibold text-white shadow-[0_18px_35px_rgba(46,32,22,0.18)]">
            ${product?.price?.toFixed(2) || '0.00'}
          </div>
        </section>
        <aside className="rounded-[2rem] border border-[#dacbb9] bg-white/82 p-6 shadow-[0_24px_60px_rgba(78,53,23,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a6a2f]">
            Add To Cart
          </p>
          <form method="post" action="/cart/items" className="mt-6 space-y-4">
            <input type="hidden" name="productId" value={product?.id || ''} />
            <label className="flex flex-col gap-2 text-sm font-medium text-[#5f4d3c]">
              <span>Quantity</span>
              <input
                type="number"
                name="quantity"
                defaultValue={1}
                min={1}
                className="w-full rounded-2xl border border-[#ccb79d] px-4 py-3"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-full bg-[#2e2016] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1f140d]"
            >
              Add to Cart
            </button>
          </form>
          <a
            href="/cart"
            className="mt-4 inline-flex w-full justify-center rounded-full border border-[#ccb79d] bg-white/85 px-4 py-3 text-sm font-semibold text-[#2e2016] hover:border-[#9a6a2f] hover:bg-white"
          >
            View Cart
          </a>
        </aside>
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
 * Wraps the product detail page in the shared panel layout.
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
