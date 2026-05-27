//node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

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

test('product plugin owns product routes', () => {
  const productPlugin = fs.readFileSync(
    path.join(cwd, 'plugins/product/plugin.ts'),
    'utf8'
  );

  assert.match(productPlugin, /server\.import\.get\('\/products'/);
  assert.match(productPlugin, /server\.view\.get\('\/products'/);
  assert.match(productPlugin, /server\.import\.get\('\/products\/:slug'/);
});

test('cart plugin owns cart routes', () => {
  const cartPlugin = fs.readFileSync(
    path.join(cwd, 'plugins/cart/plugin.ts'),
    'utf8'
  );

  assert.match(cartPlugin, /server\.import\.get\('\/cart'/);
  assert.match(cartPlugin, /server\.view\.get\('\/cart'/);
  assert.match(cartPlugin, /server\.import\.post\('\/cart\/items'/);
});

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

  assert.match(orderPlugin, /\/orders\/confirmation\/:id/);
  assert.match(orderPlugin, /server\.import\.get\('\/account\/orders'/);
});
