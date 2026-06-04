import { specPath } from '../app/helpers.js';

export const title = 'Understand the model before the details.';
export const description =
  'Concept pages group the Stackpress mental model so readers can choose the next idea without scanning a long flat list.';

export const docs = [
  {
    href: '/concepts/overview',
    label: 'Overview',
    file: specPath('concepts', 'overview.md'),
    description: 'The shortest explanation of what Stackpress optimizes for.'
  },
  {
    href: '/concepts/architecture',
    label: 'Architecture',
    file: specPath('concepts', 'architecture.md'),
    description: 'How framework packages and supporting libraries fit together.'
  },
  {
    href: '/concepts/idea-files',
    label: 'Idea Files',
    file: specPath('concepts', 'idea-files.md'),
    description: 'The schema-first authoring surface and source of truth.'
  },
  {
    href: '/concepts/schema-and-generation',
    label: 'Schema And Generation',
    file: specPath('concepts', 'schema-and-generation.md'),
    description: 'How specs become generated output.'
  },
  {
    href: '/concepts/plugin-system',
    label: 'Plugin System',
    file: specPath('concepts', 'plugin-system.md'),
    description: 'How app behavior stays separated through lifecycle hooks.'
  },
  {
    href: '/concepts/view-and-client',
    label: 'View And Client',
    file: specPath('concepts', 'view-and-client.md'),
    description: 'How Reactus-backed pages and generated client output work.'
  },
  {
    href: '/concepts/generated-artifacts',
    label: 'Generated Artifacts',
    file: specPath('concepts', 'generated-artifacts.md'),
    description: 'What is disposable, inspectable, and safe to rebuild.'
  },
  {
    href: '/concepts/glossary',
    label: 'Glossary',
    file: specPath('concepts', 'glossary.md'),
    description: 'Common Stackpress terms in one place.'
  }
];

export const nav = [
  {
    label: 'Understand Stackpress',
    items: docs.map(({ href, label }) => ({ href, label }))
  }
];
