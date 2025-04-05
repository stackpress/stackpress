//stackpress
import type { Profile } from 'stackpress';
//plugins
import bootstrap from '../plugins/bootstrap';

const secret = process.env.ADMIN_PASS || '123';

async function populate() {
  const server = await bootstrap();
  const admin = await server.resolve<Profile>('profile-create', {
    name: 'Admin',
    type: 'person',
    roles: [ 'ADMIN' ],
    tags: [ 'admin', 'user' ],
    references: {
      foo: 'barfoo',
      bar: 'foobar'
    },
    address1: {
      label: 'Home',
      street: '123 Main St',
      city: 'Anytown',
      country: 'USA',
      postal: '12345'
    }
  });
  await server.resolve('auth-create', {
    profileId: admin.results?.id,
    type: 'username',
    token: 'admin',
    secret: secret,
  })
  
  const app = await server.resolve('application-create', {
    profileId: admin.results?.id,
    name: 'Example App',
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  }) as { results: { id: string } };
  console.log('Default app:', app)
};

populate()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
