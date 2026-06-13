//client
import type { NavGroup, ShelfCard } from './types.js';

// DocsProgressLevel is the numeric guide tier used by cards and navigation.
export type DocsProgressLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type DocsLevelMeta = {
  badge: string;
  description: string;
  href: string;
  label: string;
  level: DocsProgressLevel;
  number: string;
};

const defaultProgressLevel: DocsProgressLevel = 1;

const levels: DocsLevelMeta[] = [
  {
    badge: 'Visitor',
    description: 'Orientation, setup, first route, first view, and debugging.',
    href: '/guides/100-develop',
    label: 'Develop',
    level: 1,
    number: '100'
  },
  {
    badge: 'Junior',
    description: 'Schema generation, first database, stores, and query shape.',
    href: '/guides/200-data',
    label: 'Data',
    level: 2,
    number: '200'
  },
  {
    badge: 'Backend',
    description: 'Idea modeling, generated output, and source declarations.',
    href: '/guides/300-idea',
    label: 'Idea',
    level: 3,
    number: '300'
  },
  {
    badge: 'Builder',
    description: 'Build output, deployment checks, and app packaging.',
    href: '/guides/400-build-and-deploy',
    label: 'Build',
    level: 4,
    number: '400'
  },
  {
    badge: 'DevOps',
    description: 'Project structure, config splitting, and deploy-friendly layout.',
    href: '/guides/500-project-structure',
    label: 'Structure',
    level: 5,
    number: '500'
  },
  {
    badge: 'Senior',
    description: 'Built-in auth, sessions, roles, CSRF, OAuth, and APIs.',
    href: '/guides/600-built-ins',
    label: 'Built-ins',
    level: 6,
    number: '600'
  },
  {
    badge: 'Architect',
    description: 'Studio-style exploration, relations, and source-backed workbenches.',
    href: '/guides/700-studio',
    label: 'Studio',
    level: 7,
    number: '700'
  },
  {
    badge: 'Legend',
    description: 'AI workflows, agent context, MCP integration, and automation.',
    href: '/guides/800-ai',
    label: 'AI',
    level: 8,
    number: '800'
  }
];

/**
 * Returns the progressive guide tier represented by a guide URL.
 */
export function getGuideLevel(href: string): DocsProgressLevel {
  const match = /^\/guides\/(\d)\d{2}/.exec(href);
  if (!match) return defaultProgressLevel;
  const level = Number(match[1]);
  return Math.max(1, Math.min(8, level)) as DocsProgressLevel;
}

/**
 * Returns all home guide cards in high-to-low order plus orientation.
 */
export function getHomeCards(): ShelfCard[] {
  return [
    ...[...levels].reverse().map(item => ({
      description: item.description,
      href: item.href,
      label: `${item.number} ${item.label}`,
      level: item.level
    })),
    {
      description: 'Course path, framework framing, and first app setup.',
      href: '/guides/000-orientation',
      label: '000 Orientation',
      level: 1
    }
  ];
}

/**
 * Adds guide levels to shelf cards and sorts them from highest to lowest.
 */
export function withCardLevels(cards: ShelfCard[]) {
  return [...cards]
    .map(card => ({ ...card, level: getGuideLevel(card.href) }))
    .sort((a, b) => (b.level || 1) - (a.level || 1));
}

/**
 * Adds guide levels to nav groups and sorts groups from highest to lowest.
 */
export function withNavLevels(groups: NavGroup[]) {
  return groups
    .map(group => {
      const items = group.items
        .map(item => ({ ...item, level: getGuideLevel(item.href) }))
        .sort((a, b) => (b.level || 1) - (a.level || 1));
      const level = Math.max(...items.map(item => item.level || 1));
      return { ...group, items, level };
    })
    .sort((a, b) => (b.level || 1) - (a.level || 1));
}
