//modules
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
import qrcode from 'qrcode';
//stackpress-csrf
import type { CsrfPlugin } from 'stackpress-csrf/types';
//stackpress-view
import { setViewProps } from 'stackpress-view/helpers';
//stackpress-session
import type { 
  AuthExtended, 
  ProfileExtended,
  SessionPlugin 
} from '../../../types.js';
import { generateSecret, verifyTOTP } from '../../../helpers.js';

/**
 * Main page handler
 */
export default async function TwoFactorPage(
  req: Request, 
  res: Response, 
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get csrf plugin
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  //get session plugin
  const session = ctx.plugin<SessionPlugin>('session');
  //pass the view props down to view
  setViewProps(req, res, ctx);
  const me = session.load(req);
  const data = await me.data();
  if (!data || await me.guest()) {
    res.setStatus(401, 'Unauthorized');
    //NOTE: no need for csrf here...
    return;
  }
  const profile = await ctx.resolve<ProfileExtended>(
    'profile-detail', 
    { id: data.id }
  );
  if (profile.code === 404) {
    res.setStatus(401, 'Unauthorized');
    //NOTE: no need for csrf here...
    return;
  }

  const auth = await ctx.resolve<AuthExtended>('auth-detail', {
    eq: { type: '2fa', profileId: data.id }
  });
  if (auth.code !== 200 && auth.code !== 404) {
    res.fromStatusResponse(auth);
    //generate csrf token before returning
    csrf.generate(res, ctx);
    return;
  }
  //get the secret from the request, or from the DB or generate a new one
  const regenerate = req.data.has('regenerate');
  const secret = req.data.path('secret', auth.results && !regenerate
    ? auth.results.token
    : generateSecret()
  );
  //get issuer from auth.2fa.issuer or brand.name or default to 'Stackpress'
  const brand = ctx.config.path('brand.name', 'Stackpress');
  const issuer = encodeURIComponent(
    ctx.config.path('auth.2fa.issuer', brand)
  );
  const label = encodeURIComponent(
    `${issuer}:${data.name || 'User'}`
  );
  const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;
  const qr = await qrcode.toDataURL(uri);

  //if submitted
  if (req.method === 'POST') {
    //if csrf token is invalid, return
    if (!csrf.valid(req, res)) {
      //generate csrf token before returning
      csrf.generate(res, ctx);
      return;
    }
    //validate the code
    const code = String(req.data.path('code', ''));
    const padded = code.padStart(6, '0');
    if (!code || padded.length < 6) {
      res.setError('Invalid code');
      res.setResults({ url: qr, secret });
      //generate csrf token before returning
      csrf.generate(res, ctx);
      return;
    }
    //verify the code
    const valid = verifyTOTP(padded, secret);
    if (!valid) {
      res.setError('Invalid code');
      res.setResults({ url: qr, secret });
      //generate csrf token before returning
      csrf.generate(res, ctx);
      return;
    }
    //if there is an existing 2fa record
    if (auth.results) {
      await ctx.resolve('auth-update', {
        id: auth.results.id,
        token: secret,
        secret
      }, res);
    } else {
      //create a new 2fa
      await ctx.resolve('auth-create', {
        profileId: data.id,
        type: '2fa',
        token: secret,
        secret
      }, res);
    }
    res.session.set('flash', JSON.stringify({
      type: 'success',
      message: 'Two-Factor Authentication has been updated successfully.',
      close: 5000
    }))
    const base = ctx.config.path('auth.base', '/auth');
    res.redirect(req.data.path(
      'redirect_uri', 
      `${base}/account/security/2fa`
    ));
    return;
  }

  //set results for template
  res.setResults({ 
    url: qr,
    secret,
    profile: profile.results,
    authId: auth.results?.id
  });
  //generate csrf token before returning
  csrf.generate(res, ctx);
};
