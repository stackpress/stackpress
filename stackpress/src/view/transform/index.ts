//root
import type { IdeaPluginWithProject } from '../../types/index.js';
//schema
import Schema from '../../schema/Schema.js';
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
  const { schema: config, project } = props;
  const schema = Schema.make(config);

  //-----------------------------//
  // 2. Generators
  // - profile/components/form/
  generateFields(project, schema);
  // - profile/components/filter/
  generateFilters(project, schema);
  // - profile/components/list/
  generateLists(project, schema);
  // - profile/components/span/
  generateSpans(project, schema);
  // - profile/components/view/
  generateViews(project, schema);
};