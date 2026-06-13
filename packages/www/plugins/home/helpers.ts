//client
import type { HomeResults } from '../app/types.js';
import { getHomeCards } from '../app/progress.js';
import { docs, readingOrder } from '../guides/manifest.js';

const guideJourney = readingOrder.map(({ href, label, level }) => ({
  href,
  label,
  level
}));

/**
 * Builds the shared home page response payload.
 */
export function getHomeResults(): HomeResults {
  return {
    description:
      'Stackpress is a turn-key app framework with modern routing, react templating, SQL dialects and an admin generator. Go from zero to sixty and 💯 open source.',
    guideCount: docs.length,
    guideJourney,
    paths: getHomeCards(),
    title: 'Full Stack App Framework'
  };
}
