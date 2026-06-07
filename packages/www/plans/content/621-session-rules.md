# 621 Session Rules

Define or inspect route and event access rules that protect behavior by role. The local example shows why that choice matters in an app.

**Previously:** The previous lesson, `613 OTP / 2FA`, gave you the setup this page builds on. Here, the focus shifts to `Session Rules` so you can place the next Stackpress surface in the course path.

## 621.1. Flow Goal

Access control answers a simple question: should this visitor be allowed here? Session rules make that decision explicit by connecting roles to routes or events.

## 621.2. Config Surface

Check session config:

```ts
export const session = {
  access: {
    ADMIN: [
      { method: 'ALL', route: '/admin/**' }
    ],
    GUEST: [
      { method: 'GET', route: '/' },
      { method: 'ALL', route: '/auth/signin/**' }
    ]
  }
};
```

Use this as the concrete version of the explanation above. The part to copy is the structure; the part to change is the value that matches your app.

## 621.3. Rule Evaluation

The session layer uses role access lists to decide whether a request or event is allowed. Compare the concrete details to see the practical meaning.

## 621.4. Allowed And Blocked Paths

This part of the Session Rules workflow is easier to follow when the smaller pieces are compared together. The subsections cover Role, Access Entry, Default Guest, so the reader can see how each piece changes the local decision.

### 621.4.1. Role

A role is a named permission group such as `ADMIN`, `MANAGER`, `USER`, or `GUEST`. The nearby example or check shows the project detail affected by this idea.

### 621.4.2. Access Entry

An access entry describes a route or event permission. Use that purpose as the anchor for the local example or check.

### 621.4.3. Default Guest

When no signed-in profile is available, the session layer can treat the visitor as a guest role. The same idea shows up through inspectable project surfaces.

## 621.5. Security Checks

This part of the Session Rules workflow is easier to follow when the smaller pieces are compared together. The subsections cover Protect Admin Routes, Allow Public Assets, Debug A 403, so the reader can see how each piece changes the local decision.

### 621.5.1. Protect Admin Routes

Put admin route patterns under the admin role, then test with a user who does not have that role. Keep the idea tied to the concrete project surface in this section.

### 621.5.2. Allow Public Assets

Remember to allow static assets, auth pages, and client scripts needed by public pages. The example gives the decision enough context to evaluate it.

### 621.5.3. Debug A 403

Check the active session roles and the matching route pattern. Use the check to make the idea visible before moving to the next topic.

## 621.6. Verify

The checkpoint is simple: you can point to where Session Rules shows up and explain why it matters. The same idea shows up through inspectable project surfaces.

**Next step:** Read `631 Profile` for role storage and `630 Sessions And Account` overview when returning to the broader session model. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `631 Profile`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
