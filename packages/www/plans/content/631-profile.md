# 631 Profile

Inspect profile-facing behavior and understand how roles connect profile data to sessions. That is why this detail appears in the lesson before reference material.

**Previously:** The previous lesson, `621 Session Rules`, gave you the setup this page builds on. Here, the focus shifts to `Profile` so you can place the next Stackpress surface in the course path.

## 631.1. Flow Goal

A profile is the user-facing identity the app can attach roles, account details, and session behavior to. Understanding the active profile makes later auth and account pages easier to reason about.

## 631.2. Config Surface

Inspect profile seed or populate config:

```ts
{
  event: 'profile-create',
  data: {
    id: 'developer',
    name: 'Developer',
    type: 'person',
    roles: [ 'ADMIN' ]
  }
}
```

Then inspect profile output through an admin page, event, or query. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 631.3. Profile Request Flow

The profile record stores identity and roles. Session behavior can use those roles when checking access rules.

## 631.4. User Feedback

This part of the Profile workflow is easier to follow when the smaller pieces are compared together. The subsections cover Profile, Roles, Auth Record, so the reader can see how each piece changes the local decision.

### 631.4.1. Profile

A profile is the app-facing person or user identity. The same idea shows up through inspectable project surfaces.

### 631.4.2. Roles

Roles are stored with profile data and interpreted by session access rules. The nearby check shows the project-level consequence.

### 631.4.3. Auth Record

Auth records describe sign-in credentials or methods associated with a profile. The example gives the idea a concrete file, command, or code shape.

## 631.5. Security Checks

This part of the Profile workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Role, Inspect Current Profile, Extend Profile Behavior, so the reader can see how each piece changes the local decision.

### 631.5.1. Add A Role

Add the role to the profile data and make sure `session.access` defines what that role can do. The examples stay practical by tying the idea to something you can run, change, or verify.

### 631.5.2. Inspect Current Profile

Use a session-aware route or account page to confirm which profile is active. Use that purpose as the anchor for the local example or check.

### 631.5.3. Extend Profile Behavior

Add profile fields through schema or plugin behavior depending on whether the change is data model or runtime logic. The same idea shows up through inspectable project surfaces.

## 631.6. Verify

The important checkpoint is knowing where Profile belongs in the Stackpress workflow. Keep the idea tied to the concrete project surface in this section.

**Next step:** Read `632 Account Pages` for built-in profile/account screens. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `632 Account Pages`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
