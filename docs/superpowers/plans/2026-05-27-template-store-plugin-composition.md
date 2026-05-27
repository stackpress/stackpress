# Template Store Plugin Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `templates/store` into a working plugin-composition sample where `store` stays infra-only, `app` stays shared-infra-only, and separate `product`, `cart`, `checkout`, and `order` plugins produce a minimal end-to-end flow.

**Architecture:** Keep persistence concerns inside `plugins/store` and shared app concerns inside `plugins/app`. Add separate feature plugins for `product`, `cart`, `checkout`, and `order`, strengthen `schema.idea` so generation is meaningful, and use StackPress routes, events, and plugin ordering to weave the flow without collapsing ownership into one plugin.

**Tech Stack:** TypeScript, StackPress, React, Reactus-backed StackPress views, PGlite, tsx/node test runner, Yarn workspaces

---

## File Structure

**Modify:**
- `templates/store/package.json`
  Purpose: add a local test script early, then register the new feature plugins only after real plugin files exist.
- `templates/store/schema.idea`
  Purpose: define the product/cart/order sample models that generated admin and client code will depend on.
- `templates/store/plugins/app/plugin.ts`
  Purpose: keep app-wide error handling and neutral shared routes only.
- `templates/store/plugins/app/pages/home.ts`
  Purpose: render a minimal sample home page with links into the feature flow.
- `templates/store/plugins/app/views/home.tsx`
  Purpose: provide shared home-page presentation without taking over feature ownership.
- `templates/store/plugins/store/populate.ts`
  Purpose: keep baseline admin/application seed behavior only.
- `templates/store/config/common.ts`
  Purpose: extend admin menu and copy only where the new generated models need discoverable admin entry points.

**Create:**
- `templates/store/tests/plugin-structure.test.ts`
  Purpose: verify `package.json` registers separate plugins and that `store`/`app` keep the expected narrow roles.
- `templates/store/tests/schema-generate.test.ts`
  Purpose: verify generated client output contains the sample model types after `generate`.
- `templates/store/plugins/product/plugin.ts`
- `templates/store/plugins/product/pages/index.ts`
- `templates/store/plugins/product/pages/detail.ts`
- `templates/store/plugins/product/views/index.tsx`
- `templates/store/plugins/product/views/detail.tsx`
  Purpose: own product listing and detail behavior.
- `templates/store/plugins/product/populate.ts`
  Purpose: seed product data from the product plugin rather than from `store`.
- `templates/store/plugins/cart/plugin.ts`
- `templates/store/plugins/cart/pages/index.ts`
- `templates/store/plugins/cart/views/index.tsx`
  Purpose: own cart read/update behavior.
- `templates/store/plugins/checkout/plugin.ts`
- `templates/store/plugins/checkout/pages/index.ts`
- `templates/store/plugins/checkout/views/index.tsx`
  Purpose: own checkout form and handoff to order creation.
- `templates/store/plugins/order/plugin.ts`
- `templates/store/plugins/order/pages/confirmation.ts`
- `templates/store/plugins/order/views/confirmation.tsx`
- `templates/store/plugins/order/pages/account.ts`
- `templates/store/plugins/order/views/account.tsx`
  Purpose: own placed-order confirmation and account order history surfaces.
- `docs/superpowers/reviews/2026-05-27-template-store-skill-evaluation.md`
  Purpose: capture findings on `stackpress-app-coordinator`, `chrisai-usage`, and their downstream skill families.

**Reference Only:**
- `docs/superpowers/specs/2026-05-26-template-store-design.md`
  Purpose: approved design and experiment criteria.
- `templates/blog/plugins/app/plugin.ts`
  Purpose: reference for route/view registration shape.
- `templates/store/uno.config.ts`
  Purpose: confirm UnoCSS coverage for plugin TSX files and prefer Uno or Tailwind-compatible utility classes in views.
- `templates/store/plugins/store/plugin.ts`
  Purpose: reference for infra-only plugin behavior that must remain narrow.
- `packages/stackpress/src/unocss.ts`
  Purpose: confirm the StackPress Uno preset and available custom utility patterns before polishing the views.

## Coordinator Phase Map

This plan follows the `stackpress-app-coordinator` workflow explicitly:

1. discovery
   Completed in the approved design spec at
   `docs/superpowers/specs/2026-05-26-template-store-design.md`
2. scaffold
   Tasks 1 and part of Task 3 create the plugin shells and wire registration
   only after real plugin files exist
3. schema
   Task 2 authors `schema.idea` intentionally for generated admin behavior
4. generate
   Task 2 runs `generate` immediately after schema work and verifies output
5. implementation routing
   Tasks 3 through 5 split runtime and view work by plugin responsibility
6. verification
   Task 7 checks generation, routing, runtime reachability, and flow behavior
7. optional polish
   Task 6 runs the ChrisAI TS and TSX cleanup pass after behavior works

### Task 1: Add Template Verification Scaffolding And Blank Plugin Shells

**Files:**
- Modify: `templates/store/package.json`
- Create: `templates/store/tests/plugin-structure.test.ts`
- Create: `templates/store/plugins/product/plugin.ts`
- Create: `templates/store/plugins/cart/plugin.ts`
- Create: `templates/store/plugins/checkout/plugin.ts`
- Create: `templates/store/plugins/order/plugin.ts`

- [ ] **Step 1: Write the failing plugin-structure test**

Create `templates/store/tests/plugin-structure.test.ts`:

