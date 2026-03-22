//stackpress
import type { IdeaProjectPluginProps } from '../../types.js';
//stackpress/schema
import Schema from '../../schema/Schema.js';
//stackpress/view/transform
import generateViews from './view/index.js';
import generateFields from './form/index.js';
import generateFilters from './filter/index.js';
import generateLists from './list/index.js';
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
export default async function generate(props: IdeaProjectPluginProps) {
  //-----------------------------//
  // 1. Config
  
  const schema = Schema.make(props.schema);
  const directory = props.directory;

  //-----------------------------//
  // 2. Generators
  // - profile/components/form/
  generateFields(directory, schema);
  // - profile/components/filter/
  generateFilters(directory, schema);
  // - profile/components/list/
  generateLists(directory, schema);
  // - profile/components/span/
  generateSpans(directory, schema);
  // - profile/components/view/
  generateViews(directory, schema);
};