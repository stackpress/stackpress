//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Product } from 'store-client/types';

/**
 * Loads the public product listing for the sample storefront.
 */
export default action(async function ProductIndexPage({ req, res, ctx }) {
  // keep the public list intentionally narrow so only active products show up
  const products = await ctx.resolve<Product[]>('product-search', {
    eq: { active: true }
  });

  res.results({ products: products.results || [] });
  setViewProps(req, res, ctx);
});
