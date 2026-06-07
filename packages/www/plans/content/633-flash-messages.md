# 633 Flash Messages

Set session-backed feedback after redirects and show it through notifier behavior. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `632 Account Pages`, gave you the setup this page builds on. Here, the focus shifts to `Flash Messages` so you can place the next Stackpress surface in the course path.

## 633.1. Flow Goal

Some feedback has to survive a redirect. Flash messages put that feedback in session-backed storage long enough for the next page to show it.

## 633.2. Config Surface

Set a flash value before redirect:

```ts
res.session.set('flash', JSON.stringify({
  type: 'success',
  message: 'Changes saved.'
}));

res.redirect('/account');
```

Then use the view notifier behavior to render the message. That context prepares the reader for the more specific form that follows.

## 633.3. Set A Flash Message

The route stored feedback in the session so the next page can show it after the redirect. Keep the idea tied to the concrete project surface in this section.

## 633.4. Render Feedback

This part of the Flash Messages workflow is easier to follow when the smaller pieces are compared together. The subsections cover Flash Message, Redirect Flow, Notifier, so the reader can see how each piece changes the local decision.

### 633.4.1. Flash Message

A flash message is short-lived session feedback. The nearby example or check shows the project detail affected by this idea.

### 633.4.2. Redirect Flow

Flash messages are useful because normal in-memory client notification state is lost when the browser changes pages. Compare the concrete details to see the app-level effect.

### 633.4.3. Notifier

The notifier layer displays the message to the user. The following example gives the idea a concrete project shape.

## 633.5. Security Checks

This part of the Flash Messages workflow is easier to follow when the smaller pieces are compared together. The subsections cover Show Success After Save, Show Error After Failed Action, Clear After Display, so the reader can see how each piece changes the local decision.

### 633.5.1. Show Success After Save

Set a flash message after the write succeeds, then redirect. Keep the idea tied to the concrete project surface in this section.

### 633.5.2. Show Error After Failed Action

If the user needs to land on another page after an error, store the error as flash feedback. That is why this detail appears in the lesson before reference material.

### 633.5.3. Clear After Display

Make sure the app does not show the same flash message forever. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 633.6. Verify

Before moving on, connect Flash Messages to the files, commands, generated output, or runtime behavior around it. The same idea shows up through inspectable project surfaces.

**Next step:** Read `156 Notifier` for client-side notifications and `640 CSRF` for protected form actions. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `640 CSRF`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
