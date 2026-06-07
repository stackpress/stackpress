# 612 Sign Up

Enable or customize account and profile creation through the built-in sign-up flow. Keep that role in mind as the lesson moves into the concrete shape.

**Previously:** The previous lesson, `611 Sign In`, gave you the setup this page builds on. Here, the focus shifts to `Sign Up` so you can place the next Stackpress surface in the course path.

## 612.1. Flow Goal

Sign-up turns a visitor into an account, so it touches auth config, profile data, session behavior, and form protection. This lesson looks at that flow before treating account creation as automatic.

## 612.2. Config Surface

Check config:

```ts
export const auth = {
  base: '/auth',
  roles: [ 'USER' ],
  menu: [
    { name: 'Create a New Account', path: '/auth/signup' }
  ],
  password: {
    min: 8,
    max: 32
  }
};
```

Open:

```text
http://localhost:3000/auth/signup
```

This example ties the concept to an actual Stackpress shape. Notice how the file or helper creates behavior the app can later run, inspect, or generate from.

## 612.3. Sign Up Request Flow

The sign-up page uses auth settings for base route, default roles, and password rules. The built-in page also participates in CSRF-protected form handling.

## 612.4. User Feedback

This part of the Sign Up workflow is easier to follow when the smaller pieces are compared together. The subsections cover Account, Profile, Default Roles, so the reader can see how each piece changes the local decision.

### 612.4.1. Account

An account is the authentication-facing record used to sign in. The nearby example or check shows the project detail affected by this idea.

### 612.4.2. Profile

Profile data is the user-facing identity and role state associated with sessions. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 612.4.3. Default Roles

Default roles apply to new users when the auth config provides them. The local example shows why that choice matters in an app.

## 612.5. Security Checks

This part of the Sign Up workflow is easier to follow when the smaller pieces are compared together. The subsections cover Change Default Role, Adjust Password Rules, Redirect After Sign Up, so the reader can see how each piece changes the local decision.

### 612.5.1. Change Default Role

Update `auth.roles` when new accounts should start with a different role. Compare the concrete details to see the practical meaning.

### 612.5.2. Adjust Password Rules

Change `auth.password` settings to match the app's account policy. The examples stay practical by tying the idea to something you can run, change, or verify.

### 612.5.3. Redirect After Sign Up

Verify where the sign-up flow redirects after success, especially when using `redirect_uri`. That is why this detail appears in the lesson before reference material.

## 612.6. Verify

Use Sign Up as a guide for choosing which file, command, or generated output to inspect next. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Next step:** Read `631 Profile` for profile-facing behavior and `640 CSRF` for protected form actions. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `613 OTP / 2FA`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
