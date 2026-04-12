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
  // Profile/admin/pages/Auth/create.ts

  const filepath = renderCode(
    '<%model%>/admin/pages/<%relation%>/create.ts', 
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
  //import { isObject } from '@stackpress/lib/Nest';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/lib/Nest',
    namedImports: [ 'isObject' ]
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
    moduleSpecifier: '../../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });

  //------------------------------------------------------------------//
  // Exports
  
  //export default async function ProfileAdminAuthCreatePage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: renderCode('<%model%>Admin<%relation%>CreatePage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(TEMPLATE.CREATE, { 
      model: model.name.toURLPath(),
      relation: relatedColumn.name.toURLPath(),
      detail: model.name.toEventName('%s-detail'),
      create: foreignModel.name.toEventName('%s-create'),
      extended: model.name.toTypeName('%sExtended'),
      ids: model.store.ids.map(
        column => `\${detail.results!.${column.name.toString()}}`
      ).toArray().join('/'),
      id: {
        foreign: relationship.foreign.key.name.toString(),
        local: relationship.local.key.name.toString()
      },
      remove: model.store.ids.map(column => ({
        column: column.name.toString(),
        label: column.name.label
      })).toArray(),
      hashes: model.value.hashed?.map(
        column => ({ column: column.name.toString() })
      ).toArray() || []
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
//get csrf plugin
const csrf = ctx.plugin<CsrfPlugin>('csrf');
//generate token
csrf.generateToken(res);
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
const detail = await ctx.resolve<Partial<<%extended%>>>('<%detail%>', req);
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

//if form submitted
if (req.method === 'POST') {
  //validate csrf
  csrf.validateToken(req);
  //get the form input
  const input = req.data();
  //set the foreign id
  input.<%id.local%> = detail.results?.<%id.foreign%>;
  <%#remove%>
    delete input.<%column%>;
  <%/remove%>
  //emit the create event
  const response = await ctx.resolve<UnknownNest>('<%create%>', input);
  //if error
  if (response.code !== 200) {
    res.fromStatusResponse(response);
    //whether error or not, set the results
    if (detail.results) {
      res.setResults(detail.results);
    }
    return;
  } else if (!isObject(response.results)) {
    res.setError('Unknown creation response results');
    //whether error or not, set the results
    if (detail.results) {
      res.setResults(detail.results);
    }
    return;
  }
  //get the noview flag name
  const noview = ctx.config.path('view.noview', 'json');
  //if no, noview, then okay to redirect
  if (!req.data.has(noview)) {
    //redirect
    const base = admin.base ?? '/admin';
    res.redirect(
      \`\${base}/<%model%>/detail/<%ids%>/<%relation%>/search\`
    );
  }
  return;
}
  
res.fromStatusResponse(detail);`,

};