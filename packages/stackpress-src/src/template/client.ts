//root
import type { Scalar } from '../types';
//session
import I18N from '../session/Language';

export * from '@stackpress/ink/client';
export * from './helpers';

export const i18n = new I18N();
export const _ = (phrase: string, ...variables: Scalar[]) => {
  return i18n.translate(phrase, ...variables);
};