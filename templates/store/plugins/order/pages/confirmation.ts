//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Order } from 'store-client/types';

/**
 * Loads the placed order so the confirmation page can read it back.
 */
export default action(async function OrderConfirmationPage({ req, res, ctx }) {
  const id = req.data<string>('id');

  // confirmation uses the placed order id emitted from checkout
  const order = await ctx.resolve<Order>('order-detail', { id });
  res.results(order.results);
  setViewProps(req, res, ctx);
});
