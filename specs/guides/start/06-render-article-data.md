# 06. Render Article Data

This tutorial closes the onboarding loop by rendering stored article data into the page.

## 1. Overview

In this step you will:

 - update the page route or handler
 - fetch article data
 - render article data inside the React view
 - keep `package.json` unchanged unless the app truly needs a new script

The visible goal is that the page shows real article data from the populated store.

## 2. Setting Up / Coding

Update `plugins/app/pages/home.ts` so it loads article data:

```ts
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async function HomePage({ req, res, ctx }) {
  const articles = await ctx.resolve('article-search', req.data());

  if (articles.code !== 200) {
    return;
  }

  res.results(articles.results || []);
  setViewProps(req, res, ctx);
});
```

Update `plugins/app/views/home.tsx`:

```tsx
type HomePageProps = {
  response: {
    results?: Array<{
      id: string;
      title: string;
      slug: string;
      active: boolean;
    }>;
  };
};

export default function Home({ response }: HomePageProps) {
  const articles = response.results || [];

  return (
    <main>
      <h1>Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            {article.title} ({article.slug})
          </li>
        ))}
      </ul>
    </main>
  );
}
```

The important change is that page data is now passed through `res`, not returned from the page handler. The generated `article-search` event resolves first, then `res.results(...)` makes the rows available as `response.results` in the view props.

`package.json` does not need a new change in this step if the existing `develop` script already works.

## 3. Viewing Results

Run:

```bash
npm run develop
```

Command guide:

 - `npm run develop` starts the same app as before
 - this time the home page handler asks Stackpress to run the generated `article-search` event
 - the page handler then writes those rows into `res`
 - the React view reads those rows from `response.results`

Open the home route. Success means the page renders the populated `Article` row, such as:

 - `Hello World (hello-world)`

## 4. What Was Learned

The full loop now works:

 - plugin boot
 - route and view rendering
 - config-based startup
 - schema generation
 - database creation and population
 - rendered article data

At this point, the app has moved from a route-only demo to a small but real Stackpress project.
