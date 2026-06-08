# 640 CSRF

Protect state-changing form flows with CSRF tokens. CSRF protection gives the app a way to prove that a submitted form came from a page the app rendered, instead of from another site trying to act as the current user.

**Previously:** The previous course, `Flash Messages`, showed how session-backed feedback survives redirects and renders through the view layout. This page uses the real CSRF plugin and sign-in page source to explain the token surface accurately.

## 640.1. Why CSRF Exists

CSRF means cross-site request forgery. The problem is that a browser can carry a user's cookies when another site submits a request to your app, so the app needs proof that the form submission came from a trusted page flow.

The token is that proof. The app stores a token in session, renders the token into the form data, and validates the submitted token before allowing protected state-changing work.

## 640.2. The Config Surface

A scaffolded app config names the CSRF field `csrf`. The CSRF plugin uses this name when it reads request data, writes response data, and stores session data.

```ts
export const csrf = {
  name: 'csrf'
};
```

This example gives the token a shared name. If your form submits a different field name than the config expects, validation will fail because the plugin will look in the wrong place.

## 640.3. Generate A Token

The CSRF plugin registers itself during the config phase. Its `generate()` method creates a random token, stores it in the response session, and adds view-facing response data under the configured token name.

```ts
generate(res: Response, ctx: Server) {
  const name = ctx.config.path<string>('csrf.name', 'csrf');
  const token = crypto.randomBytes(32).toString('hex');
  res.session.set(name, token);
  res.data.set(name, { name, token });
  return token;
}
```

This example shows both halves of token generation. `res.session.set()` saves the secret value for the next request, while `res.data.set()` gives the rendered page the name and token it needs to include in the form.

## 640.4. Validate A Token

The `valid()` method compares the token from session with the token submitted in request data. If either value is missing, empty, a different length, or not equal, the response becomes a `419 Page Expired`.

```ts
const session = req.session.get(name);
const input = req.data(name);

if (typeof session !== 'string' || typeof input !== 'string') {
  res.setError(error);
  res.statusCode(419, 'Page Expired');
  return false;
}
```

This example shows the first failure check. A form that omits the token should fail before the route performs any protected action.

The plugin also uses `crypto.timingSafeEqual()` when both values are present:

```ts
if (buffer.session.length !== buffer.input.length
  || !crypto.timingSafeEqual(buffer.session, buffer.input)
) {
  res.setError(error);
  res.statusCode(419, 'Page Expired');
  return false;
}
```

This example shows the actual comparison step. The length check prevents invalid buffer comparison, and `timingSafeEqual()` avoids a simple string comparison for the secret token.

## 640.5. Clear A Token

The `clear()` method removes the configured token name from request data, response session data, and response data. The sign-in page uses this when it detects that the current user is already signed in.

```ts
if (!guest) {
  csrf.clear(req, res, ctx);
  res.redirect(req.data.path('redirect_uri', '/'));
}
```

This example comes from the sign-in page. When a signed-in user reaches the sign-in page, the page clears the CSRF token and redirects the user instead of showing the sign-in form again.

## 640.6. Mistakes To Avoid

CSRF mistakes are dangerous because the page can still render while the form
flow is not actually protected. Keep the configured token name, generated form
data, submitted request data, and session token aligned.

### 640.6.1. Change The Form Field Name

```html
<input type="hidden" name="_csrf" value="..." />
```

This is wrong when config says the token name is `csrf`. The plugin reads the
configured name from request data, so a form that submits `_csrf` will look
like it omitted the token.

### 640.6.2. Validate After The Write

```ts
await saveAccountChanges(req.data());
csrf.valid(req, res, ctx);
```

This checks the token too late. Validation belongs before state-changing work
because a failed token should stop the protected action, not report a failure
after the write already happened.

### 640.6.3. Ignore `419 Page Expired`

```text
419 Page Expired
```

This status is useful evidence, not just noise in the browser. It means the
CSRF plugin rejected the request, so the next step is to inspect the session
token, submitted token, and configured token name.

## 640.7. How To Verify CSRF

Verify the success path by rendering a protected form, confirming the token data is present, submitting the form, and checking that the protected action runs only after validation. Then test the failure path by removing or changing the submitted token.

The expected failure is a `419 Page Expired` response with the configured error message. If the form still succeeds without a valid token, the protected action is not using the CSRF validation surface correctly.

**Learning checkpoint:** Before moving on, make sure you can explain the three CSRF methods: `generate()`, `valid()`, and `clear()`. You should also know that the token name must match across config, rendered form data, request data, and session data.

**Next course:** Continue with `Email`. That course follows the source-backed `email-send` event and sender config surface, while keeping provider-specific delivery testing out of scope.
