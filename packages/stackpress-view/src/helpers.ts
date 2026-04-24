//modules
import type { Server, Request, Response } from '@stackpress/ingest';
//stackpress-language
import type { LanguageConfig } from 'stackpress-language/types';
//stackpress-view
import type { ViewConfig, BrandConfig } from './types.js';

export function setViewProps(req: Request, res: Response, ctx: Server) {
  //if no view, skip
  if (req.data.has(ctx.config.path('view.noview', 'json'))) return;
  //get the view, brandm lang and admin config
  const view = ctx.config.path<ViewConfig>('view', {});
  const brand = ctx.config.path<BrandConfig>('brand', {});
  const language = ctx.config.path<LanguageConfig>('language', {
    key: 'locale',
    locale: 'en_US',
    languages: {}
  });
  //set data for template layer
  res.data.set('view', {
    base: view.base || '/',
    props: view.props || {}
  });
  res.data.set('brand', {
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',
    favicon: brand.favicon || '/favicon.ico'
  });
  res.data.set('language', {
    key: language.key || 'locale',
    locale: language.locale || 'en_US',
    languages: language.languages || {}
  });
};