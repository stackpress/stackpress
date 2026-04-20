//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';

export default function generate(directory: Directory, model: Model) {
  //------------------------------------------------------------------//
  // Profile/admin/pages/create.ts

  const filepath = model.name.toPathName('%s/admin/pages/create.ts');
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import { isObject } from '@stackpress/lib/Nest';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/lib/Nest',
    namedImports: [ 'isObject' ]
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { Request, Response, Server } from 'stackpress-server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });
  //import type { LanguageConfig } from 'stackpress-language/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-language/types',
    namedImports: [ 'LanguageConfig' ]
  });
  //import type { ViewConfig, BrandConfig } from 'stackpress-view/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-view/types',
    namedImports: [ 'ViewConfig', 'BrandConfig' ]
  });
  //import type { AdminConfig } from 'stackpress-admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-admin/types',
    namedImports: [ 'AdminConfig' ]
  });
  //import type { CsrfPlugin } from 'stackpress-csrf/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress-csrf/types',
    namedImports: [ 'CsrfPlugin' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { Profile } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `../../types.js`,
    namedImports: [ model.name.toClassName() ]
  });

  //------------------------------------------------------------------//
  // Exports
  
  //export default async function ProfileAdminCreatePage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: model.name.toClassName('%sAdminCreatePage'),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.CREATE, { 
      type: model.name.toTypeName(),
      event: model.name.toEventName(),
      model: model.name.toURLPath(),
      oneid: model.store.ids.size === 1,
      ids: model.store.ids.map(
        column => `\${results.${column.name.toString()}}`
      ).toArray().join('/')
    })
  });
};

export const TEMPLATE = {

CREATE:
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

//get the csrf plugin
const csrf = ctx.plugin<CsrfPlugin>('csrf');
//generate token
csrf.generateToken(res, ctx);

//if form submitted
if (req.method === 'POST') {
  //validate csrf
  if (!csrf.validateToken(req, res)) return;
  //emit the create event
  const response = await ctx.resolve<<%type%>>('<%event%>-create', req, res);
  //if error
  if (res.code !== 200) {
    return;
  } else if (!isObject(response.results)) {
    res.setError('Unknown creation response results');
    return;
  }
  //get the noview flag name
  const noview = ctx.config.path('view.noview', 'json');
  //if no, noview, then okay to redirect
  if (!req.data.has(noview)) {
    const results = response.results!
    //redirect
    const base = admin.base ?? '/admin';
    <%#?:oneid%>
      res.redirect(
        \`\${base}/<%model%>/detail/<%ids%>\`
      );
    <%|%>
      res.redirect(
        \`\${base}/<%model%>/search\`
      );
    <%/?:oneid%>
  }
}`,

};