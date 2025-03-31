import { LanguageConfig } from '../language/types';
import { ViewConfig, BrandConfig } from '../view/types';

export type AdminConfigProps = {
  language: LanguageConfig,
  view: ViewConfig,
  brand: BrandConfig,
  admin: AdminConfig
};

//ie. ctx.config<AdminConfig>('admin');
export type AdminConfig = {
  name?: string,
  base?: string,
  menu?: {
    name: string,
    icon: string,
    path: string,
    match: string
  }[]
};