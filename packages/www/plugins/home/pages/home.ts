//modules
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async function HomePage({ req, res, ctx }) {
  res.results({
    title: 'Learn Stackpress by building the first working app.',
    description:
      'A docs-first path for building, understanding, and looking up Stackpress without leaving the repository source of truth.',
    paths: [
      {
        href: '/guides/start',
        label: 'Start Building',
        description: 'Follow the first-success tutorial track.'
      },
      {
        href: '/concepts',
        label: 'Understand Stackpress',
        description: 'Read the framework mental model before the details.'
      },
      {
        href: '/api',
        label: 'Look Up APIs',
        description: 'Find public imports, config, CLI, and module reference.'
      }
    ]
  });
  setViewProps(req, res, ctx);
});
