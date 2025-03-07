import type Server from '@stackpress/ingest/dist/Server';

export type AdminConfig = {
  admin: {
    root: string,
    name: string,
    logo: string,
    menu: {
      name: string,
      icon: string,
      path: string,
      match: string
    }[]
  }
};

export type ClientWithRoutesPlugin = {
  admin(server: Server): void
}