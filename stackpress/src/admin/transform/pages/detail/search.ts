//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../../schema/transform/helpers.js';
//stackpress/admin
import type { Relationship } from '../../types.js';

export default function generate(
  directory: Directory, 
  model: Model, 
  relationship: Relationship
) {
  //NOTE: in related, the local model is the foreign 
  // model, and the foreign model is this model
  const foreignModel = relationship.local.model as Model;
  //relation used for filepaths and function names
  const relatedColumn = relationship.foreign.column;

  //------------------------------------------------------------------//
  // Profile/admin/pages/Auth/search.ts

  const filepath = renderCode(
    '<%model%>/admin/pages/<%relation%>/search.ts', 
    {
      model: model.name.toPathName(),
      relation: relatedColumn.name.toString()
    }
  );
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

  //import type { ProfileExtended } from '../../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `../../../types.js`,
    namedImports: [ model.name.toClassName('%sExtended') ]
  });


  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfileAdminAuthSearchPage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: renderCode('<%model%>Admin<%relation%>SearchPage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName(),
    }),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.SEARCH, { 
      relation: relatedColumn.name.toString(),
      extended: model.name.toClassName('%sExtended'),
      detail: model.name.toEventName('%s-detail'),
      search: foreignModel.name.toEventName('%s-search'),
      id: {
        foreign: relationship.foreign.key.name.toString(),
        local: relationship.local.key.name.toString()
      },
      hashes: model.value.hashed?.map(
        column => ({ column: column.name.toString() })
      ).toArray() || []
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
  name: admin.name ?? 'Admin',
  base: admin.base ?? '/admin',
  menu: admin.menu || []
});

//first get the detail
const id = req.data<string>('<%id.foreign%>');
const detail = await ctx.resolve<Partial<<%extended%>>>('<%detail%>', { id });
//if there's an error, let it pass
if (detail.code !== 200) {
  res.fromStatusResponse(detail);
  return;
}
<%#hashes.length%>
  //remove hashed data
  <%#hashes%>
    if (typeof detail.results?.<%column%> !== 'undefined') {
      delete detail.results.<%column%>;
    }
  <%/hashes%>
<%/hashes.length%>

//next get the relation rows

//extract filters from url query
const query = req.data<{
  eq?: Record<string, string | number | boolean>,
  skip?: number,
  take?: number
}>();
let { eq = {}, skip, take } = query;

if (skip && !isNaN(Number(skip))) {
  skip = Number(skip);
}

if (take && !isNaN(Number(take))) {
  take = Number(take);
}

//add relation id/s to filters
eq.<%id.local%> = id;

//search using the filters
const search = await ctx.resolve(
  '<%search%>',
  { ...query, eq, skip, take }
);

//if there's an error, let it pass
if (search.code !== 200) {
  res.fromStatusResponse(search);
  return;
}

//remember the total
const total = search.total;
const rows = search.results as UnknownNest[];

res.fromStatusResponse({
  code: 200,
  status: 'OK',
  total: total || rows.length,
  results: {
    ...detail.results,
    <%relation%>: rows
  }
});`,

};