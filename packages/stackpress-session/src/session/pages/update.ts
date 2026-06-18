//modules
import type Server from '@stackpress/ingest/Server';
import { action } from '@stackpress/ingest/Server'
//stackpress-schema
import { hash } from 'stackpress-schema/helpers';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session/auth
import { normalizePhone } from '../../auth/helpers.js';
import type { Auth, AuthExtended } from '../../auth/types.js';
//stackpress-session/session
import type { SessionPlugin } from '../types.js';
import { loadAccountProfile } from './account.js';

type AccountUpdateAuth = Record<string, Partial<Auth>>;

type AccountUpdateInput = {
  name: string,
  image: string,
  username?: string,
  email?: string,
  phone?: string,
  current?: string
};

type AccountUpdateField = {
  id?: string,
  token?: string,
  type: Auth['type']
};

/**
 * Main page handler
 */
export default action(async function AccountUpdatePage({ req, res, ctx }) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const data = await me.data();
  if (!data || await me.guest()) {
    res.statusCode(401, 'Unauthorized');
    return;
  }
  //load account profile
  const profile = await loadAccountProfile(ctx, data.id);
  //if profile returned 404 code
  if (profile.code === 404) {
    //return unauthorized error to client
    res.statusCode(401, 'Unauthorized');
    return;
  }
  //Only enter the write flow for POST requests so GET can keep behaving 
  // as a plain account detail render with the loaded profile response
  if (req.method !== 'POST') {
    //sync profile response to response
    res.fromStatusResponse(profile);
    //pass the view props down to view
    setViewProps(req, res, ctx);
    return;
  }
  //Stop immediately if the earlier profile lookup did not produce editable
  // results because the auth sync depends on those existing identifiers
  if (profile.code !== 200 || !profile.results) {
    res.fromStatusResponse(profile);
    return;
  }
  //Load the live auth rows again so password checks compare against the
  // stored hashes
  const auth = profile.results.auth || {};
  const auths = await ctx.resolve<AuthExtended[]>('auth-search', {
    eq: { profileId: data.id }
  });
  if (auths.code !== 200) {
    res.fromStatusResponse(auths);
    return;
  }
  //Normalize the payload once, then run the current-password validation 
  // before the flow updates profile fields or auth identifiers.
  const input = getUpdateInput(req);
  const passwordError = getPasswordError(input, auth, auths.results);
  if (passwordError) {
    res.setError('Invalid Parameters', { current: passwordError });
    return;
  }
  //update profile fields (name and image)
  await ctx.resolve('profile-update', {
    id: data.id,
    name: input.name,
    image: input.image
  }, res);
  if (res.code && res.code !== 200) {
    return;
  }
  //walk and update the editable auth fields
  const authError = await syncAuthFields(ctx, data.id, auth, input);
  if (authError?.code && authError.code !== 200) {
    res.fromStatusResponse(authError);
    return;
  }
  //if success!
  if (res.code === 200) {
    //redirect to base account page
    const base = ctx.config.path('auth.base', '/auth');
    res.redirect(`${base}/account`);
    return;
  }
});

/**
 * Update an existing auth token or create a missing auth record.
 */
export async function updateAuth(
  ctx: Server,
  profileId: string,
  type: Auth['type'],
  id: string | undefined,
  token: string | null | undefined,
  secret?: string
) {
  //skip empty values, but do not treat them as deletes
  if (typeof token !== 'string' || token.trim().length === 0) {
    return null;
  }
  //update existing auth token
  if (id) {
    return await ctx.resolve('auth-update', { id, token });
  }
  //otherwise, create the missing auth record
  return await ctx.resolve('auth-create', { profileId, type, token, secret });
};

/**
 * Build the editable auth field list for the sync loop.
 */
function getAuthFields(
  input: AccountUpdateInput,
  auth: AccountUpdateAuth
): AccountUpdateField[] {
  return [
    { id: auth.username?.id, token: input.username, type: 'username' },
    { id: auth.email?.id, token: input.email, type: 'email' },
    { id: auth.phone?.id, token: input.phone, type: 'phone' }
  ];
}

/**
 * Read and normalize the account update payload from the request
 */
function getUpdateInput(req: {
  data<T = unknown>(key: string): T
}): AccountUpdateInput {
  return {
    name: req.data('name'),
    image: req.data('image'),
    username: req.data<string>('username'),
    email: req.data<string>('email'),
    phone: normalizePhone(req.data<string>('phone')),
    current: req.data<string>('current')
  };
}

/**
 * Return the current-password validation error when one is needed
 */
function getPasswordError(
  input: AccountUpdateInput,
  auth: AccountUpdateAuth,
  auths?: AuthExtended[]
) {
  //Skip the password gate entirely when the user is only editing 
  // existing linked identifiers and is not adding a new sign-in method
  if (!shouldRequirePassword(input, auth)) {
    return null;
  }
  //Stop here if there is nothing stored to compare against because the 
  // page cannot safely prove the current password without an existing hash
  if (!auths?.length) {
    return 'No authentication found.';
  }
  //Require the current password before creating any missing auth record 
  // so the new identifier inherit the persisted secret
  if (!input.current) {
    return 'Current password is required to add a sign-in method';
  }
  //Reject the request when the submitted password does not match any 
  // existing password-backed auth record for this account
  if (!matchesCurrentPassword(auths, input.current)) {
    return 'Current password is incorrect';
  }
  return null;
}

/**
 * Check whether a submitted token is a non-empty string.
 */
function hasToken(token: unknown) {
  return typeof token === 'string' && token.trim().length > 0;
}

/**
 * Compare the submitted current password against existing password auths
 */
function matchesCurrentPassword(
  auths: AuthExtended[],
  current?: string | null
) {
  if (!current) {
    return false;
  }
  //Hash the submitted password once so it can be compared against the
  // already-persisted credential secrets
  const secret = hash(current);
  return auths.some(auth =>
    (
      auth.type === 'username'
      || auth.type === 'email'
      || auth.type === 'phone'
    )
    && auth.secret === secret
  );
}

/**
 * Decide whether this submission is trying to add a new sign-in method
 */
function shouldRequirePassword(
  input: AccountUpdateInput,
  auth: AccountUpdateAuth
) {
  return getAuthFields(input, auth)
    .some(field => !field.id && hasToken(field.token));
}

/**
 * Sync the editable auth records and stop on the first write error
 */
async function syncAuthFields(
  ctx: Server,
  profileId: string,
  auth: AccountUpdateAuth,
  input: AccountUpdateInput
) {
  //walk the editable sign-in methods
  for (const field of getAuthFields(input, auth)) {
    const response = await updateAuth(
      ctx,
      profileId,
      field.type,
      field.id,
      field.token,
      input.current
    );
    if (response?.code && response.code !== 200) {
      //stop on error
      return response;
    }
  }
  return null;
}
