//root
import type { PluginWithProject } from '@/types';
//schema
import Registry from '@/schema/Registry';
//local
import generateView from './view';
import generateForm from './form';
import generateFilters from './filters';
import generateTable from './table';


/**
 * Client File Structure
 * - profile/
 * | - components/
 * | | - filter.ink
 * | | - form.ink
 * | | - table.ink
 * | | - view.ink
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: PluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { cli, schema, project } = props;
  const registry = new Registry(schema);
  const fs = cli.server.loader.fs;

  //-----------------------------//
  // 2. Generators
  // - profile/components/view.ink
  generateView(project, registry, fs);
  // - profile/components/form.ink
  generateForm(project, registry, fs);
  // - profile/components/filters.ink
  generateFilters(project, registry, fs);
  // - profile/components/table.ink
  generateTable(project, registry, fs);
};