```ts
//node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const packageJson = JSON.parse(
  fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')
);

test('package.json registers the store sample as separate plugins', () => {
  assert.deepEqual(packageJson.plugins, [
    './plugins/app/plugin',
    './plugins/store/plugin',
    './plugins/product/plugin',
    './plugins/cart/plugin',
    './plugins/checkout/plugin',
    './plugins/order/plugin',
    'stackpress'
  ]);
});
```

- [ ] **Step 2: Add a local test script in `package.json` without registering missing plugins**

Update `templates/store/package.json`:

```json
{
  "scripts": {
    "build": "stackpress build --b config/build -v",
    "dev": "dotenv -e .env -- stackpress serve --b config/develop -v",
    "emit": "dotenv -e .env -- stackpress emit",
    "generate": "stackpress generate --b config/develop -v",
    "migrate": "dotenv -e .env -- stackpress migrate --b config/develop -v",
    "populate": "dotenv -e .env -- stackpress populate --b config/develop -v",
    "preview": "dotenv -e .env -- stackpress serve --b config/preview -v",
    "purge": "dotenv -e .env -- stackpress purge --b config/develop -v",
    "push": "dotenv -e .env -- stackpress push --b config/develop -v",
    "query": "dotenv -e .env -- stackpress query --b config/develop -v",
    "test": "tsx --test tests/**/*.test.ts"
  }
}
```

- [ ] **Step 3: Create blank plugin shells before touching the plugin list**

Create `templates/store/plugins/product/plugin.ts`:

```ts
export default function plugin() {};
```

Create `templates/store/plugins/cart/plugin.ts`:

```ts
export default function plugin() {};
```

Create `templates/store/plugins/checkout/plugin.ts`:

```ts
export default function plugin() {};
```

Create `templates/store/plugins/order/plugin.ts`:

```ts
export default function plugin() {};
```

- [ ] **Step 4: Register the new plugins in `package.json` now that files exist**

Update `templates/store/package.json`:

```json
{
  "plugins": [
    "./plugins/app/plugin",
    "./plugins/store/plugin",
    "./plugins/product/plugin",
    "./plugins/cart/plugin",
    "./plugins/checkout/plugin",
    "./plugins/order/plugin",
    "stackpress"
  ]
}
```

