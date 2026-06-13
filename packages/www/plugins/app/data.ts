//client
import type { HomeResults } from './types.js';
import { getHomeCards } from './progress.js';

/**
 * Builds the shared home page response payload.
 */
export function getHomeResults(): HomeResults {
  return {
    description:
      'A docs-first path for building, understanding, and looking up '
      + 'Stackpress without leaving the repository source of truth.',
    paths: getHomeCards(),
    title: 'Learn Stackpress by building the first working app.'
  };
}
