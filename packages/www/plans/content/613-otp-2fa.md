# 613 OTP / 2FA

Trace one-time-password and second-factor flows through auth config, session pages, CSRF, and profile-linked records. Keep the idea tied to the concrete project surface in this section.

**Previously:** The previous lesson, `612 Sign Up`, gave you the setup this page builds on. Here, the focus shifts to `OTP / 2FA` so you can place the next Stackpress surface in the course path.

## 613.1. Flow Goal

Two-factor authentication adds another checkpoint after sign-in. It is useful because some account actions deserve more proof than a password or link alone.

## 613.2. Config Surface

Check issuer config:

```ts
export const auth = {
  '2fa': {
    issuer: 'Stackpress'
  }
};
```

Inspect the account security route:

```text
/account/security/2fa
```

This example keeps the first version narrow on purpose. Once this shape is clear, the surrounding section can add options without making the first step harder to follow.

## 613.3. OTP Request Flow

The 2FA flow uses auth config for issuer naming, session state for the active profile, CSRF for form protection, and generated auth/session records for the second factor. The example gives the decision enough context to evaluate it.

## 613.4. User Feedback

This part of the OTP / 2FA workflow is easier to follow when the smaller pieces are compared together. The subsections cover OTP, 2FA, Issuer, so the reader can see how each piece changes the local decision.

### 613.4.1. OTP

OTP means one-time password. It is a short-lived code used to prove possession of a second factor.

### 613.4.2. 2FA

2FA means two-factor authentication. It adds another verification step beyond the first sign-in method.

### 613.4.3. Issuer

The issuer is the app name shown to authenticator tools when setting up the factor. Use the check to make the idea visible before moving to the next topic.

## 613.5. Security Checks

This part of the OTP / 2FA workflow is easier to follow when the smaller pieces are compared together. The subsections cover Change The Issuer, Test Setup And Remove, Check Flash Feedback, so the reader can see how each piece changes the local decision.

### 613.5.1. Change The Issuer

Set `auth.2fa.issuer` or ensure brand config provides the right app name. The examples below turn the concept into concrete Stackpress project surfaces.

### 613.5.2. Test Setup And Remove

Verify both setup and removal routes, because both flows need correct session and CSRF behavior. That context prepares the reader for the more specific form that follows.

### 613.5.3. Check Flash Feedback

Successful setup or removal should give the user visible feedback after redirect. Keep the idea tied to the concrete project surface in this section.

## 613.6. Verify

For OTP / 2FA, focus first on the problem it solves, then use the syntax as the concrete way Stackpress represents that problem. The nearby example or check shows the project detail affected by this idea.

**Next step:** Read `633 Flash Messages` and `640 CSRF` for the supporting behavior behind these flows. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `621 Session Rules`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
