//stackpress
import type { UnknownNest } from '@stackpress/lib/types';
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model.js';

export default function AdminExportPageFactory(model: Model) {
  return async function AdminSearchPage(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //extract filters from url query
    let { q, filter, span, sort } = req.data<{
      q?: string,
      filter?: Record<string, string|number|boolean>,
      span?: Record<string, (string|number|null|undefined)[]>,
      sort?: Record<string, any>
    }>();
    //search using the filters
    const response = await ctx.resolve<UnknownNest[]>(
      `${model.dash}-search`,
      { q, filter, span, sort, take: 0 }
    );
    //if successfully searched
    if (response.code === 200 && response.results) {
      const head: [ string, string ][] = [];
      const body: unknown[][] = [];
      const relations = model.relations.map(column => column.name);
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
            row.push(data[key]);
          } else {
            const column = data[relation] as Record<string, any>;
            row.push(column?.[key]);
          }
        }
        body.push(row);
      }
      const csv = [ 
        head.map(entry => entry[1]), 
        ...body 
      ].map(row => row.join(',')).join('\n');
      res.headers.set(
        'Content-Disposition', 
        `attachment; filename=${model.dash}-${Date.now()}.csv`
      );
      res.setBody('text/csv', csv);
    }
  };
};