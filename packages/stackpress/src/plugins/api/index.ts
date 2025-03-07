import oauth from './pages/oauth';
import token from './pages/token';
import { authorize, unauthorized } from './helpers';
import plugin from './plugin';

const pages = { oauth, token };

export type * from './types';
export {
  pages,
  authorize,
  unauthorized,
  plugin
};