//stackpress
import { LayoutPanel } from 'stackpress/view/client';

/**
 * Renders the minimal checkout form for the sample flow.
 */
export default function CheckoutPage(props: any) {
  return (
    <LayoutPanel {...props}>
      <main className="w-full h-full overflow-auto">
        <div className="mx-auto max-w-2xl p-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <form
            method="post"
            action="/checkout"
            className="mt-6 flex flex-col gap-4"
          >
            <label className="flex flex-col gap-2">
              <span>Name</span>
              <input
                type="text"
                name="name"
                className="rounded border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Email</span>
              <input
                type="email"
                name="email"
                className="rounded border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="createAccount" value="1" />
              <span>Create account during checkout</span>
            </label>
            <button
              type="submit"
              className="inline-flex w-fit rounded border border-slate-300 px-4 py-2 hover:bg-slate-50"
            >
              Place Order
            </button>
          </form>
        </div>
      </main>
    </LayoutPanel>
  );
}
