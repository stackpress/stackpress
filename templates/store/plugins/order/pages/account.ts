//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { OrderExtended } from 'store-client/types';

/**
 * Shows a lightweight order history for the sample flow.
 */
export default action(async function AccountOrdersPage({ req, res, ctx }) {
  const email = req.data<string>('email');

  // this sample uses email-based lookup instead of a profile join
  const orders = email
    ? await ctx.resolve<OrderExtended[]>('order-search', {
        eq: { email }
      })
    : { results: [] };

  res.results({
    email,
    orders: orders.results || []
  });
  setViewProps(req, res, ctx);
});
