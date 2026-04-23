//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//modules
import qrcode from 'qrcode';
//view
import type { ViewConfig, BrandConfig } from '../../../../view/types.js';
//session
import type { AuthConfig, SessionPlugin, Auth } from '../../../types.js';
//csrf
import type { CsrfPlugin } from '../../../../types.js';
//stackpress/session
import { generateSecret, verifyTOTP } from '../../../totp.js';

export default async function Security2FAPage(
  req: Request,
  res: Response,
  ctx: Server
) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  //get the view, brand and auth config
  const view = ctx.config.path<ViewConfig>('view', {});
  const brand = ctx.config.path<BrandConfig>('brand', {});
  const auth = ctx.config.path<AuthConfig>('auth');
  //get auth base
  const base = auth.base || '/auth';
  //set data for template layer
  res.data.set('view', {
    base: view.base || '/',
    props: view.props || {}
  });
  res.data.set('brand', {
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',
    favicon: brand.favicon || '/favicon.ico'
  });
  res.data.set('auth', {
    base: auth.base || '/auth'
  });
  //get the session
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const guest = await me.guest();
  const data = await me.data();
  //if not signed in, redirect to the redirect URI
  if (guest || !data) {
    res.redirect(
      `${base}/signin?redirect_uri=${encodeURIComponent(
        `${base}/account/security/2fa`
      )}`
    );
    return;
  }
  //generate csrf token
  const csrf = ctx.plugin<CsrfPlugin>('csrf');
  csrf.generateToken(res, ctx);
  //check if 2fa is already created
  const exists = await ctx.resolve<Auth[]>('auth-search', {
    eq: { type: '2fa', profileId: data.id }
  });
  if (exists.code !== 200) {
    res.fromStatusResponse(exists);
    return;
  }
  //get the secret from the request, or from the DB or generate a new one
  const regenerate = req.data.has('regenerate');
  const secret = req.data.path('secret', regenerate
    ? generateSecret()
    : exists.results?.length 
    ? exists.results[0].token 
    : generateSecret()
  );
  //get issuer from auth.2fa.issuer or brand.name or default to 'Stackpress'
  const issuer = ctx.config.path('auth.2fa.issuer', brand.name || 'Stackpress');
  const label = encodeURIComponent(`${issuer}:${data.name || 'User'}`);
  const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  const qr = await qrcode.toDataURL(uri);
  //if submitted
  if (req.method === 'POST') {
    //if csrf token is invalid, return
    if (!csrf.validateToken(req, res)) return;
    //validate the code
    const code = String(req.data.path('code', ''));
    const padded = code.padStart(6, '0');
    if (!code || padded.length < 6) {
      res.setError('Invalid code');
      res.setResults({ url: qr, secret });
      return;
    }
    //verify the code
    const valid = verifyTOTP(padded, secret);
    if (!valid) {
      res.setError('Invalid code');
      res.setResults({ url: qr, secret });
      return;
    }
    //if there is an existing 2fa record
    if (exists.results?.length) {
      //update the existing 2fa
      const auth = exists.results[0];
      await ctx.resolve('auth-update', {
        id: auth.id,
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
    res.redirect(`${base}/account/security/2fa`);
    return;
  }
  //set results for template
  res.setResults({ 
    url: qr,
    secret,
    authRecordId: exists.results ? exists.results[0]?.id : undefined,
  });
}
