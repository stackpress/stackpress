# Start Here

This tutorial track is the main onboarding path for a developer consuming Stackpress from npm. It builds one project progressively from an empty folder into a small article app with routes, React views, schema generation, database population, and rendered data.

Every tutorial in this folder uses the same sequence:

1. overview of what will be done
2. setting up / coding
3. viewing results
4. what was learned

Each step also grows four layers together:

 - the code
 - the config
 - the plugin list
 - the `package.json` scripts

One important rule stays consistent across the whole track: `package.json` changes come last in the setup flow. You create the new files first, then register them.

## Tutorial Order

1. [Hello World Route](./01-hello-world-route.md)
2. [First React Page](./02-first-react-page.md)
3. [First Project Shape](./03-first-project-shape.md)
4. [First Schema Generation](./04-first-schema-generation.md)
5. [First Database And Populate](./05-first-database-and-populate.md)
6. [Render Article Data](./06-render-article-data.md)

## What You Build By The End

By the final tutorial, you will have:

 - a plugin-driven Stackpress app
 - a React-rendered page
 - a `config.ts` bootstrap file
 - an `Article` model in `schema.idea`
 - generated schema output
 - a store plugin and populated article data
 - article data rendered into the page

Use the broader guides in `../` after this sequence when you want operational help, debugging help, or deeper explanations of specific framework areas.
