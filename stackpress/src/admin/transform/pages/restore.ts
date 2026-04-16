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
  // Profile/admin/pages/restore.ts
  
  const filepath = model.name.toPathName('%s/admin/pages/restore.ts');
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
  //import type { CsrfPlugin } from 'stackpress/csrf/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/csrf/types',
    namedImports: [ 'CsrfPlugin' ]
  });

  //------------------------------------------------------------------//
  // Import Client
  //------------------------------------------------------------------//
  // Exports

  //export default async function ProfileAdminRestorePage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: model.name.toClassName('%sAdminRestorePage'),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.RESTORE, { 
      event: model.name.toEventName(),
      model: model.name.toURLPath(),
      ids: model.store.ids.map(
        column => `\${req.data.get('${column.name.toString()}')}`
      ).toArray().join('/'),
      active: model.store.active 
        ? { column: model.store.active.name.toString() }
        : null
    })
  });
};

export const TEMPLATE = {

RESTORE:
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

//get csrf plugin
const csrf = ctx.plugin<CsrfPlugin>('csrf');
//generate token
csrf.generateToken(res, ctx);

//if confirmed
if (req.data('confirmed')) {
  //validate csrf
  if (!csrf.validateToken(req, res)) {
    res.session.set('flash', JSON.stringify({
      type: 'error',
      message: 'This page may have been requested from an external source. ' +
        'We corrected the issue. Please try again.',
      close: 2000
    }));
    const base = admin.base ?? '/admin';
    const id = req.data('id');
    res.redirect(\`\${base}/<%model%>/restore/\${id}\`);
    return;
  };
  //emit restore event
  await ctx.emit('<%event%>-restore', req, res);
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
//not confirmed, fetch the data using the id
await ctx.emit('<%event%>-detail', req, res);`,

};