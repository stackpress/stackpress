//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//view
import type { ViewConfig, BrandConfig } from '../../view/types.js';
//session
import type { AuthConfig, SessionPlugin } from '../types.js';

// Function to verify captcha with Google's servers
async function checkCaptchaWithGoogle(userToken: string, secretKey: string) {
  const googleVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  try {
    // Send verification request to Google
    const response = await fetch(googleVerifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: userToken,
      }),
    });

    // Check if the request to Google was successful
    if (!response.ok) {
      console.error('Failed to contact Google reCAPTCHA API:', response.status, response.statusText);
      return { success: false, error: 'Could not verify with Google' };
    }

    // Get the verification result from Google
    const verificationResult = await response.json();
    console.log('Google reCAPTCHA verification result:', verificationResult);
    return verificationResult;
    
  } catch (error) {
    console.error('Network error when verifying reCAPTCHA:', error);
    return { success: false, error: 'Network error' };
  }
}

export default async function SignInPage(
  req: Request,
  res: Response,
  ctx: Server
) {
  // Don't process if response already has content or error
  if (res.body || (res.code && res.code !== 200)) {
    return;
  }
  
  // Get configuration for page display
  const view = ctx.config.path<ViewConfig>('view', {});
  const brand = ctx.config.path<BrandConfig>('brand', {});
  const auth = ctx.config.path<AuthConfig>('auth');
  
  // Set up data for the template/frontend
  res.data.set('view', {
    base: view.base || '/',
    props: view.props || {}
  });
  res.data.set('brand', {
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',
    favicon: brand.favicon || '/favicon.ico',
  });
  res.data.set('auth', {
    base: auth.base || '/auth',
    roles: auth.roles || [],
    username: !!auth.username,
    email: !!auth.email,
    phone: !!auth.phone,
    password: auth.password || {}
  });
  
  // Where to redirect after successful sign in
  const redirect = req.data.path(
    'redirect_uri',
    ctx.config.path('auth.redirect', '/')
  );
  
  // Check if user is already signed in
  const session = ctx.plugin<SessionPlugin>('session');
  const me = session.load(req);
  const guest = await me.guest();
  //form submission
  if (req.method === 'POST') {
    // Get captcha data from the form
    const userCaptchaToken = req.data.path('recaptcha_token', '');
    const captchaType = req.data.path('recaptcha_type', 'v3');
    console.log('Captcha type being used:', captchaType);

    // Make sure user provided a captcha token
    if (!userCaptchaToken) {
      res.setBody('text/plain', 'Security verification is required', 400);
      return;
    }

    // Handle invisible captcha (v3) - checks if user seems like a bot
    if (captchaType === 'v3') {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY_V3;
      if (!secretKey) {
        res.setBody('text/plain', 'Invisible captcha not configured on server', 500);
        return;
      }

      const verificationResult = await checkCaptchaWithGoogle(userCaptchaToken, secretKey);
      console.log('Invisible captcha result:', verificationResult);

      // If Google says the verification failed
      if (!verificationResult.success) {
        console.log('Invisible captcha verification failed:', verificationResult['error-codes']);
        // Redirect back to form but show visible captcha instead
        const host = req.headers.get('host') || 'localhost';
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const redirectUrl = new URL(req.url, `${protocol}://${host}`);
        redirectUrl.searchParams.set('fallback', 'v2');
        redirectUrl.searchParams.set('error', 'Invisible verification failed');
        res.redirect(redirectUrl.toString());
        return;
      }

      // Check if the user's behavior score is too low (likely a bot)
      if (verificationResult.score && verificationResult.score < 1) {
        console.log('User behavior score too low:', verificationResult.score);
        // Redirect back to form but show visible captcha instead
        const host = req.headers.get('host') || 'localhost';
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const redirectUrl = new URL(req.url, `${protocol}://${host}`);
        redirectUrl.searchParams.set('fallback', 'v2');
        redirectUrl.searchParams.set('score', verificationResult.score.toString());
        res.redirect(redirectUrl.toString());
        return;
      }

      // Invisible captcha passed - proceed with sign in
      await ctx.emit('auth-signin', req, res);
      if (res.code !== 200) return;
      res.redirect(redirect);
      return;
    }

    // Handle visible captcha (v2) - user clicked checkboxes
    if (captchaType === 'v2') {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY_V2;
      if (!secretKey) {
        res.setBody('text/plain', 'Visible captcha not configured on server', 500);
        return;
      }

      const verificationResult = await checkCaptchaWithGoogle(userCaptchaToken, secretKey);
      console.log('Visible captcha result:', verificationResult);

      // If Google says the verification failed
      if (!verificationResult.success) {
        console.log('Visible captcha verification failed:', verificationResult['error-codes']);
        res.setBody('text/plain', 'Security verification failed. Please try again.', 400);
        return;
      }

      // Visible captcha passed - proceed with sign in
      await ctx.emit('auth-signin', req, res);
      if (res.code !== 200) return;
      res.redirect(redirect);
      return;
    }
  // If user is already signed in, redirect them to the main page
  } else if (!guest) {
    res.redirect(redirect);
  }
}