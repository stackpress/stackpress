# 650 Email

Send a basic transactional email through the Stackpress email event. The examples below turn the concept into concrete Stackpress project surfaces.

**Previously:** The previous lesson, `640 CSRF`, gave you the setup this page builds on. Here, the focus shifts to `Email` so you can place the next Stackpress surface in the course path.

## 650.1. When To Send Email

Email connects app actions to the outside world: sign-in links, receipts, account notices, and notifications. The lesson is not only how to send one, but where the sending behavior belongs.

## 650.2. Configure Sender

Add email config using the transport settings your app needs:

```ts
export const email = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};
```

Emit the event:

```ts
await ctx.emit('email-send', req, res);
```

In this example, the useful part is the value being passed, returned, or configured. That is usually the first thing a developer changes when adapting the pattern.

## 650.3. Emit Or Call Send

The email plugin reads `email` config and registers an `email-send` event. The event uses Nodemailer transport settings to send the message options passed through the request/response flow.

## 650.4. Verify Delivery

This part of the Email workflow is easier to follow when the smaller pieces are compared together. The subsections cover Transport, Transactional Email, Secrets, so the reader can see how each piece changes the local decision.

### 650.4.1. Transport

The transport is the SMTP or provider configuration used to send mail. That is why this detail appears in the lesson before reference material.

### 650.4.2. Transactional Email

Transactional email is sent because of a user or system action, such as sign-in or order confirmation. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 650.4.3. Secrets

Email credentials should come from environment variables or deployment secrets. The same idea shows up through inspectable project surfaces.

## 650.5. Common Failures

This part of the Email workflow is easier to follow when the smaller pieces are compared together. The subsections cover Test With Safe Transport, Send Auth Email, Log Failures, so the reader can see how each piece changes the local decision.

### 650.5.1. Test With Safe Transport

Use a development-safe email transport before sending real mail. The nearby check shows the project-level consequence.

### 650.5.2. Send Auth Email

Auth flows can use email templates and the `email-send` event for sign-in links or codes. The example gives the idea a concrete file, command, or code shape.

### 650.5.3. Log Failures

If sending fails, inspect the response error and transport config. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 650.6. Next Step

The important part is the reason behind Email: it gives the app a clearer way to organize one kind of behavior. That context prepares the reader for the more specific form that follows.

Read `611 Sign In` for auth email usage and keep provider-specific transport details in deployment docs. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `661 Language Config`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
