//ie. ctx.config<ServerConfig>('server');
export type ServerConfig = {
  cwd: string,
  mode: string,
  port: number,
  build: string
};