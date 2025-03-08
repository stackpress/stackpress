//root
import type { Scalar } from '../types';
//local
import I18N from './I18N';

export { I18N };

export const i18n = new I18N();
export const _ = (phrase: string, ...variables: Scalar[]) => {
  return i18n.translate(phrase, ...variables);
};