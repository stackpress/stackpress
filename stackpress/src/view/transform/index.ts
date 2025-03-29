//root
import type { IdeaPluginWithProject } from '../../types';
//schema
import Registry from '../../schema/Registry';
//local
import generateViews from './views';
import generateFields from './fields';
import generateFilters from './filters';
import generateLists from './lists';
import generateSpans from './spans';


/**
 * Client File Structure
 * - profile/
 * | - components/
 * | | - filters/
 * | | - fields/
 * | | - lists/
 * | | - spans/
 * | | - views/
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
  // - profile/components/fields/
  generateFields(project, registry);
  // - profile/components/filters/
  generateFilters(project, registry);
  // - profile/components/lists/
  generateLists(project, registry);
  // - profile/components/spans/
  generateSpans(project, registry);
  // - profile/components/views
  generateViews(project, registry);
};