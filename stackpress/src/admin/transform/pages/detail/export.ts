//modules
import type { Directory } from 'ts-morph';
//stackpress/schema
import type Column from '../../../../schema/Column.js';
import type Fieldset from '../../../../schema/Fieldset.js';
import type Model from '../../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../../schema/transform/helpers.js';

export type Relationship = {
  foreign: {
      model: Model,
      column: Column,
      key: Column,
      type: number
  },
  local: {
      model: Fieldset,
      column: Column,
      key: Column,
      type: number
  };
};

export default function generate(
  directory: Directory, 
  model: Model, 
  relationship: Relationship
) {
  const foreign = relationship.local.model as Model;
  const relations = model.store.foreignRelationships.toArray();

  const filepath = renderCode(
    '<%model%>/admin/pages/<%relation%>/export.ts', 
    {
      model: model.name.toPathName(),
      relation: foreign.name.toPathName()
    }
  );
  //load Profile/admin/pages/Auth/export.ts if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //import type { UnknownNest } from '@stackpress/lib/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@stackpress/lib/types',
    namedImports: [ 'UnknownNest' ]
  });
  //import type { Request, Response, Server } from 'stackpress/server';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/server',
    namedImports: [ 'Request', 'Response', 'Server' ]
  });
  //import type { ProfileExtended } from '../../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });

  //export default async function ProfileAdminExportPage(req: Request, res: Response, ctx: Server) {}
  source.addFunction({
    isDefaultExport: true,
    isAsync: true,
    name: renderCode('<%model%>Admin<%relation%>ExportPage', {
      model: model.name.toComponentName(),
      relation: foreign.name.toComponentName(),
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
        extended: model.name.toClassName('%sExtended'),
        model: model.name.toEventName(),
        detail: model.name.toEventName('%s-detail'),
        search: foreign.name.toEventName('%s-search'),
        hasRelations: relations.length > 0,
        relations: JSON.stringify(relations.map(
          column => column.name.toString()
        )),
        id: {
          foreign: relationship.foreign.key.name.toString(),
          local: relationship.local.key.name.toString()
        },
        relation: foreign.name.toPropertyName(),
        hash: model.value.hashed.size > 0,
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
<%#hash%>
  //remove hashed data
  <%#hashes%>
    if (typeof detail.results?.<%column%> !== 'undefined') {
      delete detail.results.<%column%>;
    }
  <%/hashes%>
<%/hash%>

//extract filters from url query
let { q, filter = {}, span, sort } = req.data<{
  q?: string,
  filter?: Record<string, string|number|boolean>,
  span?: Record<string, (string|number|null|undefined)[]>,
  sort?: Record<string, any>
}>();
//add relation id/s to filters
filter.<%id.local%> = req.data<string>('<%id.foreign%>');
//search using the filters
const response = await ctx.resolve<UnknownNest[]>(
  '<%search%>',
  { q, filter, span, sort, take: 0 }
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
<%#hash%>
  //remove hashed data
  <%#hashes%>
    if (typeof detail.results?.<%column%> !== 'undefined') {
      delete detail.results.<%column%>;
    }
  <%/hashes%>
<%/hash%>

//extract filters from url query
let { q, filter = {}, span, sort } = req.data<{
  q?: string,
  filter?: Record<string, string|number|boolean>,
  span?: Record<string, (string|number|null|undefined)[]>,
  sort?: Record<string, any>
}>();
//add relation id/s to filters
filter.<%id.local%> = req.data<string>('<%id.foreign%>');
//search using the filters
const response = await ctx.resolve<UnknownNest[]>(
  '<%event%>-search',
  { q, filter, span, sort, take: 0 }
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