import { specPath } from '../app/helpers.js';

export const title = 'Get from first route to working Stackpress project.';
export const description =
  'Guides organize the hands-on path first, then branch into daily workflows for generation, views, plugins, client usage, and debugging.';

export const docs = [
  {
    href: '/guides/start',
    label: 'Start Tutorial Track',
    file: specPath('guides', 'start', 'README.md'),
    description: 'The recommended first-success tutorial sequence.'
  },
  {
    href: '/guides/start/01-hello-world-route',
    label: 'Hello World Route',
    file: specPath('guides', 'start', '01-hello-world-route.md'),
    description: 'Prove the smallest route works.'
  },
  {
    href: '/guides/start/02-first-react-page',
    label: 'First React Page',
    file: specPath('guides', 'start', '02-first-react-page.md'),
    description: 'Add the view layer.'
  },
  {
    href: '/guides/start/03-first-project-shape',
    label: 'First Project Shape',
    file: specPath('guides', 'start', '03-first-project-shape.md'),
    description: 'Introduce config and plugins.'
  },
  {
    href: '/guides/start/04-first-schema-generation',
    label: 'First Schema Generation',
    file: specPath('guides', 'start', '04-first-schema-generation.md'),
    description: 'Introduce idea files and generated output.'
  },
  {
    href: '/guides/start/05-first-database-and-populate',
    label: 'First Database And Populate',
    file: specPath('guides', 'start', '05-first-database-and-populate.md'),
    description: 'Push schema changes and seed data.'
  },
  {
    href: '/guides/start/06-render-article-data',
    label: 'Render Article Data',
    file: specPath('guides', 'start', '06-render-article-data.md'),
    description: 'Render real data in a page.'
  },
  {
    href: '/guides/getting-started',
    label: 'Getting Started',
    file: specPath('guides', 'getting-started.md'),
    description: 'Orientation before the tutorial track.'
  },
  {
    href: '/guides/project-anatomy',
    label: 'Project Anatomy',
    file: specPath('guides', 'project-anatomy.md'),
    description: 'Understand the project folders.'
  },
  {
    href: '/guides/generate-and-build',
    label: 'Generate And Build',
    file: specPath('guides', 'generate-and-build.md'),
    description: 'Work with generation and build commands.'
  },
  {
    href: '/guides/views-and-pages',
    label: 'Views And Pages',
    file: specPath('guides', 'views-and-pages.md'),
    description: 'Create pages and views.'
  },
  {
    href: '/guides/views',
    label: 'Views Guide Set',
    file: specPath('guides', 'views', 'README.md'),
    description: 'View-layer subguides.'
  },
  {
    href: '/guides/views/layouts',
    label: 'Layouts',
    file: specPath('guides', 'views', 'layouts.md'),
    description: 'Use Stackpress layouts.'
  },
  {
    href: '/guides/views/language-and-translations',
    label: 'Language And Translations',
    file: specPath('guides', 'views', 'language-and-translations.md'),
    description: 'Use the language layer.'
  },
  {
    href: '/guides/views/notifier',
    label: 'Notifier',
    file: specPath('guides', 'views', 'notifier.md'),
    description: 'Display notifications.'
  },
  {
    href: '/guides/using-the-client',
    label: 'Using The Client',
    file: specPath('guides', 'using-the-client.md'),
    description: 'Use generated client output.'
  },
  {
    href: '/guides/plugins-and-customization',
    label: 'Plugins And Customization',
    file: specPath('guides', 'plugins-and-customization.md'),
    description: 'Customize behavior with plugins.'
  },
  {
    href: '/guides/debugging-and-inspection',
    label: 'Debugging And Inspection',
    file: specPath('guides', 'debugging-and-inspection.md'),
    description: 'Inspect failures and generated output.'
  }
];

const tutorial = docs.slice(0, 7);
const workflows = docs.slice(7);

export const nav = [
  {
    label: 'Start Tutorial',
    items: tutorial.map(({ href, label }) => ({ href, label }))
  },
  {
    label: 'Daily Workflows',
    items: workflows.map(({ href, label }) => ({ href, label }))
  }
];
