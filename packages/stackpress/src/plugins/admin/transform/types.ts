export type AdminConfig = {
  admin: {
    root: string,
    menu: {
      name: string,
      icon: string,
      path: string,
      match: string
    }[]
  }
};