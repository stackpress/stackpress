import { LanguageConfig } from '../language/types.js';
import { ViewConfig, BrandConfig } from '../view/types.js';

export type AdminConfigProps = {
  language: LanguageConfig,
  view: ViewConfig,
  brand: BrandConfig,
  admin: AdminConfig
};

//ie. ctx.config<AdminConfig>('admin');
export type AdminConfig = {
  //name of the admin section. shown on the top left of the page
  name?: string,
  //base route for the admin section
  base?: string,
  //static admin menu items
  menu?: {
    name: string,
    icon?: string,
    path: string,
    match: string
  }[]
};