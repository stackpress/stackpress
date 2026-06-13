//client
import type { DocsPageResults, ShelfResults } from '../app/types.js';
import { readMarkdownDoc } from '../app/helpers.js';
import { getGuideLevel, withCardLevels, withNavLevels } from '../app/progress.js';
import {
  description,
  docs,
  nav,
  readingOrder,
  title
} from './manifest.js';

const guideJourney = readingOrder.map(({ href, label, level }) => ({
  href,
  label,
  level
}));

/**
 * Builds the shared guide index response payload.
 */
export function getGuideShelfResults(): ShelfResults {
  return {
    cards: withCardLevels(docs.map(({ description, href, label }) => ({
      description,
      href,
      label
    }))),
    description,
    eyebrow: 'Guides',
    guideCount: docs.length,
    guideJourney,
    section: 'guides',
    title
  };
}

/**
 * Builds a shared guide article response payload from its public URL.
 */
export async function getGuideDocResults(
  pathname: string
): Promise<DocsPageResults | undefined> {
  const item = docs.find(doc => doc.href === normalizePathname(pathname));
  if (!item) return undefined;

  // reading order controls pager links independently from sidebar ordering
  const index = readingOrder.findIndex(doc => doc.href === item.href);
  const parsed = await readMarkdownDoc(item.file);

  return {
    active: item.href,
    content: parsed.html,
    description: parsed.description || item.description,
    eyebrow: 'Guides',
    guideCount: docs.length,
    guideJourney,
    guideLevel: getGuideLevel(item.href),
    nav: withNavLevels(nav),
    next: readingOrder[index + 1],
    previous: readingOrder[index - 1],
    section: 'guides',
    title: parsed.title,
    toc: parsed.toc
  };
}

/**
 * Normalizes route paths so dev routes and static paths use one lookup rule.
 */
function normalizePathname(pathname: string) {
  return pathname.replace(/\/$/, '');
}
