# 650 Email

Email lets a Stackpress app send information outside the request that triggered
it. A browser response can show a page, but an email can carry an OTP, magic
link, receipt, account notice, or other transactional message to the user
after the request is complete.

The important lesson is not only "how to send mail." It is where email belongs
in the Stackpress flow: config chooses the transport, the email plugin
registers the event, and route or auth code passes Nodemailer message options
to that event. When those pieces are separated, delivery problems are much
easier to trace.

**Previously:** `CSRF` covered protected form actions. Email often appears
after those actions, especially when an account or sign-in flow needs to send a
challenge or notification.

## 650.1. When To Send Email

Send email when the user needs information outside the current page. In
Stackpress Session, email sign-in can send OTP codes or magic links. Other apps
might send receipts, account updates, invitation links, or moderation notices.

Think of email as a messenger, not the decision maker. The route or event
decides what should happen, builds a message, and asks the email event to send
it through the configured transport.

## 650.2. Configure Sender

The email package only activates when `email` config exists. A scaffolded app
shows a basic SMTP-style config object.

```ts
export const email = {
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'username',
    pass: 'password'
  }
};
```

This example configures the transport passed into Nodemailer. In a real app,
the username and password should come from environment variables or deployment
secrets instead of committed literal credentials.

The email plugin checks for that config before it registers the event:

```ts
export default function plugin(ctx: Server) {
  if (!ctx.config.has('email')) return;

  ctx.on('listen', ({ ctx }) => {
    if (!ctx.config.get('email')) return;
    ctx.use(emitter);
  });
}
```

This example explains why missing email config disables email behavior. The
plugin does not register the emitter unless the app has an `email` config
surface.

## 650.3. Emit Or Call Send

The registered event is `email-send`. It reads the message options from request
data, creates a Nodemailer transport from config, sends the message, and stores
the sent info on the response.

```ts
emitter.on('email-send', async function EmailSend({ req, res, ctx }) {
  const config = ctx.config<EmailConfig>('email');
  if (!config) return;
  const options = req.data<SendMailOptions>();
  const transporter = nodemailer.createTransport(config);
  const info = await new Promise<SentMessageInfo>((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
  res.results(info);
});
```

This example shows the exact event behavior. The event expects
`SendMailOptions`, so the caller should pass a message object with fields such
as `from`, `to`, `subject`, `text`, and `html`.

Email sign-in uses `ctx.resolve()` with a message object:

```ts
const mail: SendMailOptions = {
  from: { name: auth.email.name, address: auth.email.address },
  to: email,
  subject: template.subject,
  text: template.text,
  html: template.html
};

const sent = await ctx.resolve('email-send', mail, res);
```

This example is the pattern to copy. The caller builds the mail options, then
resolves `email-send` with those options and the current response so delivery
errors can be copied back into the request flow.

## 650.4. Verify Delivery

Verify delivery in layers. First confirm the plugin is active by checking that
`email` config exists. Then confirm the caller builds valid `SendMailOptions`.
Finally, confirm the transport can actually deliver in the current environment.

The config type accepts the Nodemailer transport families exposed by the email
package:

```ts
export type EmailConfig = TransportOptions
  | JSONOptions
  | MailOptions
  | SESOptions
  | PoolOptions
  | SMTPOptions
  | StreamOptions
  | string;
```

This example means Stackpress Email delegates transport details to Nodemailer.
Use the transport shape that matches your provider, but keep provider-specific
setup out of junior lessons unless the source or deployment guide confirms it.

Auth email has one extra sender check:

```ts
if (!auth.email?.address || !auth.email.name) {
  return;
}
```

This example means passwordless auth email needs sender details under auth
config as well as general email transport config. The current scaffolded app has
an `email` transport config, but the shown `auth` config does not include
`auth.email.name` and `auth.email.address`, so those auth email helpers would
return before sending until that sender config is added.

## 650.5. Common Failures

Email failures usually come from missing config, incomplete sender data, wrong
message options, or transport/provider errors. Debug the event chain before
changing unrelated auth or account code.

### 650.5.1. Missing Email Config

If `email` config is missing, the email plugin returns before registering the
emitter. In that state, auth code can still build a message, but the delivery
event is not available through the email plugin.

```ts
if (!ctx.config.has('email')) return;
```

This example is a deliberate guard. It keeps apps that do not send email from
loading email behavior, but it also means email lessons should start by
checking config.

### 650.5.2. Missing Auth Sender

Email OTP and magic-link flows require sender metadata before they send. The
helpers check for `auth.email.name` and `auth.email.address`.

```ts
from: { name: auth.email.name, address: auth.email.address }
```

This example is about the message envelope, not the SMTP login. SMTP login
comes from `email.auth`, while this `from` value is the visible sender placed
on the outgoing message.

### 650.5.3. Transport Error

When Nodemailer reports an error, the event promise rejects or the caller
copies the failed status into the response. Auth email callers check the result
and stop when sending fails.

```ts
if (sent.code !== 200) {
  res.fromStatusResponse(sent);
  return;
}
```

This example keeps a failed email send from pretending the challenge was sent.
The response now carries the delivery failure, so the page or calling flow can
show an error instead of redirecting blindly.

## 650.6. Next Step

Email is a delivery event backed by configuration. The app still owns the
decision to send, the template content, and the user-facing flow around that
send.

Read `660 i18n` next to see how user-facing text can be translated in views.
Keep provider-specific SMTP, SES, or testing setup in deployment or provider
docs unless a course has a confirmed source for that environment.

**Learning checkpoint:** You should be able to explain the difference between
`email` transport config and the `SendMailOptions` passed to `email-send`. You
should also be able to explain why auth email needs sender details before OTP
or magic-link email can be sent.
