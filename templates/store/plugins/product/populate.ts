//modules
import { action } from 'stackpress/server';
//client
import type { Product } from 'store-client/types';

const products = [
  {
    title: 'Plugin First Mug',
    slug: 'plugin-first-mug',
    summary: 'A seeded sample product for the plugin-composition demo.',
    price: 18.5,
    active: true
  },
  {
    title: 'Route Priority Tee',
    slug: 'route-priority-tee',
    summary: 'A second seeded product for cart and checkout testing.',
    price: 32,
    active: true
  }
];

export default action(async function PopulateProducts({ ctx }) {
  for (const input of products) {
    const existing = await ctx.resolve<Product[]>('product-search', {
      eq: { slug: input.slug }
    });

    if (existing.results?.length) {
      continue;
    }

    await ctx.resolve('product-create', input);
  }
});
