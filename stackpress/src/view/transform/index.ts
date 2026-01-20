//root
import type { IdeaPluginWithProject } from '../../types/index.js';
//schema
import Registry from '../../schema/Registry.js';
//local
import generateViews from './view.js';
import generateFields from './form.js';
import generateFilters from './filter.js';
import generateLists from './list.js';
import generateSpans from './span.js';

/**
 * Client File Structure
 * - profile/
 * | - components/
 * | | - filter/
 * | | - form/
 * | | - list/
 * | | - span/
 * | | - view/
 */

/**
 * TODO: Things to consider:
 *  - Links
 *  - Dropdowns (Select, Country, Currency)
 *  - Relations
 *  - Spans
 */

/**
 * This is the The params comes form the cli
 */
export default async function generate(props: IdeaPluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { schema, project } = props;
  const registry = new Registry(schema);

  //-----------------------------//
  // 2. Generators
  // - profile/components/form/
  generateFields(project, registry);
  // - profile/components/filter/
  generateFilters(project, registry);
  // - profile/components/list/
  generateLists(project, registry);
  // - profile/components/span/
  generateSpans(project, registry);
  // - profile/components/view/
  generateViews(project, registry);
};