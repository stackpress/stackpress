//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { AdminConfig } from '../../../types';
//schema
import type Model from '../../../schema/spec/Model';

export default function AdminRemovePageFactory(model: Model) {
  return async function AdminRemovePage(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //get the admin config
    const admin = ctx.config<AdminConfig>('admin') || {};
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
      //if confirmed
      if (req.data('confirmed')) {
        //emit remove event
        await ctx.emit(`${model.dash}-remove`, req, res);
        //if error
        if (res.code !== 200) {
          //pass straight to error
          await ctx.emit('error', req, res);
          return;
        }
        //redirect
        const root = admin.root || '/admin';
        res.redirect(`${root}/${model.dash}/search`);
        return;
      }
      //not confirmed, fetch the data using the id
      await ctx.emit(`${model.dash}-detail`, req, res);
      //if error
      if (res.code !== 200) {
        //pass straight to error
        await ctx.emit('error', req, res);
        return;
      }
    } else {
      //id mismatch
      res.setStatus(404);
      //pass straight to error
      await ctx.emit('error', req, res);
    }
  };
};