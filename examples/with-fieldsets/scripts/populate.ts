//stackpress
import type { ProfileAuth } from 'stackpress';
//config
import { bootstrap } from '../config/develop';

const secret = process.env.ADMIN_PASS || '123';

async function populate() {
  const server = await bootstrap();
  const admin = await server.resolve<ProfileAuth>('auth-signup', {
    type: 'person',
    name: 'Admin',
    username: 'admin',
    email: 'admin@project.com',
    secret: secret,
    roles: [ 'ADMIN' ]
  });
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