- [ ] **Step 5: Run the plugin-structure test to verify it passes**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
1 test passed
```

- [ ] **Step 6: Expand the test to guard the `store` and `app` boundaries**

Append this second test to `templates/store/tests/plugin-structure.test.ts`:

```ts
test('store and app plugins keep narrow infrastructure roles', () => {
  const storePlugin = fs.readFileSync(
    path.join(cwd, 'plugins/store/plugin.ts'),
    'utf8'
  );
  const appPlugin = fs.readFileSync(
    path.join(cwd, 'plugins/app/plugin.ts'),
    'utf8'
  );

  assert.match(storePlugin, /register\('database'/);
  assert.doesNotMatch(storePlugin, /product|cart|checkout|order/);
  assert.match(appPlugin, /server\.on\('error'/);
});
```

- [ ] **Step 7: Run the same test file and verify the second test fails first**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
1 passing
1 failing
```

The failure should come from the missing `server.on('error'` match in the current `plugins/app/plugin.ts`.

- [ ] **Step 8: Update `plugins/app/plugin.ts` to preserve app-wide error handling**

Ensure `templates/store/plugins/app/plugin.ts` contains at least:

```ts
//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('listen', async _ => {
    server.on('error', ({ req, res }) => {
      if (res.body) return;
      if (req.mimetype === 'terminal/arguments') {
        console.log('CLI Error:', res.toStatusResponse());
      }
    });
  });
  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/home.js'));
    server.view.get('/', '@/plugins/app/views/home');
  });
};
```

- [ ] **Step 9: Re-run the test file and verify both tests pass**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
2 tests passed
```

- [ ] **Step 10: Commit the scaffolding and plugin registration changes**

Run:

```bash
git add templates/store/package.json templates/store/plugins/app/plugin.ts templates/store/plugins/product/plugin.ts templates/store/plugins/cart/plugin.ts templates/store/plugins/checkout/plugin.ts templates/store/plugins/order/plugin.ts templates/store/tests/plugin-structure.test.ts
git commit -m "test: add store template plugin structure checks"
```

### Task 2: Define The Sample Schema Intentionally And Verify Generation

**Files:**
- Modify: `templates/store/schema.idea`
- Modify: `templates/store/config/common.ts`
- Create: `templates/store/tests/schema-generate.test.ts`

- [ ] **Step 1: Write the failing generated-client schema test**

Create `templates/store/tests/schema-generate.test.ts`:

```ts
//node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const generatedTypes = path.join(cwd, 'node_modules/store-client/types.d.ts');

test('generated client types include the sample store models', () => {
  const source = fs.readFileSync(generatedTypes, 'utf8');
  assert.match(source, /type Product/);
  assert.match(source, /type Cart/);
  assert.match(source, /type Order/);
});
```

- [ ] **Step 2: Run the generation test and verify it fails before schema work**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/schema-generate.test.ts
```

Expected:

```text
1 failing
```

The failure should be a missing file or missing type match because the schema has not been expanded yet.

- [ ] **Step 3: Replace `schema.idea` with an intentional StackPress schema contract**

Update `templates/store/schema.idea` to include these models and to make every
`@field.*`, `@filter.*`, `@span.*`, `@list.*`, and `@view.*` choice
intentional. Do not leave admin visibility behavior to accident.

Rules to apply while authoring:

- `id`, `created`, and `updated` are generated, so do not give them `@field.*`
- `active` is a background lifecycle flag, so it can skip editable `@field.*`
  while still using `@filter.switch` and `@view.yesno`
- text fields that should appear in admin need explicit field, list, and view
  surfaces
- number and date fields should consider `@span.*` because range-style admin
  filtering is useful there
- relation key fields should carry relation-oriented field/filter/list/view
  metadata, while object relation fields should carry `@relation(...)`

Use a schema block in this shape:

```txt
use "stackpress/stackpress.idea"

enum OrderStatus {
  PLACED "PLACED"
  COMPLETE "COMPLETE"
}

model Profile {
  carts         Cart[] @label("Carts")
  orders        Order[] @label("Orders")
}

model Product
  @labels("Product" "Products")
  @icon("box-open")
  @display("{{title}}")
{
  id            String
                @label("ID")
                @id @default("cuid()")
                @list.clip({ length 10 hellip true })
                @description("Unique generated identifier.")

  title         String
                @label("Title")
                @searchable
                @field.string
                @filter.string
                @is.required("Title is required")
                @list.string
                @view.string
                @description("Name of the sample product.")

  slug          String
                @label("Slug")
                @unique
                @field.slug
                @filter.string
                @is.required("Slug is required")
                @list.string
                @view.string
                @description("URL-safe product slug.")

  summary       Text?
                @label("Summary")
                @field.textarea
                @list.text
                @view.text
                @description("Short merchandising description.")

  price         Float
                @label("Price")
                @default(0)
                @field.price
                @filter.price
                @span.price
                @list.price
                @view.price
                @description("Display price for the product.")

  active        Boolean
                @label("Active")
                @default(true) @active
                @filter.switch
                @view.yesno
                @description("Controls whether the product appears in active flows.")

  created       Datetime
                @label("Created")
                @default("now()") @sortable
                @span.date("m d, Y")
                @list.date("m d, Y h:iA")
                @view.date("m d, Y h:iA")
                @description("Generated creation timestamp.")

  updated       Datetime
                @label("Updated")
                @default("now()") @timestamp @sortable
                @span.date("m d, Y")
                @list.date("m d, Y h:iA")
                @view.date("m d, Y h:iA")
                @description("Generated update timestamp.")

  cartItems     CartItem[] @label("Cart Items")
  orderItems    OrderItem[] @label("Order Items")
}

model Cart
  @labels("Cart" "Carts")
  @icon("cart-shopping")
  @display("{{id}}")
  @query("*" "profile.*" "items.*" "items.product.*")
{
  id            String
                @label("ID")
                @id @default("cuid()")
                @list.clip({ length 10 hellip true })
                @description("Unique generated identifier.")

  profileId     String?
                @label("Profile")
                @field.relation({
                  id "id"
                  search "/admin/profile/search?json&q={{query}}"
                  template "{{name}}"
                })
                @filter.relation({
                  id "id"
                  search "/admin/profile/search?json&q={{query}}"
                  template "{{name}}"
                })
                @list.template({ template "{{profile.name}}" })
                @view.template({ template "{{profile.name}}" })
                @description("Optional owning profile for signed-in carts.")

  sessionId     String?
                @label("Session ID")
                @filter.string
                @list.clip({ length 12 hellip true })
                @view.string
                @description("Guest cart session identifier.")

  created       Datetime
                @label("Created")
                @default("now()") @sortable
                @span.date("m d, Y")
                @list.date("m d, Y h:iA")
                @view.date("m d, Y h:iA")
                @description("Generated creation timestamp.")

  updated       Datetime
                @label("Updated")
                @default("now()") @timestamp @sortable
                @span.date("m d, Y")
                @list.date("m d, Y h:iA")
                @view.date("m d, Y h:iA")
                @description("Generated update timestamp.")

  items         CartItem[] @label("Items")
  profile       Profile? @relation({ local "profileId" foreign "id" })
}

model CartItem
  @labels("Cart Item" "Cart Items")
  @icon("cart-plus")
  @display("{{product.title}}")
  @query("*" "product.*")
{
  id            String
                @label("ID")
                @id @default("cuid()")
                @list.clip({ length 10 hellip true })
                @description("Unique generated identifier.")

  cartId        String
                @label("Cart")
                @field.relation({
                  id "id"
                  search "/admin/cart/search?json"
                  template "{{id}}"
                })
                @filter.relation({
                  id "id"
                  search "/admin/cart/search?json"
                  template "{{id}}"
                })
                @list.template({ template "{{cart.id}}" })
                @view.template({ template "{{cart.id}}" })
                @description("Owning cart for this item.")

  productId     String
                @label("Product")
                @field.relation({
                  id "id"
                  search "/admin/product/search?json&q={{query}}"
                  template "{{title}}"
                })
                @filter.relation({
                  id "id"
                  search "/admin/product/search?json&q={{query}}"
                  template "{{title}}"
                })
                @list.template({ template "{{product.title}}" })
                @view.template({ template "{{product.title}}" })
                @description("Selected product.")

  quantity      Number
                @label("Quantity")
                @default(1)
                @field.integer({ min 1 })
                @filter.integer
                @span.integer
                @list.number
                @view.number
                @description("Quantity chosen for the cart.")

  unitPrice     Float
                @label("Unit Price")
                @default(0)
                @field.price
                @filter.price
                @span.price
                @list.price
                @view.price
                @description("Snapshot of the product price at add-to-cart time.")

  cart          Cart @relation({ local "cartId" foreign "id" })
  product       Product @relation({ local "productId" foreign "id" })
}

model Order
  @labels("Order" "Orders")
  @icon("receipt")
  @display("{{email}}")
  @query("*" "profile.*" "items.*" "items.product.*")
{
  id            String
                @label("ID")
                @id @default("cuid()")
                @list.clip({ length 10 hellip true })
                @description("Unique generated identifier.")

  profileId     String?
                @label("Profile")
                @field.relation({
                  id "id"
                  search "/admin/profile/search?json&q={{query}}"
                  template "{{name}}"
                })
                @filter.relation({
                  id "id"
                  search "/admin/profile/search?json&q={{query}}"
                  template "{{name}}"
                })
                @list.template({ template "{{profile.name}}" })
                @view.template({ template "{{profile.name}}" })
                @description("Optional owning profile when the shopper created an account.")

  email         String
                @label("Email")
                @searchable
                @field.email
                @filter.email
                @is.required("Email is required")
                @list.string
                @view.string
                @description("Checkout email address.")

  name          String
                @label("Name")
                @searchable
                @field.string
                @filter.string
                @is.required("Name is required")
                @list.string
                @view.string
                @description("Checkout display name.")

  status        OrderStatus
                @label("Status")
                @default("PLACED")
                @field.select
                @filter.select
                @list.badge({ success "COMPLETE" warning "PLACED" })
                @view.badge({ success "COMPLETE" warning "PLACED" })
                @description("Current order status.")

  total         Float
                @label("Total")
                @default(0)
                @field.price
                @filter.price
                @span.price
                @list.price
                @view.price
                @description("Stored order total.")

  created       Datetime
                @label("Created")
                @default("now()") @sortable
                @span.date("m d, Y")
                @list.date("m d, Y h:iA")
                @view.date("m d, Y h:iA")
                @description("Generated creation timestamp.")

  updated       Datetime
                @label("Updated")
                @default("now()") @timestamp @sortable
                @span.date("m d, Y")
                @list.date("m d, Y h:iA")
                @view.date("m d, Y h:iA")
                @description("Generated update timestamp.")

  items         OrderItem[] @label("Items")
  profile       Profile? @relation({ local "profileId" foreign "id" })
}

model OrderItem
  @labels("Order Item" "Order Items")
  @icon("receipt")
  @display("{{product.title}}")
  @query("*" "product.*")
{
  id            String
                @label("ID")
                @id @default("cuid()")
                @list.clip({ length 10 hellip true })
                @description("Unique generated identifier.")

  orderId       String
                @label("Order")
                @field.relation({
                  id "id"
                  search "/admin/order/search?json"
                  template "{{email}}"
                })
                @filter.relation({
                  id "id"
                  search "/admin/order/search?json"
                  template "{{email}}"
                })
                @list.template({ template "{{order.email}}" })
                @view.template({ template "{{order.email}}" })
                @description("Owning order for this line item.")

  productId     String
                @label("Product")
                @field.relation({
                  id "id"
                  search "/admin/product/search?json&q={{query}}"
                  template "{{title}}"
                })
                @filter.relation({
                  id "id"
                  search "/admin/product/search?json&q={{query}}"
                  template "{{title}}"
                })
                @list.template({ template "{{product.title}}" })
                @view.template({ template "{{product.title}}" })
                @description("Ordered product.")

  quantity      Number
                @label("Quantity")
                @default(1)
                @field.integer({ min 1 })
                @filter.integer
                @span.integer
                @list.number
                @view.number
                @description("Quantity stored on the order.")

  unitPrice     Float
                @label("Unit Price")
                @default(0)
                @field.price
                @filter.price
                @span.price
                @list.price
                @view.price
                @description("Stored price snapshot for this order item.")

  order         Order @relation({ local "orderId" foreign "id" })
  product       Product @relation({ local "productId" foreign "id" })
}
```

- [ ] **Step 4: Extend the admin menu to expose generated feature models**

Append these menu entries to `templates/store/config/common.ts` inside `admin.menu`:

```ts
{
  name: 'Products',
  icon: 'box-open',
  path: '/admin/product/search',
  match: '/admin/product'
},
{
  name: 'Carts',
  icon: 'cart-shopping',
  path: '/admin/cart/search',
  match: '/admin/cart'
},
{
  name: 'Orders',
  icon: 'receipt',
  path: '/admin/order/search',
  match: '/admin/order'
}
```

Use valid Font Awesome icon names without the `fa-` prefix when adjusting these
values.

- [ ] **Step 5: Review the schema against `stackpress-idea-authoring` before generating**

Before running `generate`, inspect the drafted schema and confirm:

- every admin-visible scalar field has intentional metadata choices
- every omitted surface such as `@field.*` or `@view.*` is omitted on purpose
- relation key fields carry generated UI metadata rather than the relation
  object field
- generated fields such as `id`, `created`, and `updated` remain non-editable

If any field still reads like a generic database column instead of a StackPress
schema contract, fix the schema first.

- [ ] **Step 6: Run generation and verify it succeeds**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store generate
```

Expected:

```text
generated
```

Expected side effect: `templates/store/node_modules/store-client` exists and contains generated files.

- [ ] **Step 7: Re-run the schema generation test and verify it passes**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/schema-generate.test.ts
```

Expected:

```text
1 test passed
```

- [ ] **Step 8: Commit the schema and generation work**

Run:

```bash
git add templates/store/schema.idea templates/store/config/common.ts templates/store/tests/schema-generate.test.ts
git commit -m "feat: add store template sample schema"
```

### Task 3: Add The Product Plugin And Product Seeding

**Files:**
- Create: `templates/store/plugins/product/plugin.ts`
- Create: `templates/store/plugins/product/pages/index.ts`
- Create: `templates/store/plugins/product/pages/detail.ts`
- Create: `templates/store/plugins/product/views/index.tsx`
- Create: `templates/store/plugins/product/views/detail.tsx`
- Create: `templates/store/plugins/product/populate.ts`
- Modify: `templates/store/plugins/app/pages/home.ts`
- Modify: `templates/store/plugins/app/views/home.tsx`

- [ ] **Step 1: Write the product route registration test**

Append this test to `templates/store/tests/plugin-structure.test.ts`:

```ts
test('product plugin owns product routes', () => {
  const productPlugin = fs.readFileSync(
    path.join(cwd, 'plugins/product/plugin.ts'),
    'utf8'
  );

  assert.match(productPlugin, /server\.import\.get\('\/products'/);
  assert.match(productPlugin, /server\.view\.get\('\/products'/);
  assert.match(productPlugin, /server\.import\.get\('\/products\/:slug'/);
});
```

- [ ] **Step 2: Run the plugin structure tests and verify the new test fails**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
2 passing
1 failing
```

- [ ] **Step 3: Create the product plugin and route wiring**

Create `templates/store/plugins/product/plugin.ts`:

```ts
//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('listen', async _ => {
    server.on('populate', () => import('./populate.js'));
  });
  server.on('route', async _ => {
    server.import.get('/products', () => import('./pages/index.js'));
    server.view.get('/products', '@/plugins/product/views/index');

    server.import.get('/products/:slug', () => import('./pages/detail.js'));
    server.view.get('/products/:slug', '@/plugins/product/views/detail');
  });
};
```

- [ ] **Step 4: Create the product page handlers**

Create `templates/store/plugins/product/pages/index.ts`:

```ts
//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Product } from 'store-client/types';

