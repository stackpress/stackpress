# 611 Sign In

Enable or customize a sign-in path such as username, email, phone, or another configured auth option. The following example gives the idea a concrete project shape.

**Previously:** The previous lesson, `542 Custom Generators`, gave you the setup this page builds on. Here, the focus shifts to `Sign In` so you can place the next Stackpress surface in the course path.

## 611.1. Flow Goal

Sign-in is the front door for private app behavior. Stackpress can expose sign-in routes and views from auth config, but you still need to know which options the app offers and where users land afterward.

## 611.2. Config Surface

Check auth config:

```ts
export const auth = {
  base: '/auth',
  redirect: '/',
  menu: [
    { name: 'With Username', path: '/auth/signin/username' },
    { name: 'With Email', path: '/auth/signin/email' },
    { name: 'With Phone', path: '/auth/signin/phone' }
  ]
};
```

Open one configured path:

```text
http://localhost:3000/auth/signin/email
```

Read the example by finding the helper first, then the value or file it acts on. That habit makes the code easier to scan when the same pattern appears in a larger app.

## 611.3. Sign In Request Flow

The auth config describes where sign-in lives and which options are visible. The session/auth plugin provides the route and view behavior when the Stackpress plugin stack is active.

## 611.4. User Feedback

This part of the Sign In workflow is easier to follow when the smaller pieces are compared together. The subsections cover Auth Base, Sign-In Option, Redirect, so the reader can see how each piece changes the local decision.

### 611.4.1. Auth Base

The auth base is the route prefix for sign-in, sign-out, sign-up, and related auth pages. Keep the idea tied to the concrete project surface in this section.

### 611.4.2. Sign-In Option

A sign-in option is a configured path the user can choose, such as email or username. That is why this detail appears in the lesson before reference material.

### 611.4.3. Redirect

The redirect controls where the user should go after sign-in or when already signed in. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 611.5. Security Checks

This part of the Sign In workflow is easier to follow when the smaller pieces are compared together. The subsections cover Hide An Option, Change Redirect, Check Email Sign-In, so the reader can see how each piece changes the local decision.

### 611.5.1. Hide An Option

Remove the menu item for a sign-in option your app does not support. The same idea shows up through inspectable project surfaces.

### 611.5.2. Change Redirect

Set `auth.redirect` to the page users should see after sign-in. The nearby check shows the project-level consequence.

### 611.5.3. Check Email Sign-In

If email sign-in sends messages, verify `email` config and the `email-send` event. The example gives the idea a concrete file, command, or code shape.

## 611.6. Verify

What changed in this lesson is your map: Sign In now has a place in the Stackpress system. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Next step:** Read `612 Sign Up` for account creation and `621 Session Rules` for route protection. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `612 Sign Up`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
