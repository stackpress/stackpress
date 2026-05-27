//node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const cwd = process.cwd();
const generatedTypes = path.join(cwd, 'node_modules/store-client/types.d.ts');

test('generated client types include the sample store models', () => {
  const source = fs.readFileSync(generatedTypes, 'utf8');
  assert.match(source, /export type \{ Product,/);
  assert.match(source, /export type \{ Cart,/);
  assert.match(source, /export type \{ Order,/);
});
