//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Model from '../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../schema/transform/helpers.js';
//stackpress/admin
import generateCreate from './detail/create.js';
import generateExport from './detail/export.js';
import generateImport from './detail/import.js';
import generateSearch from './detail/search.js';

export default function generate(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // Profile/admin/pages/Auth/create.ts
  // Profile/admin/pages/Auth/export.ts
  // Profile/admin/pages/Auth/import.ts
  // Profile/admin/pages/Auth/search.ts

  const related = model.columns.filter(
    column => Boolean(
      column.type.model 
        && column.store.localRelationship
        && column.store.localRelationship.foreign.type === 2
    )
  );

  for (const column of related.toArray()) {
    generateCreate(directory, model, column.store.localRelationship!);
    generateExport(directory, model, column.store.localRelationship!);
    generateImport(directory, model, column.store.localRelationship!);
    generateSearch(directory, model, column.store.localRelationship!);
  }

  //------------------------------------------------------------------//
  // Profile/admin/pages/detail.ts

  const filepath = model.name.toPathName('%s/admin/pages/detail.ts');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules
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

  //import type { ProfileExtended } from '../../types.js';
  if (model.value.hashed.size > 0) {
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `../../types.js`,
      namedImports: [ model.name.toClassName('%sExtended') ]
    });
  }

  //------------------------------------------------------------------//
  // Exports
  
  //export default async function ProfileAdminDetailPage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: model.name.toClassName('%sAdminDetailPage'),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.DETAIL, { 
      active: model.store.active 
        ? { column: model.store.active.name.toString() }
        : null,
      event: model.name.toEventName(),
      extended: model.name.toClassName('%sExtended'),
      hashes: model.value.hashed.map(
        column => ({ column: column.name.toString() })
      ).toArray() || []
    })
  });
};

export const TEMPLATE = {

DETAIL:
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
<%#active%>
  //make sure to set the active column to -1 in order 
  // to get it returned even if it's soft-deleted
  req.data.set('eq', '<%column%>', -1);
<%/active%>
<%#hashes.length%>
  const response = await ctx.resolve<Partial<<%extended%>>>(
    '<%event%>-detail', 
    req
  );
  <%#hashes%>
    if (typeof response.results?.<%column%> !== 'undefined') {
      delete response.results.<%column%>;
    }
  <%/hashes%>
  res.fromStatusResponse(response);
<%/hashes.length%>
<%^hashes.length%>
  await ctx.emit('<%event%>-detail', req, res);
<%/hashes.length%>`,

};