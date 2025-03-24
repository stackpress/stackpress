import Terminal from './Terminal';

export const input = Terminal.input.bind(Terminal);
export const output = Terminal.output.bind(Terminal);
export const error = Terminal.error.bind(Terminal);
export const warning = Terminal.warning.bind(Terminal);
export const success = Terminal.success.bind(Terminal);
export const system = Terminal.system.bind(Terminal);
export const info = Terminal.info.bind(Terminal);

export { Terminal };

/**
 * Converts terminal arguments to object
 * ie. --foo --bar=baz --zoo foo -k=value -abc value2
 */
export function args(params: string) {
  return Terminal.params(...params.split(' '));
}
