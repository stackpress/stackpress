//stackpress
import type { ProfileAuth } from 'stackpress';
import { action } from 'stackpress/server';

const secret = process.env.ADMIN_PASS || 'admin';

export default action(async function Populate(_req, _res, ctx) {
  const admin = await ctx.resolve<ProfileAuth>('auth-signup', {
    type: 'person',
    name: 'Admin',
    username: 'admin',
    email: 'admin@project.com',
    secret: secret,
    roles: [ 'ADMIN' ]
  });
  await ctx.resolve('application-create', {
    profileId: admin.results?.id,
    name: 'Example App',
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });
});