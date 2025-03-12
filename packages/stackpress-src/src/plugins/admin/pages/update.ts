//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//root
import type { AdminConfig } from '../../../types';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminRemovePageFactory(model: Model) {
  return async function AdminRemovePage(req: ServerRequest, res: Response) {
    //extract project and model from client
    const server = req.context;
    //get the admin config
    const admin = server.config<AdminConfig>('admin') || {};
    //set data for template layer
    res.data.set('admin', { 
      root: admin.root || '/admin',
      name: admin.name || 'Admin', 
      logo: admin.logo || '/images/logo-square.png',
      menu: admin.menu || []
    });
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get id from url params
    const ids = model.ids.map(column => req.data(column.name)).filter(Boolean);
    if (ids.length === model.ids.length) {
      //if form submitted
      if (req.method === 'POST') {
        //fix the data
        const data = req.data();
        //loop through the data
        for (const key in data) {
          //get the column meta
          const column = model.column(key);
          //if it's not a column, leave as is
          if (!column) continue;
          //determine if the column needs to be filled out
          //(submitted fields will be empty strings)
          const notempty = column.required || !!column.assertions.find(
            assertion => assertion.method === 'notempty'
          );
          //determine if the field is actually empty
          const isempty = data[key] === '' || data[key] === null;
          //if the field needs to be filled out and is actually empty
          if (notempty && isempty) {
            //delete the key
            delete data[key];
          }
        }
        //emit update with the fixed fields
        await server.call(`${model.dash}-update`, data, res);
        //if they want json (success or fail)
        if (req.data.has('json')) return;
        //if successfully updated
        if (res.code === 200) {
          //redirect
          const root = admin.root || '/admin';
          res.redirect(`${root}/${model.dash}/detail/${ids.join('/')}`);
        }
        return;
      }
      //not submitted, fetch the data using the id
      await server.call(`${model.dash}-detail`, req, res);
    }
  };
};