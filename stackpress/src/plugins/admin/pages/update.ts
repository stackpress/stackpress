//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//root
import type { AdminConfig } from '../../../types';
//session
import { hash, encrypt } from '../../../session/helpers';
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
      //if form submitted
      if (req.method === 'POST') {
        //get the session seed (for encrypting)
        const seed = ctx.config.path('session.seed', 'abc123');
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
          const notEmpty = column.required || !!column.assertions.find(
            assertion => assertion.method === 'notempty'
          );
          //determine if the field is actually empty
          const isEmpty = data[key] === '' || data[key] === null;
          //if the field needs to be filled out and is actually empty
          if (notEmpty && isEmpty) {
            //delete the key
            delete data[key];
            continue;
          }
          //determine if the field is encryptable
          const canEncrypt = data[key] !== null && typeof data[key] !== 'undefined';
          //if column is encryptable
          if (canEncrypt) {
            const string = String(data[key]);
            if (string.length > 0) {
              if (column.encrypted) {
                //encrypt the key
                data[key] = encrypt(string, seed);
              } else if (column.hash) {
                //hash the key
                data[key] = hash(string);
              }
            }
          }
        }
        //emit update with the fixed fields
        await ctx.resolve(`${model.dash}-update`, data, res);
        //if error
        if (res.code !== 200) {
          //pass straight to error
          await ctx.emit('error', req, res);
          return;
        }
        //redirect
        const root = admin.root || '/admin';
        res.redirect(`${root}/${model.dash}/detail/${ids.join('/')}`);
        return;
      }
      //not submitted, fetch the data using the id
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