export default action(async function ProductIndexPage({ req, res, ctx }) {
  const products = await ctx.resolve<Product[]>('product-search', {
    eq: { active: true }
  });
  res.results({ products: products.results || [] });
  setViewProps(req, res, ctx);
});
```

Create `templates/store/plugins/product/pages/detail.ts`:

```ts
//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Product } from 'store-client/types';

export default action(async function ProductDetailPage({ req, res, ctx }) {
  const slug = req.data<string>('slug');
  const products = await ctx.resolve<Product[]>('product-search', {
    eq: { slug, active: true }
  });
  if (!products.results?.length) {
    res.setCode(404);
    return;
  }
  res.results(products.results[0]);
  setViewProps(req, res, ctx);
});
```

- [ ] **Step 5: Create the product views and move the home page toward sample navigation**

Create `templates/store/plugins/product/views/index.tsx`:

```tsx
import { Link, LayoutAdmin, useResponse } from 'stackpress/view/client';

export default function ProductIndexPage(props: any) {
  const response = useResponse<{ products: Array<{ id: string; title: string; slug: string; price: number }> }>();
  return (
    <LayoutAdmin {...props}>
      <main>
        <h1>Products</h1>
        <ul>
          {(response.results?.products || []).map(product => (
            <li key={product.id}>
              <Link href={`/products/${product.slug}`}>
                {product.title} - ${product.price}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </LayoutAdmin>
  );
}
```

Create `templates/store/plugins/product/views/detail.tsx`:

```tsx
import { Link, LayoutAdmin, useResponse } from 'stackpress/view/client';

export default function ProductDetailPage(props: any) {
  const response = useResponse<{ id: string; title: string; summary?: string; price: number; slug: string }>();
  const product = response.results;
  return (
    <LayoutAdmin {...props}>
      <main>
        <h1>{product?.title}</h1>
        <p>{product?.summary}</p>
        <p>${product?.price}</p>
        <form method="post" action="/cart/items">
          <input type="hidden" name="productId" value={product?.id || ''} />
          <input type="number" name="quantity" defaultValue={1} min={1} />
          <button type="submit">Add to Cart</button>
        </form>
        <Link href="/cart">View Cart</Link>
      </main>
    </LayoutAdmin>
  );
}
```

Update `templates/store/plugins/app/pages/home.ts`:

```ts
//modules
import { action } from '@stackpress/ingest';

export default action(async function HomePage({ res }) {
  res.results({
    title: 'Store Sample',
    links: [
      { href: '/products', label: 'Browse Products' },
      { href: '/cart', label: 'View Cart' }
    ]
  });
});
```

Update `templates/store/plugins/app/views/home.tsx`:

```tsx
import { Link, LayoutAdmin, useResponse } from 'stackpress/view/client';

export function Body() {
  const response = useResponse<{
    title: string;
    links: Array<{ href: string; label: string }>;
  }>();
  return (
    <main className="border-t theme-bc-1 w-full h-full">
      <div className="flex flex-col gap-4 w-full h-full">
        <h1>{response.results?.title || 'Store Sample'}</h1>
        <ul>
          {(response.results?.links || []).map(link => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Seed products from the product plugin**

Create `templates/store/plugins/product/populate.ts`:

```ts
//modules
import { action } from 'stackpress/server';

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
  for (const product of products) {
    await ctx.resolve('product-create', product);
  }
});
```

- [ ] **Step 7: Re-run the plugin-structure test and verify it passes**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
3 tests passed
```

- [ ] **Step 8: Commit the product plugin work**

Run:

```bash
git add templates/store/plugins/app/pages/home.ts templates/store/plugins/app/views/home.tsx templates/store/plugins/product
git commit -m "feat: add store template product plugin"
```

### Task 4: Add The Cart Plugin And Guest Cart Resolution

**Files:**
- Create: `templates/store/plugins/cart/plugin.ts`
- Create: `templates/store/plugins/cart/pages/index.ts`
- Create: `templates/store/plugins/cart/views/index.tsx`

- [ ] **Step 1: Write the cart plugin route test**

Append this test to `templates/store/tests/plugin-structure.test.ts`:

```ts
test('cart plugin owns cart routes', () => {
  const cartPlugin = fs.readFileSync(
    path.join(cwd, 'plugins/cart/plugin.ts'),
    'utf8'
  );

  assert.match(cartPlugin, /server\.import\.get\('\/cart'/);
  assert.match(cartPlugin, /server\.view\.get\('\/cart'/);
  assert.match(cartPlugin, /server\.import\.post\('\/cart\/items'/);
});
```

- [ ] **Step 2: Run the structure tests and verify the cart test fails**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
3 passing
1 failing
```

- [ ] **Step 3: Create the cart plugin and route ownership**

Create `templates/store/plugins/cart/plugin.ts`:

```ts
//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.import.get('/cart', () => import('./pages/index.js'));
    server.view.get('/cart', '@/plugins/cart/views/index');
    server.import.post('/cart/items', () => import('./pages/index.js'));
  });
};
```

- [ ] **Step 4: Create the cart page handler with guest-cart lookup and add-item behavior**

Create `templates/store/plugins/cart/pages/index.ts`:

```ts
//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';
//client
import type { Cart } from 'store-client/types';

async function resolveCart(ctx: any, sessionId: string) {
  const carts = await ctx.resolve<Cart[]>('cart-search', {
    eq: { sessionId }
  });
  if (carts.results?.length) return carts.results[0];
  const created = await ctx.resolve('cart-create', { sessionId });
  return created.results;
}

export default action(async function CartPage({ req, res, ctx }) {
  const sessionId = req.session?.id || 'guest-session';
  const cart = await resolveCart(ctx, sessionId);

  if (req.method === 'POST') {
    const productId = req.data<string>('productId');
    const quantity = Number(req.data<string>('quantity') || 1);
    await ctx.resolve('cart-item-create', {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice: 0
    });
  }

  const fullCart = await ctx.resolve('cart-detail', { id: cart.id });
  res.results(fullCart.results);
  setViewProps(req, res, ctx);
});
```

- [ ] **Step 5: Create the cart view**

Create `templates/store/plugins/cart/views/index.tsx`:

```tsx
import { Link, LayoutAdmin, useResponse } from 'stackpress/view/client';

export default function CartPage(props: any) {
  const response = useResponse<any>();
  const items = response.results?.items || [];
  return (
    <LayoutAdmin {...props}>
      <main>
        <h1>Your Cart</h1>
        <ul>
          {items.map((item: any) => (
            <li key={item.id}>
              {item.product?.title || item.productId} x {item.quantity}
            </li>
          ))}
        </ul>
        <Link href="/checkout">Continue to Checkout</Link>
      </main>
    </LayoutAdmin>
  );
}
```

- [ ] **Step 6: Re-run the structure tests and verify the cart test passes**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
4 tests passed
```

- [ ] **Step 7: Commit the cart plugin work**

Run:

```bash
git add templates/store/plugins/cart templates/store/tests/plugin-structure.test.ts
git commit -m "feat: add store template cart plugin"
```

### Task 5: Add The Checkout And Order Plugins

**Files:**
- Create: `templates/store/plugins/checkout/plugin.ts`
- Create: `templates/store/plugins/checkout/pages/index.ts`
- Create: `templates/store/plugins/checkout/views/index.tsx`
- Create: `templates/store/plugins/order/plugin.ts`
- Create: `templates/store/plugins/order/pages/confirmation.ts`
- Create: `templates/store/plugins/order/views/confirmation.tsx`
- Create: `templates/store/plugins/order/pages/account.ts`
- Create: `templates/store/plugins/order/views/account.tsx`

- [ ] **Step 1: Write the checkout and order route tests**

Append these tests to `templates/store/tests/plugin-structure.test.ts`:

```ts
test('checkout plugin owns checkout routes', () => {
  const checkoutPlugin = fs.readFileSync(
    path.join(cwd, 'plugins/checkout/plugin.ts'),
    'utf8'
  );

  assert.match(checkoutPlugin, /server\.import\.get\('\/checkout'/);
  assert.match(checkoutPlugin, /server\.import\.post\('\/checkout'/);
});

test('order plugin owns order confirmation routes', () => {
  const orderPlugin = fs.readFileSync(
    path.join(cwd, 'plugins/order/plugin.ts'),
    'utf8'
  );

  assert.match(orderPlugin, /server\.import\.get\('\/orders\/confirmation\/:id'/);
  assert.match(orderPlugin, /server\.import\.get\('\/account\/orders'/);
});
```

- [ ] **Step 2: Run the structure tests and verify both new tests fail**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
4 passing
2 failing
```

- [ ] **Step 3: Create the checkout plugin**

Create `templates/store/plugins/checkout/plugin.ts`:

```ts
//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.import.get('/checkout', () => import('./pages/index.js'));
    server.view.get('/checkout', '@/plugins/checkout/views/index');
    server.import.post('/checkout', () => import('./pages/index.js'));
  });
};
```

- [ ] **Step 4: Create the checkout handler and view**

Create `templates/store/plugins/checkout/pages/index.ts`:

```ts
//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async function CheckoutPage({ req, res, ctx }) {
  if (req.method === 'POST') {
    const name = req.data<string>('name');
    const email = req.data<string>('email');
    const createAccount = req.data<string>('createAccount') === '1';

    let profileId: string | undefined;
    if (createAccount) {
      const signup = await ctx.resolve('auth-signup', {
        type: 'person',
        name,
        email,
        username: email,
        secret: 'Password123!',
        roles: [ 'USER' ]
      });
      profileId = signup.results?.id;
    }

    const order = await ctx.resolve('order-create', {
      profileId,
      name,
      email,
      status: 'PLACED',
      total: 0
    });
    res.redirect(`/orders/confirmation/${order.results?.id}`);
    return;
  }

  res.results({ title: 'Checkout' });
  setViewProps(req, res, ctx);
});
```

Create `templates/store/plugins/checkout/views/index.tsx`:

```tsx
import { LayoutAdmin } from 'stackpress/view/client';

export default function CheckoutPage(props: any) {
  return (
    <LayoutAdmin {...props}>
      <main>
        <h1>Checkout</h1>
        <form method="post" action="/checkout">
          <label>
            Name
            <input type="text" name="name" />
          </label>
          <label>
            Email
            <input type="email" name="email" />
          </label>
          <label>
            <input type="checkbox" name="createAccount" value="1" />
            Create account during checkout
          </label>
          <button type="submit">Place Order</button>
        </form>
      </main>
    </LayoutAdmin>
  );
}
```

- [ ] **Step 5: Create the order plugin, confirmation page, and account page**

Create `templates/store/plugins/order/plugin.ts`:

```ts
//modules
import type { HttpServer } from '@stackpress/ingest';
import type { Config } from '../../config/common.js';

export default function plugin(server: HttpServer<Config>) {
  server.on('route', async _ => {
    server.import.get(
      '/orders/confirmation/:id',
      () => import('./pages/confirmation.js')
    );
    server.view.get(
      '/orders/confirmation/:id',
      '@/plugins/order/views/confirmation'
    );

    server.import.get('/account/orders', () => import('./pages/account.js'));
    server.view.get('/account/orders', '@/plugins/order/views/account');
  });
};
```

Create `templates/store/plugins/order/pages/confirmation.ts`:

```ts
//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async function OrderConfirmationPage({ req, res, ctx }) {
  const id = req.data<string>('id');
  const order = await ctx.resolve('order-detail', { id });
  res.results(order.results);
  setViewProps(req, res, ctx);
});
```

Create `templates/store/plugins/order/views/confirmation.tsx`:

```tsx
import { Link, LayoutAdmin, useResponse } from 'stackpress/view/client';

export default function OrderConfirmationPage(props: any) {
  const response = useResponse<any>();
  return (
    <LayoutAdmin {...props}>
      <main>
        <h1>Order Confirmed</h1>
        <p>Order ID: {response.results?.id}</p>
        <Link href="/account/orders">View Orders</Link>
      </main>
    </LayoutAdmin>
  );
}
```

Create `templates/store/plugins/order/pages/account.ts`:

```ts
//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async function AccountOrdersPage({ req, res, ctx }) {
  const profileId = req.session?.profile?.id;
  const orders = profileId
    ? await ctx.resolve('order-search', { eq: { profileId } })
    : { results: [] };
  res.results({ orders: orders.results || [] });
  setViewProps(req, res, ctx);
});
```

Create `templates/store/plugins/order/views/account.tsx`:

```tsx
import { LayoutAdmin, useResponse } from 'stackpress/view/client';

export default function AccountOrdersPage(props: any) {
  const response = useResponse<{ orders: Array<{ id: string; status: string; email: string }> }>();
  return (
    <LayoutAdmin {...props}>
      <main>
        <h1>Your Orders</h1>
        <ul>
          {(response.results?.orders || []).map(order => (
            <li key={order.id}>
              {order.id} - {order.status} - {order.email}
            </li>
          ))}
        </ul>
      </main>
    </LayoutAdmin>
  );
}
```

- [ ] **Step 6: Re-run the structure tests and verify all route-ownership tests pass**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test tests/plugin-structure.test.ts
```

Expected:

```text
6 tests passed
```

- [ ] **Step 7: Commit the checkout and order plugin work**

Run:

```bash
git add templates/store/plugins/checkout templates/store/plugins/order templates/store/tests/plugin-structure.test.ts
git commit -m "feat: add store template checkout and order plugins"
```

### Task 6: Run The ChrisAI TypeScript And TSX Polish Pass

**Files:**
- Modify: `templates/store/plugins/app/plugin.ts`
- Modify: `templates/store/plugins/app/pages/home.ts`
- Modify: `templates/store/plugins/app/views/home.tsx`
- Modify: `templates/store/plugins/product/plugin.ts`
- Modify: `templates/store/plugins/product/pages/index.ts`
- Modify: `templates/store/plugins/product/pages/detail.ts`
- Modify: `templates/store/plugins/product/views/index.tsx`
- Modify: `templates/store/plugins/product/views/detail.tsx`
- Modify: `templates/store/plugins/cart/plugin.ts`
- Modify: `templates/store/plugins/cart/pages/index.ts`
- Modify: `templates/store/plugins/cart/views/index.tsx`
- Modify: `templates/store/plugins/checkout/plugin.ts`
- Modify: `templates/store/plugins/checkout/pages/index.ts`
- Modify: `templates/store/plugins/checkout/views/index.tsx`
- Modify: `templates/store/plugins/order/plugin.ts`
- Modify: `templates/store/plugins/order/pages/confirmation.ts`
- Modify: `templates/store/plugins/order/pages/account.ts`
- Modify: `templates/store/plugins/order/views/confirmation.tsx`
- Modify: `templates/store/plugins/order/views/account.tsx`

- [ ] **Step 1: Run a TypeScript structure and comment pass on `.ts` plugin files**

Review each non-TSX file against `chrisai-coding-ts` and normalize:

- `//node`, `//modules`, and `//client` import grouping
- short JSDoc on exported functions
- story-style block comments before non-trivial logic
- ESM-safe local imports with `.js`

Apply that pass to:

```text
templates/store/plugins/app/plugin.ts
templates/store/plugins/app/pages/home.ts
templates/store/plugins/product/plugin.ts
templates/store/plugins/product/pages/index.ts
templates/store/plugins/product/pages/detail.ts
templates/store/plugins/cart/plugin.ts
templates/store/plugins/cart/pages/index.ts
templates/store/plugins/checkout/plugin.ts
templates/store/plugins/checkout/pages/index.ts
templates/store/plugins/order/plugin.ts
templates/store/plugins/order/pages/confirmation.ts
templates/store/plugins/order/pages/account.ts
```

- [ ] **Step 2: Run a TSX view pass using `chrisai-coding-ts-react`**

Review each TSX file and normalize:

- typed props or typed `useResponse()` payloads
- JSDoc on exported components where appropriate
- story-style comments around derived view state and sections
- JSX wrapping and section ordering

Apply that pass to:

```text
templates/store/plugins/app/views/home.tsx
templates/store/plugins/product/views/index.tsx
templates/store/plugins/product/views/detail.tsx
templates/store/plugins/cart/views/index.tsx
templates/store/plugins/checkout/views/index.tsx
templates/store/plugins/order/views/confirmation.tsx
templates/store/plugins/order/views/account.tsx
```

- [ ] **Step 3: Update the views to use Uno or Tailwind-compatible utility classes**

Use `templates/store/uno.config.ts` and `packages/stackpress/src/unocss.ts` as
references, then replace bare markup with minimal utility-driven layout and
spacing that remains understandable.

At minimum, ensure each page uses utility classes for:

- vertical spacing
- content width or padding
- simple typography hierarchy
- link or button affordance

Use Tailwind-compatible class names freely where they read better because the
StackPress Uno preset supports them alongside custom rules.

- [ ] **Step 4: Re-run the local tests after the style pass**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store test
```

Expected:

```text
all tests passed
```

- [ ] **Step 5: Commit the style and comment pass**

Run:

```bash
git add templates/store/plugins/app templates/store/plugins/product templates/store/plugins/cart templates/store/plugins/checkout templates/store/plugins/order
git commit -m "style: polish store template plugin files"
```

### Task 7: Verify The End-To-End Flow And Record Skill Findings

**Files:**
- Create: `docs/superpowers/reviews/2026-05-27-template-store-skill-evaluation.md`

- [ ] **Step 1: Run generation again after all plugin files exist**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store generate
```

Expected:

```text
generated
```

- [ ] **Step 2: Push schema changes into the local database**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store push
```

Expected:

```text
OK
```

- [ ] **Step 3: Populate the sample data**

Run:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store populate
```

Expected:

```text
OK
```

- [ ] **Step 4: Start the development server and confirm key routes are reachable**

Run in one terminal:

```bash
/Users/cblanquera/.nvm/versions/node/v22.14.0/bin/node /opt/homebrew/Cellar/yarn/1.22.22/libexec/bin/yarn.js --cwd templates/store dev
```

Then verify from another terminal:

```bash
curl -i http://127.0.0.1:3000/
curl -i http://127.0.0.1:3000/products
curl -i http://127.0.0.1:3000/cart
curl -i http://127.0.0.1:3000/checkout
```

Expected:

```text
HTTP/1.1 200
```

for each route.

- [ ] **Step 5: Exercise the minimal flow manually in the browser**

Use the in-app browser or a local browser and complete:

1. open `/`
2. follow the link to `/products`
3. open one product detail page
4. submit the add-to-cart form
5. confirm `/cart` shows at least one item
6. continue to `/checkout`
7. submit the form
8. confirm redirection to `/orders/confirmation/:id`

Expected:

```text
The full flow is reachable without one plugin taking over unrelated concerns.
```

- [ ] **Step 6: Write the skill evaluation artifact**

Create `docs/superpowers/reviews/2026-05-27-template-store-skill-evaluation.md`:

```md
# Template Store Skill Evaluation

## Scope

This note records what the `templates/store` sample revealed about:

- `stackpress-app-coordinator` and the StackPress skill family
- `chrisai-usage` and the ChrisAI skill family

## Findings

### StackPress Skill Family

- Correct routing:
  - Record at least one case where `stackpress-app-coordinator` kept discovery,
    schema, and plugin work in the correct order.
  - Record at least one case where a downstream StackPress skill preserved the
    `store` / `app` / feature-plugin boundary correctly.
- Weak or misleading routing:
  - Record any point where a StackPress skill pushed the sample toward the
    wrong app shape or toward the wrong lane such as runtime instead of schema.
  - Record any point where a downstream StackPress skill collapsed plugin
    ownership or ignored the decoupling goal.
- Improvements:
  - Propose concrete wording, routing, or phase-gate changes that would make
    the StackPress skill family safer for future plugin-composition samples.

### ChrisAI Skill Family

- Correct routing:
  - Record at least one case where `chrisai-usage` selected the right
    documentation, coding, or QA follow-up.
  - Record whether the chosen downstream ChrisAI skill improved clarity or
    verification materially.
- Weak or misleading routing:
  - Record any point where `chrisai-usage` chose the wrong family or where the
    downstream ChrisAI skill added noise instead of value.
  - Record any point where documentation, coding, or QA ownership was still
    ambiguous after routing.
- Improvements:
  - Propose concrete routing or specialist-skill changes that would make the
    ChrisAI family more useful for architecture-first StackPress samples.
```

Fill in each bullet with concrete observations from the actual implementation
before committing the review file.

- [ ] **Step 7: Commit the verification and experiment notes**

Run:

```bash
git add docs/superpowers/reviews/2026-05-27-template-store-skill-evaluation.md
git commit -m "docs: record template store skill evaluation"
```
