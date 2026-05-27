//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type {
  Cart,
  CartItemExtended,
  Order,
  OrderItemInput
} from 'store-client/types';

/**
 * Resolves the current cart without creating one during checkout.
 */
async function resolveCart(ctx: any, sessionId: string) {
  const carts = await ctx.resolve<Cart[]>('cart-search', {
    eq: { sessionId }
  });

  if (!carts.results?.length) {
    return null;
  }

  return carts.results[0];
}

/**
 * Handles checkout display and order placement.
 */
export default action(async function CheckoutPage({ req, res, ctx }) {
  // checkout reads from the same guest or signed-in cart used by the cart page
  const sessionId = req.session?.id || 'guest-session';
  const cart = await resolveCart(ctx, sessionId);

  if (req.method === 'POST') {
    const name = req.data<string>('name');
    const email = req.data<string>('email');
    const createAccount = req.data<string>('createAccount') === '1';

    // pull the current cart lines so totals and order items stay aligned
    const items = cart
      ? await ctx.resolve<CartItemExtended[]>('cart-item-search', {
          eq: { cartId: cart.id }
        })
      : { results: [] };
    const rows = items.results || [];
    const total = rows.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);

    // optional signup keeps the sample flow account-aware without requiring auth
    if (createAccount) {
      await ctx.resolve('auth-signup', {
        type: 'person',
        name,
        email,
        username: email,
        secret: 'Password123!',
        roles: [ 'USER' ]
      });
    }

    // persist the order header before fanning cart lines into order items
    const order = await ctx.resolve<Order>('order-create', {
      name,
      email,
      status: 'PLACED',
      total
    });

    // copy each cart line into the placed order snapshot
    for (const item of rows) {
      const payload: OrderItemInput = {
        orderId: order.results!.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      };
      await ctx.resolve('order-item-create', payload);
    }

    res.redirect(`/orders/confirmation/${order.results!.id}`);
    return;
  }

  // the page itself stays intentionally minimal and form-driven
  res.results({
    title: 'Checkout'
  });
  setViewProps(req, res, ctx);
});
