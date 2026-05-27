//stackpress
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

const title = 'Your Orders';
const description = 'Order history page for the StackPress store sample.';

// shapes the lightweight order history payload
type AccountOrdersResults = {
  email?: string;
  orders: Array<{
    id: string;
    email: string;
    status: string;
    total: number;
  }>;
};

/**
 * Renders the sample order history page.
 */
export function Body() {
  const response = useResponse<AccountOrdersResults>();
  const orders = response.results?.orders || [];

  return (
    <main className="w-full h-full overflow-auto">
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        {!!response.results?.email && (
          <p className="mt-3 text-sm text-slate-600">
            Showing orders for {response.results.email}
          </p>
        )}
        <ul className="mt-6 flex flex-col gap-3">
          {orders.map(order => (
            <li
              key={order.id}
              className="rounded border border-slate-300 p-4"
            >
              <div className="font-medium">{order.id}</div>
              <div className="mt-1 text-sm text-slate-600">
                {order.email}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {order.status}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                ${order.total.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
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
 * Wraps the account order list in the shared panel layout.
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
