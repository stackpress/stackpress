//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Product } from 'store-client/types';

/**
 * Loads a single public product detail page by slug.
 */
export default action(async function ProductDetailPage({ req, res, ctx }) {
  const slug = req.data<string>('slug');

  // the storefront only links to active products, so keep the lookup aligned
  const products = await ctx.resolve<Product[]>('product-search', {
    eq: { slug, active: true }
  });

  // missing products should behave like a normal not-found page
  if (!products.results?.length) {
    res.code = 404;
    return;
  }

  // pass the first result straight through to the matching page view
  res.results(products.results[0]);
  setViewProps(req, res, ctx);
});
