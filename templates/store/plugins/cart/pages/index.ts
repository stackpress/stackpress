//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Cart, CartItemExtended, Product } from 'store-client/types';

/**
 * Resolves the active cart for the current session, creating one when needed.
 */
async function resolveCart(ctx: any, sessionId: string) {
  // keep guest carts stable across requests with a single session lookup
  const carts = await ctx.resolve<Cart[]>('cart-search', {
    eq: { sessionId }
  });

  if (carts.results?.length) {
    return carts.results[0];
  }

  const created = await ctx.resolve<Cart>('cart-create', { sessionId });
  return created.results!;
}

/**
 * Handles cart readback and add-to-cart submissions.
 */
export default action(async function CartPage({ req, res, ctx }) {
  // this sample falls back to a fixed guest session when auth is absent
  const sessionId = req.session?.id || 'guest-session';
  const cart = await resolveCart(ctx, sessionId);

  if (req.method === 'POST') {
    const productId = req.data<string>('productId');
    const quantity = Number(req.data<string>('quantity') || 1);

    // load the chosen product so the cart can snapshot its current price
    const product = await ctx.resolve<Product>('product-detail', { id: productId });
    const items = await ctx.resolve<CartItemExtended[]>('cart-item-search', {
      eq: { cartId: cart.id, productId }
    });

    // update the existing row when the product is already in the cart
    if (items.results?.length) {
      await ctx.resolve('cart-item-update', {
        id: items.results[0].id,
        cartId: cart.id,
        productId,
        quantity: items.results[0].quantity + quantity,
        unitPrice: items.results[0].unitPrice
      });
    } else {
      // otherwise create a fresh cart line with the current unit price
      await ctx.resolve('cart-item-create', {
        cartId: cart.id,
        productId,
        quantity,
        unitPrice: product.results?.price || 0
      });
    }

    res.redirect('/cart');
    return;
  }

  // the review page needs the current lines plus a simple computed total
  const items = await ctx.resolve<CartItemExtended[]>('cart-item-search', {
    eq: { cartId: cart.id }
  });
  const total = (items.results || []).reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  res.results({
    cart,
    items: items.results || [],
    total
  });
  setViewProps(req, res, ctx);
});
