//terminal
import type Terminal from './Terminal';

//ie. ctx.config<CLIConfig>('cli');
export type CLIConfig = {
  //label for verbose output ($ [LABEL] doing something...)
  label?: string,
  //filepath of your main idea (schema.idea)
  idea?: string
};

//ie. ctx.plugin<ClientPlugin>('client');
export type CLIPlugin = Terminal;