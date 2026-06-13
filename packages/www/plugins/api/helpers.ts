//client
import type { DocsPageResults, ShelfResults } from '../app/types.js';
import { readMarkdownDoc } from '../app/helpers.js';
import {
  description,
  docs,
  nav,
  title
} from './manifest.js';
import {
  docs as guideDocs,
  readingOrder as guideReadingOrder
} from '../guides/manifest.js';

const guideJourney = guideReadingOrder.map(({ href, label, level }) => ({
  href,
  label,
  level
}));

/**
 * Builds the shared API index response payload.
 */
export function getApiShelfResults(): ShelfResults {
  return {
    cards: docs.map(({ description, href, label }) => ({
      description,
      href,
      label
    })),
    description,
    eyebrow: 'API reference',
    guideCount: guideDocs.length,
    guideJourney,
    section: 'api',
    title
  };
}

/**
 * Builds a shared API article response payload from its public URL.
 */
export async function getApiDocResults(
  pathname: string
): Promise<DocsPageResults | undefined> {
  const index = docs.findIndex(doc => doc.href === normalizePathname(pathname));
  const item = docs[index];
  if (!item) return undefined;

  const parsed = await readMarkdownDoc(item.file);

  return {
    active: item.href,
    content: parsed.html,
    description: parsed.description || item.description,
    eyebrow: 'API reference',
    guideCount: guideDocs.length,
    guideJourney,
    nav,
    next: docs[index + 1],
    previous: docs[index - 1],
    section: 'api',
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
