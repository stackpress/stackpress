# 140 Views

Plain responses prove the server works, but apps eventually need pages a user
can read and interact with. Stackpress views connect server-prepared data to
React-rendered output so a route can become a real browser page.

**Previously:** `Terminal Events` showed behavior that can happen outside one
route. Here, the focus shifts back to browser output and the handoff from route
data into a React view.

## 140.1. Why Views Come After Pages

A view is easier to understand after you have seen a route answer a request.
The route chooses what the page needs, and the view decides how that prepared
data should appear to the user.

This order keeps React from hiding the server flow. Before learning layouts and
hooks, you should know which handler prepared the response and where the page
data came from.

## 140.2. The Server-To-View Path

Read the view flow as a handoff. The route receives the request, prepares data
on the response, and then the React view reads those values as props.

The first React page guide uses this route handler:

```ts
import { action } from 'stackpress/server';

export default action(async function HomePage({ res }) {
  res.data.set('user', 'John');
});
```

The handler does not render React itself. It places `user` on `res.data`, which
gives the view layer a named value to pass into the page.

The matching view file receives that value through its page props:

```tsx
type HomePageProps = {
  data: {
    user: string;
  };
};

export default function Home({ data }: HomePageProps) {
  return (
    <main>
      <h1>Hello Stackpress</h1>
      <p>Your first React page is rendering for {data.user}.</p>
    </main>
  );
}
```

This example is the visible side of the handoff. The route placed `user` in
`res.data`, and the view reads `data.user` to render text the browser can show.

## 140.3. What The View Lessons Cover

The view group begins with a first React page. That page teaches the minimum
route-plus-view shape before server props, layouts, language, themes, and
notifications add more behavior.

Each child lesson stays focused on one reason a view needs help. Server props
move data into the page, layouts provide shared structure, language translates
text, themes shape visual values, and notifier behavior surfaces feedback.

## 140.4. How Stackpress Renders Views

Stackpress View configures Reactus as the render engine and assigns
`server.view.render` plus `server.view.engine`. During rendering, the engine
passes data, session, request, and response information into the React page.

In development mode, the view engine builds the page props from response data,
the current session, the request snapshot, and the response status:

```ts
const html = await ctx.view.render(action, {
  data: {...props, ...(res.data() as Record<string, unknown>) },
  session: session.results,
  request: {
    method: req.method,
    mime: req.mimetype,
    data: req.data()
  },
  response: res.toStatusResponse()
});
```

This example is shortened to show the important pieces. The full source also
passes URL parts, headers, and request session data, but the main idea is that
the React page receives a prepared server snapshot rather than reaching back
into the route handler.

That shape matters because a wrong page can be debugged in order. Check the
route registration, then the route handler data, then the view registration,
and finally the React component that receives the props.

## 140.5. How To Read The Group

Start with `141 First React Page` and make sure the page renders before adding
more concepts. Then read `142 Server Props` because data flow is the most
common reason a beginner gets stuck.

After that, read layouts, language, theme, and notifier as focused additions.
Each page explains one support surface without turning the view group into a
full component reference.

**Learning checkpoint:** Before moving on, make sure you can explain the
handoff from route to response data to React view. You should also know that a
view problem is often debugged by checking the server side before the
component.

**Next course:** Continue with `First React Page`. That course renders the
smallest React page from a Stackpress route.
