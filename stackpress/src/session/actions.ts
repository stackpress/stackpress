//stackpress
import type { 
  StatusResponse,
  ErrorResponse
} from '@stackpress/lib/types';
import type Engine from '@stackpress/inquire/Engine';
//schema
import { email } from '../schema/assert';
import { hash, encrypt } from '../schema/helpers';
//root
import type { Auth, AuthExtended, Profile, ProfileAuth } from '../types';
//client
import { ClientPlugin } from '../client/types';
//local
import type { SignupInput, SigninType, SigninInput } from './types';

/**
 * Signup action
 */
export async function signup(
  input: Partial<SignupInput>,
  seed: string,
  engine: Engine,
  client: ClientPlugin
): Promise<Partial<StatusResponse<ProfileAuth>>> {
  //validate input
  const errors = assert(input);
  //if there are errors
  if (errors) {
    //return the errors
    return { code: 400, error: 'Invalid Parameters', errors };
  }
  //create profile
  const profile = client.model.profile;
  const response = await profile.actions(engine, seed).create({
    name: input.name as string,
    type: input.type || 'person',
    roles: input.roles || []
  });
  //if error, return response
  if (response.code !== 200) {
    return response as ErrorResponse;
  }
  const results = response.results as Profile & { 
    auth: Record<string, Auth> 
  };
  results.auth = {};
  const actions = client.model.auth.actions(engine, seed);
  //if email
  if (input.email) {
    //create email auth
    const auth = await actions.create({
      profileId: results.id,
      type: 'email',
      token: String(input.email),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth as StatusResponse<ProfileAuth>;
    }
    results.auth.email = auth.results as Auth;
  } 
  //if phone
  if (input.phone) {
    //create phone auth
    const auth = await actions.create({
      profileId: results.id,
      type: 'phone',
      token: String(input.phone),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth as StatusResponse<ProfileAuth>;
    }
    results.auth.phone = auth.results as Auth;
  }
  //if username
  if (input.username) {
    //create username auth
    const auth = await actions.create({
      profileId: results.id,
      type: 'username',
      token: String(input.username),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth as StatusResponse<ProfileAuth>;
    }
    results.auth.username = auth.results as Auth;
  }

  return { ...response, results };
};

/**
 * Signin action
 */
export async function signin(
  type: SigninType, 
  input: Partial<SigninInput>,
  seed: string,
  engine: Engine,
  client: ClientPlugin
): Promise<Partial<StatusResponse<AuthExtended>>> {
  const actions = client.model.auth.actions(engine);
  const token = encrypt(String(input[type]), seed);
  //get form body
  const response = await actions.search({
    columns: ['*', 'profile.*'],
    filter: { type, token }
  });
  const results = response.results?.[0] as AuthExtended;
  if (response.code !== 200) {
    return { ...response, results };
  } else if (!results) {
    return { 
      code: 404, 
      status: 'Not Found', 
      error: 'User Not Found' 
    };
  } 
  const secret = hash(String(input.secret));
  if (secret !== String(results.secret)) {
    return { 
      code: 401, 
      status: 'Unauthorized', 
      error: 'Invalid Password' 
    };
  }
  //update consumed
  await actions.update({ id: results.id }, {
    consumed: new Date()
  });
  return {
    code: 200,
    status: 'OK',
    results: results,
    total: 1
  };
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
    errors.type = 'Username, email, or phone is required';
  } else if (input.email && !email(input.email)) {
    errors.email = 'Invalid email';
  }
  if (!input.secret) {
    errors.secret = 'Password is required';
  }
  return Object.keys(errors).length ? errors : null;
};