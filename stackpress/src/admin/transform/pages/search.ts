//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';

export default function generate(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // Profile/admin/pages/search.ts
  
  const filepath = model.name.toPathName('%s/admin/pages/search.ts');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type { UnknownNest } from '@stackpress/lib/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/lib/types',
    namedImports: [ 'UnknownNest' ]
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { Request, Response, Server } from 'stackpress/server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });
  //import type { LanguageConfig } from 'stackpress/language/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/language/types',
    namedImports: [ 'LanguageConfig' ]
  });
  //import type { ViewConfig, BrandConfig } from 'stackpress/view/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/types',
    namedImports: [ 'ViewConfig', 'BrandConfig' ]
  });
  //import type { AdminConfig } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfig' ]
  });

  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfileAdminSearchPage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: model.name.toClassName('%sAdminSearchPage'),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.SEARCH, { 
      event: model.name.toEventName()
    })
  });
};

export const TEMPLATE = {

SEARCH:
`//if there is a response body or there is an error code
if (res.body || (res.code && res.code !== 200)) {
  //let the response pass through
  return;
}
//get the view, brandm lang and admin config
const view = ctx.config.path<ViewConfig>('view', {});
const brand = ctx.config.path<BrandConfig>('brand', {});
const language = ctx.config.path<LanguageConfig>('language', {
  key: 'locale',
  locale: 'en_US',
  languages: {}
});
const admin = ctx.config.path<AdminConfig>('admin', {});
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
res.data.set('admin', { 
  name: admin.name || 'Admin',
  base: admin.base || '/admin',
  menu: admin.menu || []
});
//extract filters from url query
let {
  q,
  filter,
  span,
  sort,
  skip,
  take,
  columns,
} = req.data<{
  q?: string;
  filter?: Record<string, string | number | boolean>;
  span?: Record<string, (string | number | null | undefined)[]>;
  sort?: Record<string, any>;
  skip?: number;
  take?: number;
  columns?: string[];
}>();

if (skip && !isNaN(Number(skip))) {
  skip = Number(skip);
}

if (take && !isNaN(Number(take))) {
  take = Number(take);
}
//search using the filters
const response = await ctx.resolve(
  '<%event%>-search',
  { q, filter, span, sort, skip, take, columns },
  res
);
//if OK
if (res.code === 200) {
  //remember the total
  const total = response.total;
  const rows = response.results as UnknownNest[];
  res.setRows(rows, total || rows.length);
  return;
}`,

};