# 134 Session

Read session state in route and view workflows when a page depends on the current visitor or signed-in profile. The following example gives the idea a concrete project shape.

**Previously:** The previous lesson, `133 Data Surfaces`, gave you the setup this page builds on. Here, the focus shifts to `Session` so you can place the next Stackpress surface in the course path.

## 134.1. Flow Goal

Some requests only make sense when the app knows who is visiting. Session data is the short-term memory that lets a route connect the current request to a signed-in profile, flash message, role, or redirect decision.

## 134.2. Session Config

In a route, inspect the session object provided by the request and response flow:

```ts
server.get('/me', ({ req, res }) => {
  const profileId = req.session.get('profileId');
  res.results({ profileId });
});
```

In a view, read the session through the provider-backed hook:

```tsx
import { useSession } from 'stackpress/view/client';

export function Body() {
  const session = useSession();
  return <pre>{JSON.stringify(session.data(), null, 2)}</pre>;
}
```

In this example, the useful part is the value being passed, returned, or configured. That is usually the first thing a developer changes when adapting the pattern.

## 134.3. Read And Write Session Data

Session data travels with the request and can be exposed to views through server props. Use the session helper methods instead of assuming raw object fields.

## 134.4. User Feedback

This part of the Session workflow is easier to follow when the smaller pieces are compared together. The subsections cover Session State, Route Access, View Access, so the reader can see how each piece changes the local decision.

### 134.4.1. Session State

Session state is request-specific. It can represent guest state, signed-in profile data, roles, flash values, or other session-backed values.

### 134.4.2. Route Access

Routes use session data to decide whether a request can continue, redirect, or return a different result. The examples stay practical by tying the idea to something you can run, change, or verify.

### 134.4.3. View Access

Views read the session through hooks such as `useSession()` after the page layout has created the provider boundary. Keep that role in mind as the lesson moves into the concrete shape.

## 134.5. Security Checks

This part of the Session workflow is easier to follow when the smaller pieces are compared together. The subsections cover Protect A Route, Read Roles, Pass Session To A Layout, so the reader can see how each piece changes the local decision.

### 134.5.1. Protect A Route

Check the session before returning private data. If the required value is missing, redirect or return an error instead of continuing.

### 134.5.2. Read Roles

Use session helper methods or the app's existing access pattern when checking permissions. Do not hard-code role object shapes without checking the local session contract.

### 134.5.3. Pass Session To A Layout

When using standard layouts, pass `session` from page props into the layout so child hooks can read it. The nearby example or check shows the project detail affected by this idea.

## 134.6. Verify

Use Session as a guide for choosing which file, command, or generated output to inspect next. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Next step:** Read `621 Session Rules` later for access-rule configuration. For public session helpers, use [Session Reference](/reference/session). Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `135 Nest`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
