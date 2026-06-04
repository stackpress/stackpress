import { specPath } from '../app/helpers.js';

export const title = 'Find the public surface fast.';
export const description =
  'API reference pages group public imports, config, CLI, and module surfaces for fast lookup.';

export const docs = [
  {
    href: '/api/package-root',
    label: 'Package Root',
    file: specPath('api', 'index.md'),
    description: 'Core app-facing imports from stackpress.'
  },
  {
    href: '/api/config-reference',
    label: 'Config Reference',
    file: specPath('api', 'config-reference.md'),
    description: 'Configuration shape and build/develop settings.'
  },
  {
    href: '/api/cli-reference',
    label: 'CLI Reference',
    file: specPath('api', 'cli-reference.md'),
    description: 'Build, emit, query, and utility commands.'
  },
  {
    href: '/api/idea-reference',
    label: 'Idea Reference',
    file: specPath('api', 'idea-reference.md'),
    description: 'Idea-file authoring reference.'
  },
  {
    href: '/api/plugin',
    label: 'Plugin',
    file: specPath('api', 'plugin.md'),
    description: 'Plugin lifecycle and extension hooks.'
  },
  {
    href: '/api/server',
    label: 'Server',
    file: specPath('api', 'server.md'),
    description: 'Server construction and runtime events.'
  },
  {
    href: '/api/http',
    label: 'HTTP',
    file: specPath('api', 'http.md'),
    description: 'Request, response, and routing helpers.'
  },
  {
    href: '/api/view',
    label: 'View',
    file: specPath('api', 'view.md'),
    description: 'Reactus-backed view rendering.'
  },
  {
    href: '/api/view-client',
    label: 'View Client',
    file: specPath('api', 'view-client.md'),
    description: 'Browser-facing view helpers.'
  },
  {
    href: '/api/schema',
    label: 'Schema',
    file: specPath('api', 'schema.md'),
    description: 'Columns, models, and generation shape.'
  },
  {
    href: '/api/sql',
    label: 'SQL',
    file: specPath('api', 'sql.md'),
    description: 'Query and dialect tools.'
  },
  {
    href: '/api/session',
    label: 'Session',
    file: specPath('api', 'session.md'),
    description: 'Session package reference.'
  },
  {
    href: '/api/language',
    label: 'Language',
    file: specPath('api', 'language.md'),
    description: 'Language and translation runtime.'
  },
  {
    href: '/api/types',
    label: 'Types',
    file: specPath('api', 'types.md'),
    description: 'Common public types.'
  },
  {
    href: '/api/unocss',
    label: 'UnoCSS',
    file: specPath('api', 'unocss.md'),
    description: 'UnoCSS support.'
  },
  {
    href: '/api/whatwg',
    label: 'WHATWG',
    file: specPath('api', 'whatwg.md'),
    description: 'WHATWG-compatible helpers.'
  },
  {
    href: '/api/lib',
    label: 'Lib',
    file: specPath('api', 'lib.md'),
    description: 'Library primitives.'
  },
  {
    href: '/api/mysql',
    label: 'MySQL',
    file: specPath('api', 'mysql.md'),
    description: 'MySQL dialect reference.'
  },
  {
    href: '/api/pgsql',
    label: 'PostgreSQL',
    file: specPath('api', 'pgsql.md'),
    description: 'PostgreSQL dialect reference.'
  },
  {
    href: '/api/pglite',
    label: 'PGlite',
    file: specPath('api', 'pglite.md'),
    description: 'PGlite dialect reference.'
  },
  {
    href: '/api/sqlite',
    label: 'SQLite',
    file: specPath('api', 'sqlite.md'),
    description: 'SQLite dialect reference.'
  }
];

export const nav = [
  {
    label: 'Most Used',
    items: docs.slice(0, 8).map(({ href, label }) => ({ href, label }))
  },
  {
    label: 'More Reference',
    items: docs.slice(8).map(({ href, label }) => ({ href, label }))
  }
];
