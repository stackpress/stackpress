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
  // Profile/admin/pages/update.ts

  const filepath = model.name.toPathName('%s/admin/pages/update.ts');
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

  //export default async function ProfileAdminUpdatePage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: model.name.toClassName('%sAdminUpdatePage'),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.UPDATE, { 
      event: model.name.toEventName(),
      model: model.name.toURLPath(),
      extended: model.name.toClassName('%sExtended'),
      ids: model.store.ids.map(
        column => `\${req.data.get('${column.name.toString()}')}`
      ).toArray().join('/'),
      hashes: model.value.hashed?.map(
        column => ({ column: column.name.toString() })
      ).toArray() || []
    })
  });
};

export const TEMPLATE = {

UPDATE:
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

//if form submitted
if (req.method === 'POST' || req.method === 'PUT') {
  //emit update with the fixed fields
  await ctx.emit('<%event%>-update', req, res);
  //if OK
  if (res.code === 200) {
    //get the noview flag name
    const noview = ctx.config.path('view.noview', 'json');
    //if no, noview, then okay to redirect
    if (!req.data.has(noview)) {
      //redirect
      const base = admin.base ?? '/admin';
      res.redirect(\`\${base}/<%model%>/detail/<%ids%>\`);
    }
  }
  //let the error pass through
  return;
}
//not submitted, fetch the data using the id
<%#hashes.length%>
  const response = await ctx.resolve<<%extended%>>('<%event%>-detail', req);
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