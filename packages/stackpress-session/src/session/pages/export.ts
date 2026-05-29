//modules
import { action } from '@stackpress/ingest/Server'
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/profile
import type { ProfileExtended } from '../../profile/types.js';
//stackpress-session/session
import type { SessionPlugin } from '../types.js';

/**
 * Main page handler
 */
export default action(async function AccountExport({ req, res, ctx }) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const data = await me.data();
  //if no data or is a guest
  if (!data || await me.guest()) {
    //unauthorize user
    res.statusCode(401, 'Unauthorized');
    return;
  }
  //get profile
  const response = await ctx.resolve<ProfileExtended>(
    'profile-detail', 
    { id: data.id }
  );
  //if response has error or no results
  if (response.code !== 200 || !response.results) {
     //if response code is 404
     if (response.code === 404) {
       //unauthorize user
       res.statusCode(401, 'Unauthorized');
       return;
     }
     //else, sync profile error response to response
     res.fromStatusResponse(response);
     return;
   }
  //when the export route is opened directly, render the warning page first so
  // the download only starts after the user clicks the download action.
  if (!req.data('download')) {
    setViewProps(req, res, ctx);
    return;
  }
  const entries = Object.entries(response.results!).map(([key, value]) => {
    if (typeof value === 'undefined' || value === null) {
      value = '';
    } else if (Array.isArray(value) || typeof value === 'object') {
      value = JSON.stringify(value)
        //remove quotes, boxes and curlies
        .replace(/["\{\}\[\]]/g, '')
        //add spaces after commas
        .replaceAll(',', ', ')
        .replaceAll(',  ', ', ')
        //add spaces after colons
        .replaceAll(':', ': ')
        .replaceAll(':  ', ': ');
    }
    //CSV injection protection for spreadsheet apps
    //Prefix formula-like values so spreadsheet apps treat them as plain 
    // text, e.g. "=SUM(A1:A2)".
    let cell = String(value);
    if (/^[=+\-@]/.test(cell)) {
      cell = `'${cell}`;
    }
    return [ key, JSON.stringify(cell) ];
  });
  const csv = entries.map(row => row.join(',')).join('\n');
  res.headers.set(
    'Content-Disposition',
    `attachment; filename=account-${Date.now()}.csv`
  );
  res.set('text/csv', csv);
});
