# 156 Notifier

Show user-facing notifications after route actions, response errors, flash data, and client flows. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `155 Theme`, gave you the setup this page builds on. Here, the focus shifts to `Notifier` so you can place the next Stackpress surface in the course path.

## 156.1. Use Case

Users need feedback when something happens. A notifier is the app's short message channel for saves, validation failures, redirects, and client-side actions.

## 156.2. Show A Message

Use `notify()` in a browser-safe component:

```tsx
import { notify } from 'stackpress/view/client';

export function Body() {
  return (
    <button
      type="button"
      onClick={() => notify('Saved changes')}
    >
      Save
    </button>
  );
}
```

Make sure the page layout includes the notifier container or a standard layout that provides notification support. The same idea shows up through inspectable project surfaces.

## 156.3. Trigger From Handler

The client component pushed a notification into the notifier layer. The layout or notifier container is responsible for rendering it.

## 156.4. Render In View

This part of the Notifier workflow is easier to follow when the smaller pieces are compared together. The subsections cover Notification, Flash Message, Response Error, so the reader can see how each piece changes the local decision.

### 156.4.1. Notification

A notification is a short user-facing message. Use it for outcomes the user should see immediately.

### 156.4.2. Flash Message

A flash message is session-backed feedback that survives a redirect. It is useful after form submissions.

### 156.4.3. Response Error

Response errors can also become visible feedback when the view layer reads the response and renders notification state. The nearby check shows the project-level consequence.

## 156.5. Mistakes To Avoid

Notifier mistakes usually make feedback vague, stale, or disconnected from the action that caused it. A good notification tells the user what happened and what they can do next.

### 156.5.1. Show A Generic Success Message

```ts
notifier.success('Done.');
```

This confirms that something happened, but not what changed. Use a short, specific message after an action completes, such as `Profile saved.` or `Invite sent.`.

### 156.5.2. Hide The Failed Field

```ts
notifier.error('Invalid input.');
```

This makes the user search for the problem. If validation fails, show the field or action that failed so the next step is obvious.

### 156.5.3. Leave Old Notifications On Screen

```ts
notifier.success('Saved.');
notifier.error('Email is required.');
```

Old messages can contradict new state when a user retries the same flow. Use notifier helpers to clear stale messages before showing the next result when the flow needs only one current message.

## 156.6. Reference Pointers

You do not need the full reference yet. For Notifier, focus on recognizing the pattern and knowing where to look next.

**Next step:** Read `633 Flash Messages` later for redirect-safe feedback. For notifier exports, use [View Client API](/reference/view-client). It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `160 Debugging And Inspection`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
