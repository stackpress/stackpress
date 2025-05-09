//stackpress
import type { Profile, Auth } from 'stackpress';
import { action } from 'stackpress/server';

const secret = process.env.ADMIN_PASS || 'admin';

export default action(async function Populate(_req, _res, ctx) {
  const profile = await ctx.resolve<Profile>('profile-create', {
    type: 'person',
    name: 'Admin',
    roles: [ 'ADMIN' ],
    address1: {
      label: '',
      street: '123 Main St',
      city: 'Anytown',
      country: 'US',
      postal: '12345',
      contacts: []
    }
  });
  if (profile.code !== 200) {
    console.log('Error creating admin profile', profile);
    return;
  }
  const username = await ctx.resolve<Auth>('auth-create', {
    profileId: profile.results?.id,
    type: 'username',
    token: 'admin',
    secret: secret,
    verified: true
  });
  if (username.code !== 200) {
    console.log('Error creating username auth', profile);
    return;
  }
  const email = await ctx.resolve<Auth>('auth-create', {
    profileId: profile.results?.id,
    type: 'email',
    token: 'admin@project.com',
    secret: secret,
    verified: true
  });
  if (email.code !== 200) {
    console.log('Error creating username auth', email);
    return;
  }
  const app = await ctx.resolve('application-create', {
    profileId: profile.results?.id,
    name: 'Example App',
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });
  if (app.code !== 200) {
    console.log('Error creating username auth', app);
    return;
  }
});