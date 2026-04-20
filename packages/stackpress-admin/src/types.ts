//stackpress-language
import type { LanguageConfig } from 'stackpress-language/types';
//stackpress-view
import type { ViewConfig } from 'stackpress-view/types';

//ie. ctx.config<BrandConfig>('brand')
export type BrandConfig = {
  name?: string,
  logo?: string,
  icon?: string,
  favicon?: string
};

//used by generated views
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