//stackpress-server
import type Terminal from './Terminal';

//ie. ctx.config<TerminalConfig>('terminal');
export type TerminalConfig = {
  //label for verbose output ($ [LABEL] doing something...)
  label?: string,
  //filepath of your main idea (schema.idea)
  idea?: string
};

//ie. ctx.plugin<TerminalPlugin>('terminal');
export type TerminalPlugin = Terminal;

//ie. ctx.config<ServerConfig>('server');
export type ServerConfig = {
  //general location to put build files
  //not used by stackpress
  build?: string,
  //general use current working directory
  //used by `stackpress/scripts/build`
  //used by `stackpress/view`
  //defaults to `process.cwd()`
  cwd?: string,
  //production, development
  //used by `stackpress/view`
  //defaults to `production`
  mode?: string,
  //server port
  //not used by stackpress
  port?: number
};