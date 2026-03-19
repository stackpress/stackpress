import fs from 'node:fs/promises';

import { paths } from './helpers.js';

export async function mochaGlobalTeardown() {
  await fs.rm(paths.out, { recursive: true, force: true });
};

mochaGlobalTeardown().catch(async error => {
  console.error('Error during global teardown:', error);
  process.exit(1);
});
