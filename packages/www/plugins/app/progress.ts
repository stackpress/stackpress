import type { NavGroup, ShelfCard } from './components/docs.js';

export type DocsProgressLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type DocsLevelMeta = {
  badge: string;
  description: string;
  href: string;
  label: string;
  level: DocsProgressLevel;
  number: string;
};

export type DocsProgressState = {
  completed: string[];
  level: DocsProgressLevel;
  updated?: string;
};

export const progressKey = 'stackpressDocsProgress';
export const themeKey = 'stackpress-docs-theme';
export const defaultProgressLevel: DocsProgressLevel = 1;

export const levels: DocsLevelMeta[] = [
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

export function getGuideLevel(href: string): DocsProgressLevel {
  const match = /^\/guides\/(\d)\d{2}/.exec(href);
  if (!match) return defaultProgressLevel;
  const level = Number(match[1]);
  return Math.max(1, Math.min(8, level)) as DocsProgressLevel;
}

export function getBadge(level: number) {
  return levels.find(item => item.level === level)?.badge || levels[0].badge;
}

export function normalizeProgressState(state: unknown): DocsProgressState {
  const input = state && typeof state === 'object'
    ? state as Partial<DocsProgressState>
    : {};
  const level = Number.isFinite(Number(input.level))
    ? Number(input.level)
    : defaultProgressLevel;
  return {
    completed: Array.isArray(input.completed) ? input.completed : [],
    level: Math.max(1, Math.min(8, level)) as DocsProgressLevel,
    updated: typeof input.updated === 'string' ? input.updated : undefined
  };
}

export function parseProgressState(value: string|string[]|undefined) {
  const source = Array.isArray(value) ? value[0] : value;
  if (!source) return normalizeProgressState(undefined);
  try {
    return normalizeProgressState(JSON.parse(source));
  } catch (_error) {
    return normalizeProgressState(undefined);
  }
}

export function parseTheme(value: string|string[]|undefined) {
  const source = Array.isArray(value) ? value[0] : value;
  return source === 'dark' || source === 'light' ? source : 'light';
}

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

export function withCardLevels(cards: ShelfCard[]) {
  return [...cards]
    .map(card => ({ ...card, level: getGuideLevel(card.href) }))
    .sort((a, b) => (b.level || 1) - (a.level || 1));
}

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
