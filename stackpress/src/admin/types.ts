//ie. ctx.config<AdminConfig>('admin');
export type AdminConfig = {
  root: string,
  name: string,
  logo: string,
  menu: {
    name: string,
    icon: string,
    path: string,
    match: string
  }[]
};