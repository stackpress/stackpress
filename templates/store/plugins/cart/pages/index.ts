//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Cart, CartItemExtended, Product } from 'store-client/types';

/**
 * Handles cart readback and add-to-cart submissions.
 */
export default action(async function CartPage({ req, res, ctx }) {
  // use the auth session token when available, otherwise keep a shared guest cart
  const sessionId = req.session.has('session')
    ? req.session('session') as string
    : 'guest-session';

  // keep the cart lookup inside the typed action context
  const carts = await ctx.resolve<Cart[]>('cart-search', {
    eq: { sessionId }
  });
  const cart = carts.results?.[0]
    || (await ctx.resolve<Cart>('cart-create', { sessionId })).results!;

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
