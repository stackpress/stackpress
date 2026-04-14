//modules
import type Engine from '@stackpress/inquire/Engine';
import Exception from '../Exception.js';
import { email } from '../assert.js';
//stackpress/client
import { ClientPlugin } from '../client/types.js';
//stackpress/session
import type { 
  Auth, 
  AuthExtended, 
  Profile, 
  ProfileAuth, 
  SignupInput, 
  SigninType, 
  SigninInput 
} from './types.js';

/**
 * Signup action
 */
export async function signup(
  input: Partial<SignupInput>,
  seed: string,
  engine: Engine,
  client: ClientPlugin
): Promise<Partial<ProfileAuth>> {
  //validate input
  const errors = assert(input);
  //if there are errors
  if (errors) {
    throw Exception.for('Invalid Parameters')
      .withErrors(errors)
      .withCode(400);
  }
  //create profile
  const { Actions: ProfileActions } = client.model.profile;
  const profileActions = new ProfileActions(engine, seed);
  const results = await profileActions.create({
    name: input.name as string,
    type: input.type || 'person',
    roles: input.roles || []
  }) as Profile & { auth: Record<string, Auth> };

  results.auth = {};
  const { Actions: AuthActions } = client.model.auth;
  const authActions = new AuthActions(engine, seed);
  //if email
  if (input.email) {
    //create email auth
    results.auth.email = await authActions.create({
      profileId: results.id,
      type: 'email',
      token: String(input.email),
      secret: String(input.secret)
    }).catch(e => {
      //if e is an exception with errors
      //NOTE: we cant rely on instanceof...
      if ((e as Exception).errors && e.errors.token) {
        e.withErrors({ 
          email: e.errors.token,
          token: e.errors.token
        });
      }
      throw e;
    }) as Auth;
  } 
  //if phone
  if (input.phone) {
    //create phone auth
    results.auth.phone = await authActions.create({
      profileId: results.id,
      type: 'phone',
      token: String(input.phone),
      secret: String(input.secret)
    }).catch(e => {
      //if e is an exception with errors
      //NOTE: we cant rely on instanceof...
      if ((e as Exception).errors && e.errors.token) {
        e.withErrors({ 
          phone: e.errors.token,
          token: e.errors.token
        });
      }
      throw e;
    }) as Auth;
  }
  //if username
  if (input.username) {
    //create username auth
    results.auth.username = await authActions.create({
      profileId: results.id,
      type: 'username',
      token: String(input.username),
      secret: String(input.secret)
    }).catch(e => {
      //if e is an exception with errors
      //NOTE: we cant rely on instanceof...
      if ((e as Exception).errors && e.errors.token) {
        e.withErrors({ 
          username: e.errors.token,
          token: e.errors.token
        });
      }
      throw e;
    }) as Auth;
  }

  return results;
};

/**
 * Signin action
 */
export async function signin(
  type: SigninType, 
  input: Partial<SigninInput>,
  seed: string,
  engine: Engine,
  client: ClientPlugin,
  password = true
): Promise<Partial<AuthExtended>> {
  const { Actions: AuthActions } = client.model.auth;
  const authActions = new AuthActions(engine, seed);
  //get form body
  const results = await authActions.find({
    columns: [ '*', 'profile.*' ],
    eq: { type, token: String(input[type]) }
  }) as AuthExtended | null;
  //if null (no user found)
  if (results === null) {
    throw Exception
      .for('Invalid Parameters')
      .withErrors({ [type]: 'User Not Found' })
      .withCode(404);
  //if use password
  //NOTE: passwordless can occur if OTP or magic link is used
  } else if (password) {
    const secret = authActions.store.columns.secret.serialize(
      String(input.secret),
      true
    );
    if (secret !== String(results.secret)) {
      throw Exception
        .for('Invalid Parameters')
        .withErrors({ secret: 'Invalid Password' })
        .withCode(401);
    }
  }
  //update consumed
  await authActions.update(
    { eq: { id: results.id } }, 
    { consumed: new Date() }
  );
  return results;
};

/**
 * Validate signup input
 */
export function assert(input: Partial<SignupInput>) {
  const errors: Record<string, string> = {};
  if (!input.name) {
    errors.name = 'Name is required';
  }
  if (!input.username && !input.email && !input.phone) {
    errors.username = 'Username, email, or phone is required';
  } else if (input.email && !email(input.email)) {
    errors.email = 'Invalid email';
  }
  if (!input.secret) {
    errors.secret = 'Password is required';
  }
  return Object.keys(errors).length ? errors : null;
};