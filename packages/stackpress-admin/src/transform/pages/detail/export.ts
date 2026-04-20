//modules
import type { Directory } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { 
  loadProjectFile, 
  renderCode 
} from 'stackpress-schema/transform/helpers';
//stackpress-admin
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
  const relations = model.store.foreignRelationships.toArray();

  //------------------------------------------------------------------//
  // Profile/admin/pages/Auth/export.ts

  const filepath = renderCode(
    '<%model%>/admin/pages/<%relation%>/export.ts', 
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
  //import type { Request, Response, Server } from '@stackpress/ingest';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/ingest',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });

  //------------------------------------------------------------------//
  // Import Stackpress
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

  //export default async function ProfileAdminExportPage(req, res, ctx) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: renderCode('<%model%>Admin<%relation%>ExportPage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName(),
    }),
    parameters: [
      { name: 'req', type: 'Request' },
      { name: 'res', type: 'Response' },
      { name: 'ctx', type: 'Server' }
    ],
    statements: renderCode(relations.length > 0 
      ? TEMPLATE.EXPORT_RELATIONS 
      : TEMPLATE.EXPORT, 
      { 
        model: model.name.toEventName(),
        relation: foreignModel.name.toPropertyName(),
        extended: model.name.toClassName('%sExtended'),
        detail: model.name.toEventName('%s-detail'),
        search: foreignModel.name.toEventName('%s-search'),
        relations: JSON.stringify(relations.map(
          column => column.name.toString()
        )),
        id: {
          foreign: relationship.foreign.key.name.toString(),
          local: relationship.local.key.name.toString()
        },
        hashes: model.value.hashed?.map(
          column => ({ column: column.name.toString() })
        ).toArray() || []
      }
    )
  });
};

export const TEMPLATE = {

EXPORT:
`//if there is a response body or there is an error code
if (res.body || (res.code && res.code !== 200)) {
  //let the response pass through
  return;
}

//first get the detail
const detail = await ctx.resolve<<%extended%>>('<%detail%>', req);
//if there's an error, let it pass
if (detail.code !== 200) {
  res.fromStatusResponse(detail);
  return;
}
<%#?:hashes.length%>
  //remove hashed data
  <%#@:hashes%>
    if (typeof detail.results?.<%column%> !== 'undefined') {
      delete detail.results.<%column%>;
    }
  <%/@:hashes%>
<%/?:hashes.length%>

//get query
const query = req.data<{ 
  eq?: Record<string, string|number|boolean> 
}>();
//extract filters from url query
const { eq = {} } = query;
//add relation id/s to filters
eq.<%id.local%> = req.data<string>('<%id.foreign%>');
//search using the filters
const response = await ctx.resolve<UnknownNest[]>(
  '<%search%>',
  { ...query, eq, take: 0 }
);
//if successfully searched
if (response.code === 200 && response.results) {
  const head: string[] = [];
  const body: unknown[][] = [];
  //loop through the data (row) of each result
  for (const data of response.results) {
    //loop through the columns of the data (row)
    for (const key in data) {
      //if the key is not in the head and not ignore
      if (!head.includes(key)) {
        //add the key to the head
        head.push(key);
      }
    }
    const row: any[] = [];
    for (const key of head) {
      let value = data[key];
      if (typeof value === 'undefined' || value === null) {
        value = '';
      } else if (Array.isArray(value) || typeof value === 'object') {
        value = JSON.stringify(value)
          //remove quotes, boxes and curlies
          .replace(/["\\{\\}\\[\\]]/g, '')
          //add spaces after commas
          .replaceAll(',', ', ')
          .replaceAll(',  ', ', ')
          //add spaces after colons
          .replaceAll(':', ': ')
          .replaceAll(':  ', ': ');
      }
      row.push(JSON.stringify(value));
    }
    body.push(row);
  }
  const csv = [ head, ...body ].map(row => row.join(',')).join('\\n');
  res.headers.set(
    'Content-Disposition', 
    \`attachment; filename=<%model%>-\${Date.now()}.csv\`
  );
  res.setBody('text/csv', csv);
}`,

EXPORT_RELATIONS:
`//if there is a response body or there is an error code
if (res.body || (res.code && res.code !== 200)) {
  //let the response pass through
  return;
}

//first get the detail
const detail = await ctx.resolve<<%extended%>>('<%detail%>', req);
//if there's an error, let it pass
if (detail.code !== 200) {
  res.fromStatusResponse(detail);
  return;
}
<%#?:hashes.length%>
  //remove hashed data
  <%#@:hashes%>
    if (typeof detail.results?.<%column%> !== 'undefined') {
      delete detail.results.<%column%>;
    }
  <%/@:hashes%>
<%/?:hashes.length%>

//get query
const query = req.data<{ 
  eq?: Record<string, string|number|boolean> 
}>();
//extract filters from url query
const { eq = {} } = query;
//add relation id/s to filters
eq.<%id.local%> = req.data<string>('<%id.foreign%>');
//search using the filters
const response = await ctx.resolve<UnknownNest[]>(
  '<%search%>',
  { ...query, eq, take: 0 }
);
//if successfully searched
if (response.code === 200 && response.results) {
  const head: [ string, string ][] = [];
  const body: unknown[][] = [];
  const relations = <%relations%>;
  //loop through the data (row) of each result
  for (const data of response.results) {
    //loop through the columns of the data (row)
    for (const key in data) {
      const includes = head.find(
        head => head[0] === '' && head[1] === key
      );
      //if the key is not in the head and not ignore
      if (!includes && !relations.includes(key)) {
        //add the key to the head
        head.push(['', key]);
      }
    }
    //loop through the ignore list
    for (const relation of relations) {
      //if there are no relations, skip
      if (!data[relation]) continue;
      //loop through the keys of the relation in the data
      for (const key in data[relation]) {
        const includes = head.find(
          head => head[0] === relation && head[1] === key
        );
        //if the key is not in the head
        if (!includes) {
          //add the key to the head
          head.push([ relation, key ]);
        }
      }
    }
    const row: any[] = [];
    for (const [ relation, key ] of head) {
      if (relation === '') {
        let value = data[key];
        if (typeof value === 'undefined' || value === null) {
          value = '';
        }
        row.push(JSON.stringify(value));
      } else {
        const column = data[relation] as Record<string, any>;
        let value = column?.[key];
        if (typeof value === 'undefined' || value === null) {
          value = '';
        }
        row.push(JSON.stringify(value));
      }
    }
    body.push(row);
    
  }
  const csv = [ 
    head.map(entry => entry[1]), 
    ...body 
  ].map(row => row.join(',')).join('\\n');
  res.headers.set(
    'Content-Disposition', 
    \`attachment; filename=<%model%>-\${Date.now()}.csv\`
  );
  res.setBody('text/csv', csv);
}`,

};