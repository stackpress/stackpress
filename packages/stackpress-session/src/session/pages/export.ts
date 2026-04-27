//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//stackpress-session/profile
import type { ProfileExtended } from '../../profile/types.js';
//stackpress-session/session
import type { SessionPlugin } from '../types.js';

/**
 * Main page handler
 */
export default async function AccountExport(
  req: Request,
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const data = await me.data();
  if (!data || await me.guest()) {
    res.setStatus(401, 'Unauthorized');
    return;
  }
  const response = await ctx.resolve<ProfileExtended>(
    'profile-detail', 
    { id: data.id }
  );
  if (response.code === 404) {
    res.setStatus(401, 'Unauthorized');
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
    return [ key, JSON.stringify(value) ];
  });
  const csv = entries.map(row => row.join(',')).join('\n');
  res.headers.set(
    'Content-Disposition',
    `attachment; filename=application-${Date.now()}.csv`
  );
  res.setBody('text/csv', csv);
};