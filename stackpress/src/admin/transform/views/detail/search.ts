//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//stackpress/schema
import type Model from '../../../../schema/Model.js';
import { 
  loadProjectFile, 
  renderCode 
} from '../../../../schema/transform/helpers.js';
//stackpress/admin
import type { Relationship } from '../../types.js';
import { render } from '../../helpers.js';

export default function generate(
  directory: Directory, 
  model: Model, 
  relationship: Relationship
) {
  const ids = model.store.ids.toArray().map(column => column.name);

  const related = model.columns.filter(
    column => Boolean(
      column.type.model 
        && column.store.localRelationship
        && column.store.localRelationship.foreign.type === 2
    )
  ).map(column => column.store.localRelationship!).toArray();
  //NOTE: in related, the local model is the foreign 
  // model, and the foreign model is this model
  const foreignModel = relationship.local.model as Model;
  //relation used for filepaths and function names
  const relatedColumn = relationship.foreign.column;

  const filterable = Boolean(foreignModel.component.listFormats.find(
    column => column.store.filterable
      && relationship.local.key.name.toString() !== column.name.toString()
  ));
  const sortable = Boolean(foreignModel.component.listFormats.find(
    column => column.store.sortable
      && relationship.local.key.name.toString() !== column.name.toString()
  ));

  //------------------------------------------------------------------//
  // Profile/admin/views/Auth/search.tsx

  const filepath = renderCode(
    '<%model%>/admin/views/<%relation%>/search.tsx', 
    {
      model: model.name.toPathName(),
      relation: relationship.foreign.column.name.toString()
    }
  );
  //load file if it exists, if not create it
  const source = loadProjectFile(directory, filepath);

  //------------------------------------------------------------------//
  // Import Modules

  //import type { ChangeEvent, MouseEventHandler, SetStateAction } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'ChangeEvent', 'MouseEventHandler', 'SetStateAction' ]
  });
  //import { useState } from 'react';
  source.addImportDeclaration({
    moduleSpecifier: 'react',
    namedImports: [ 'useState' ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Alert from 'frui/Alert';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Alert',
    defaultImport: 'Alert'
  });
  //import Bread from 'frui/Bread';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Bread',
    defaultImport: 'Bread'
  });
  //import Button from 'frui/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Button',
    defaultImport: 'Button'
  });
  //import Input from 'frui/form/Input';
  if (foreignModel.store.searchables.size > 0) {
    source.addImportDeclaration({
      moduleSpecifier: 'frui/form/Input',
      defaultImport: 'Input'
    });
  }
  //import Pager from 'frui/Pager';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Pager',
    defaultImport: 'Pager'
  });
  //import Table from 'frui/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Table',
    defaultImport: 'Table'
  });
  //import { notify, flash } from 'frui/Notifier';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Notifier',
    namedImports: [ 'notify', 'flash' ]
  });

  //------------------------------------------------------------------//
  // Import Stackpress

  //import type { ServerPageProps, SessionPermission } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'ServerPageProps', 'SessionPermission' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import type { StoreSearchQuery } from 'stackpress/sql/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/sql/types',
    namedImports: [ 'StoreSearchQuery' ]
  });
  //import { paginate, filter, order, useServer, 
  // LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [
      //import filter if there are any filterables
      ...filterable ? [ 'filter' ]: [],
      //import order if there are any sortables
      ...sortable ? [ 'order' ]: [],
      'paginate',
      'useServer',
      'LayoutAdmin'
    ]
  });
  //import { batchAndSend } from 'stackpress/view/import';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/import',
    namedImports: [ 'batchAndSend' ]
  });

  //------------------------------------------------------------------//
  // Import Client

  //import type { ProfileExtended } from '../../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../../types.js',
    namedImports: [ model.name.toTypeName('%sExtended') ]
  });
  //import type { AuthExtended } from '../../../../Auth/types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: foreignModel.name.toPathName('../../../../%s/types.js'),
    namedImports: [ foreignModel.name.toTypeName('%sExtended') ]
  });
  //import CreatedListFormat from '../../../../Auth/components/list/CreatedListFormat.js';
  foreignModel.component.listFormats.toArray().forEach(column => {
    //skip profileId
    if (relationship.local.key.name.toString() === column.name.toString()) {
      return;
    }
    source.addImportDeclaration({
      moduleSpecifier: renderCode('../../../../<%model%>/components/list/<%column%>ListFormat.js', {
        model: foreignModel.name.toPathName(),
        column: column.name.toPathName()
      }),
      defaultImport: column.name.toComponentName('%sListFormat')
    });
  });
  //import { ActiveFilterControl } from '../../../../Auth/components/filter/ActiveFilterField.js';
  foreignModel.component.filterFields.toArray().forEach(column => {
    //skip profileId
    if (relationship.local.key.name.toString() === column.name.toString()) {
      return;
    }
    source.addImportDeclaration({
      moduleSpecifier: renderCode('../../../../<%model%>/components/filter/<%column%>FilterField.js', {
        model: foreignModel.name.toPathName(),
        column: column.name.toPathName()
      }),
      namedImports: [ column.name.toComponentName('%sFilterFieldControl') ]
    });
  });
  //import { ActiveSpanControl } from '../../../../Auth/components/span/ActiveSpanField.js';
  foreignModel.component.spanFields.toArray().forEach(column => {
    source.addImportDeclaration({
      moduleSpecifier: renderCode('../../../../<%model%>/components/span/<%column%>SpanField.js', {
        model: foreignModel.name.toPathName(),
        column: column.name.toPathName()
      }),
      namedImports: [ column.name.toComponentName('%sSpanFieldControl') ]
    });
  });

  //------------------------------------------------------------------//
  // Exports

  //export type AdminProfileAuthSearchCrumbsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchCrumbsProps', {
      model: model.name.toTypeName(),
      relation: relatedColumn.name.toComponentName()
    }),
    type: renderCode(`{ 
      base: string, 
      results: <%type%>, 
      can: (...permits: SessionPermission[]) => boolean 
    }`, { 
      type: model.name.toTypeName('%sExtended')
    })
  });
  //export type AdminProfileAuthSearchTabsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchTabsProps', {
      model: model.name.toTypeName(),
      relation: relatedColumn.name.toComponentName()
    }),
    type: renderCode(TEMPLATE.SEARCH_TABS_PROPS, { 
      type: model.name.toTypeName('%sExtended') 
    }) 
  });
  //export type AdminProfileAuthSearchFiltersProps = {};
  source.addTypeAlias({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchFiltersProps', {
      model: model.name.toTypeName(),
      relation: relatedColumn.name.toComponentName()
    }),
    type: `{ 
      query: StoreSearchQuery, 
      close: MouseEventHandler<HTMLElement> 
    }`
  });
  //export type AdminProfileAuthSearchFormProps = {};
  source.addTypeAlias({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchFormProps', {
      model: model.name.toTypeName(),
      relation: relatedColumn.name.toComponentName()
    }),
    type: renderCode(`{ 
      base: string,
      token: string, 
      results: <%type%>,
      open: (value: SetStateAction<boolean>) => void,
      can: (...permits: SessionPermission[]) => boolean
    }`, { 
      type: model.name.toTypeName('%sExtended')
    })
  });
  //export type AdminProfileAuthSearchResultsProps = {};
  source.addTypeAlias({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchResultsProps', {
      model: model.name.toTypeName(),
      relation: relatedColumn.name.toComponentName()
    }),
    type: `{ 
      base: string,
      query: Partial<StoreSearchQuery>, 
      results: ${foreignModel.name.toTypeName('%sExtended')}[], 
      can: (...permits: SessionPermission[]) => boolean 
    }`
  });
  //export type AdminProfileAuthSearchHeadProps = ServerPageProps<AdminConfigProps>;
  source.addTypeAlias({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchHeadProps', {
      model: model.name.toTypeName(),
      relation: relatedColumn.name.toComponentName()
    }),
    type: 'ServerPageProps<AdminConfigProps>'
  });
  //export type AdminProfileAuthSearchPageProps = ServerPageProps<AdminConfigProps>;
  source.addTypeAlias({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchPageProps', {
      model: model.name.toTypeName(),
      relation: relatedColumn.name.toComponentName()
    }),
    type: 'ServerPageProps<AdminConfigProps>'
  });
  //export function AdminProfileAuthSearchCrumbs() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchCrumbs', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode('<%model%>Admin<%relation%>SearchCrumbsProps', {
        model: model.name.toTypeName(),
        relation: relatedColumn.name.toComponentName()
      })
    }],
    statements: renderCode(TEMPLATE.SEARCH_CRUMBS_BODY, {
      search: {
        label: model.name.plural || model.name.titleCase,
        icon: model.name.icon,
        href: renderCode('`${base}/<%model%>/search`', {
          model: model.name.toURLPath()
        })
      },
      detail: {
        label: render(model, "${results?.%s || ''}"),
        href: renderCode('`${base}/<%model%>/detail/<%ids%>`', {
          model: model.name.toURLPath(),
          ids: ids.map(name => `\${results.${name}}`).join('/')
        })
      },
      relation: {
        label: relatedColumn.attributes.value<string>('label') 
          || foreignModel.name.plural 
          || foreignModel.name.titleCase,
        icon: foreignModel.name.icon
      }
    })
  });
  //export function AdminProfileAuthSearchTabs() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchTabs', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode('<%model%>Admin<%relation%>SearchTabsProps', {
        model: model.name.toTypeName(),
        relation: relatedColumn.name.toComponentName()
      })
    }],
    statements: renderCode(TEMPLATE.SEARCH_TABS, {
      info: renderCode('`${base}/<%model%>/detail/<%ids%>`', {
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/')
      }),
      //where this model is 1, get the many relations...
      related: related.map(related => ({
        label: related.foreign.column.attributes.value<string>('label')
          || related.local.model.name.plural 
          || related.local.model.name.singular
          || related.local.model.name.titleCase,
        link: renderCode('`${base}/<%model%>/detail/<%ids%>/<%relation%>/search`', { 
          model: model.name.toURLPath(),
          ids: ids.map(name => `\${results.${name}}`).join('/'),
          relation: related.foreign.column.name.toURLPath()
        }),
        active: related.foreign.column.name.toString() === relatedColumn.name.toString()
      }))
    })
  });
  //export function AdminProfileAuthSearchFilters() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchFilters', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode('<%model%>Admin<%relation%>SearchFiltersProps', {
        model: model.name.toTypeName(),
        relation: relatedColumn.name.toComponentName()
      })
    }],
    statements: renderCode(TEMPLATE.SEARCH_FILTERS_BODY, {
      fields: foreignModel.columns
        .toArray()
        .filter(column => relationship.local.key.name.toString() !== column.name.toString())
        .map(column => {
          if (column.component.filterField?.component) {
            return renderCode(TEMPLATE.SEARCH_FILTERS_FIELD, {
              component: column.name.toComponentName('%sFilterFieldControl'),
              column: column.name.toString()
            });
          } else if (column.component.spanField?.component) {
            return renderCode(TEMPLATE.SEARCH_FILTERS_FIELD, {
              component: column.name.toComponentName('%sSpanFieldControl'),
              column: column.name.toString()
            });
          }
          return '';
        }).join('\n')
    })
  });
  //export function AdminProfileAuthSearchForm() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchForm', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode('<%model%>Admin<%relation%>SearchFormProps', {
        model: model.name.toTypeName(),
        relation: relatedColumn.name.toComponentName()
      })
    }],
    statements: renderCode(TEMPLATE.SEARCH_FORM_BODY, {
      searchable: foreignModel.store.searchables.size > 0,
      export: renderCode('`${base}/<%model%>/detail/<%ids%>/<%relation%>/export`', {
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/'),
        relation: relatedColumn.name.toURLPath()
      }),
      import: renderCode('`${base}/<%model%>/detail/<%ids%>/<%relation%>/import`', {
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/'),
        relation: relatedColumn.name.toURLPath()
      }),
      create: renderCode('`${base}/<%model%>/detail/<%ids%>/<%relation%>/create`', {
        model: model.name.toURLPath(),
        ids: ids.map(name => `\${results.${name}}`).join('/'),
        relation: relatedColumn.name.toURLPath()
      })
    })
  });
  //export function AdminProfileAuthSearchResults() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchResults', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode('<%model%>Admin<%relation%>SearchResultsProps', {
        model: model.name.toTypeName(),
        relation: relatedColumn.name.toComponentName()
      })
    }],
    statements: renderCode(TEMPLATE.SEARCH_RESULTS_BODY, {
      sortable,
      headers: foreignModel.component.listFormats
        .toArray()
        .filter(column => relationship.local.key.name.toString() !== column.name.toString())
        .map(column => renderCode(
          column.store.sortable 
            ? TEMPLATE.SEARCH_RESULTS_TABLE_HEAD_SORTABLE
            : TEMPLATE.SEARCH_RESULTS_TABLE_HEAD, 
          {
            label: column.name.label,
            column: column.name.toString()
          }
        )
      ).join('\n'),
      columns: foreignModel.component.listFormats
        .toArray()
        .filter(column => relationship.local.key.name.toString() !== column.name.toString())
        .map(column => renderCode(
          column.store.filterable 
            ? TEMPLATE.SEARCH_RESULTS_COLUMN_FILTERABLE
            : TEMPLATE.SEARCH_RESULTS_COLUMN, 
          {
            align: column.store.sortable ? 'right' : 'left',
            column: column.name.toString(),
            required: column.type.required,
            component: column.name.toComponentName('%sListFormat')
          }
        )
      ).join('\n'),
      model: foreignModel.name.toURLPath(),
      ids: foreignModel.store.ids
        .toArray()
        .map(column => column.name)
        .map(name => `\${row.${name}}`)
        .join('/')
    })
  });
  //export function AdminProfileAuthSearchBody() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchBody', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    statements: renderCode(TEMPLATE.SEARCH_BODY, {
      type: {
        model: model.name.toTypeName('%sExtended'),
        foreign: foreignModel.name.toTypeName('%sExtended'),
        column: relatedColumn.name.toString()
      },
      crumbs: renderCode('<%model%>Admin<%relation%>SearchCrumbs', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      }),
      tabs: renderCode('<%model%>Admin<%relation%>SearchTabs', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      }),
      filters: renderCode('<%model%>Admin<%relation%>SearchFilters', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      }),
      form: renderCode('<%model%>Admin<%relation%>SearchForm', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      }),
      results: renderCode('<%model%>Admin<%relation%>SearchResults', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName(),
      })
    })
  });
  //export function AdminProfileAuthSearchHead() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchHead', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode('<%model%>Admin<%relation%>SearchHeadProps', {
        model: model.name.toTypeName(),
        relation: relatedColumn.name.toComponentName()
      })
    }],
    statements: renderCode(TEMPLATE.SEARCH_HEAD, { 
      name: model.name.singular,
      relation: relatedColumn.attributes.value<string>('label') 
        || foreignModel.name.plural 
        || foreignModel.name.titleCase
    })
  });
  //export function AdminProfileAuthSearchPage() {}
  source.addFunction({
    isExported: true,
    name: renderCode('<%model%>Admin<%relation%>SearchPage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    }),
    parameters: [{ 
      name: 'props', 
      type: renderCode('<%model%>Admin<%relation%>SearchPageProps', {
        model: model.name.toTypeName(),
        relation: relatedColumn.name.toComponentName()
      })
    }],
    statements: renderCode(TEMPLATE.SEARCH_PAGE, { 
      component: renderCode('<%model%>Admin<%relation%>SearchBody', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName()
      })
    })
  });
  //export const Head = AdminProfileAuthSearchHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: renderCode('<%model%>Admin<%relation%>SearchHead', {
        model: model.name.toComponentName(),
        relation: relatedColumn.name.toComponentName()
      })
    }]
  });
  //export default AdminProfileAuthSearchPage;
  source.addStatements(
    `export default ${renderCode('<%model%>Admin<%relation%>SearchPage', {
      model: model.name.toComponentName(),
      relation: relatedColumn.name.toComponentName()
    })};`
  );
};

//------------------------------------------------------------------//
// Templates

export const TEMPLATE = {

SEARCH_CRUMBS_BODY:
`//props
const { base, can, results } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <Bread crumb={({ active }) => active ? 'font-bold' : 'font-normal'}>
    <Bread.Slicer>
      <i className="icon fas fa-fw fa-chevron-right frui-block frui-tx-md"></i>
    </Bread.Slicer>
    {can({ method: 'GET', route: <%search.href%> }) && (
      <Bread.Crumb 
        icon="<%search.icon%>" 
        className="admin-crumb" 
        href={<%search.href%>}
      >
        {_('<%search.label%>')}
      </Bread.Crumb>
    )}
    {!!results && can({ method: 'GET', route: <%detail.href%> }) && (
      <Bread.Crumb className="admin-crumb" href={<%detail.href%>}>
        {_(\`<%detail.label%>\`)}
      </Bread.Crumb>
    )}
    <Bread.Crumb icon="<%relation.icon%>">
      {_('<%relation.label%>')}
    </Bread.Crumb>
  </Bread>
);`,

SEARCH_TABS_PROPS:
`{
  base: string,
  results: <%type%>,
  can: (...permits: SessionPermission[]) => boolean,
}`,

SEARCH_TABS:
`//props
const { base, results, can } = props;
//hooks
const { _ } = useLanguage();
//render
return (
  <div className="admin-tabs">
    {can({ method: 'GET', route: <%info%> }) && (
      <a href={<%info%>}>{_('Info')}</a>
    )}
    <%#related%>
      <%#active%>
        <span>{_('<%label%>')}</span>
      <%/active%>
      <%^active%>
        {can({ method: 'GET', route: <%link%> }) && (
          <a href={<%link%>}>{_('<%label%>')}</a>
        )}
      <%/active%>
    <%/related%>
  </div>
);`,

SEARCH_FILTERS_FIELD:
`<<%component%> 
  className="control"
  value={query.filter?.<%column%>} 
/>`,

SEARCH_FILTERS_BODY:
`//props
const { query, close } = props;
//hooks
const { _ } = useLanguage();
return (
  <aside>
    <header>
      <i className="icon fas fa-chevron-right" onClick={close}></i>
      {_('Filters')}
    </header>
    <form>
      <%fields%>
      <Button className="submit" type="submit">
        <i className="icon fas fa-fw fa-filter"></i>
        {_('Filter')}
      </Button>
    </form>
  </aside>
);`,

SEARCH_FORM_BODY:
`const { base, token, results, open, can } = props;
const upload = (e: ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  //get the input
  const input = e.currentTarget;
  //get the first file
  const file = input.files?.[0];
  //skip if we can't find the file
  if (!file) return;
  //proceed to send
  batchAndSend('import?json', token, file, notify).then(success => {
    if (success) {
      flash('success', 'File imported successfully');
      window.location.reload();
    }
  });
  return false;
};

return (
  <div className="search">
    <Button
      className="filter" 
      type="button" 
      onClick={() => open((opened: boolean) => !opened)}
    >
      <i className="icon fas fa-fw fa-filter"></i>
    </Button>
    <div className="form">
      <%#searchable%>
        <form>
          <Input className="input" name="q" />
          <Button className="submit" type="submit">
            <i className="icon fas fa-fw fa-search"></i>
          </Button>
        </form>
      <%/searchable%>
    </div>
    {can({ method: 'GET', route: <%export%> }) ?(
      <Button info className="action" href="export">
        <i className="fas fa-download"></i>
      </Button>
    ): null}
    {can({ method: 'GET', route: <%import%> }) ?(
      <Button warning type="button" className="action import">
        <i className="cursor-pointer fas fa-upload"></i>
        <input className="input" type="file" onChange={upload} />
      </Button>
    ): null}
    {can({ method: 'GET', route: <%create%> }) ? (
      <Button success className="action" href="create">
        <i className="fas fa-plus"></i>
      </Button>
    ): null}
  </div>
);`,

SEARCH_RESULTS_TABLE_HEAD_SORTABLE:
`<Table.Head noWrap stickyTop addClassName="results-label sortable">
  <span onClick={() => order('sort[<%column%>]')}>
    {_('<%label%>')}
  </span>
  {!sort.<%column%> ? (
    <i className="icon fas fa-sort"></i>
  ) : null}
  {sort.<%column%> === 'asc' ? (
    <i className="icon fas fa-sort-up"></i>
  ) : null}
  {sort.<%column%> === 'desc' ? (
    <i className="icon fas fa-sort-down"></i>
  ) : null}
</Table.Head>`,

SEARCH_RESULTS_TABLE_HEAD:
`<Table.Head noWrap stickyTop addClassName="results-label">
  {_('<%label%>')}
</Table.Head>`,

SEARCH_RESULTS_COLUMN_FILTERABLE:
`<Table.Col noWrap addClassName="results-value <%align%> filterable">
  <span onClick={() => filter('filter[<%column%>]', row.<%column%>)}>
    <%#required%>
      <<%component%> data={row} value={row.<%column%>} />
    <%/required%>
    <%^required%>
      {row.<%column%> ? (<<%component%> data={row} value={row.<%column%>} />) : ''}
    <%/required%>
  </span>
</Table.Col>`,

SEARCH_RESULTS_COLUMN:
`<Table.Col noWrap addClassName="results-value <%align%>">
  <%#required%>
    <<%component%> data={row} value={row.<%column%>} />
  <%/required%>
  <%^required%>
    {row.<%column%> ? (<<%component%> data={row} value={row.<%column%>} />) : ''}
  <%/required%>
</Table.Col>`,

SEARCH_RESULTS_BODY:
`<%#sortable%>
  const { can, base, query, results } = props;
  const { sort = {} } = query;
<%/sortable%>
<%^sortable%>
  const { can, base, results } = props;
<%/sortable%>
const { _ } = useLanguage();
return (
  <Table
    className="w-full"
    column={[ 'admin-table-odd', 'admin-table-even' ]}
    head="admin-table-head"
  >
    <%headers%>
    <%#ids%>
      <Table.Head stickyTop stickyRight addClassName="results-label" />
    <%/ids%>
    {results.map((row, index) => (
      <Table.Row key={index} index={index}>
        <%columns%>
        <%#ids%>
          <Table.Col stickyRight addClassName="results-value center">
            {can({ method: 'GET', route: \`\${base}/<%model%>/detail/<%ids%>\`}) ? (
              <Button info className="detail" href={\`\${base}/<%model%>/detail/<%ids%>\`}>
                <i className="fas fa-fw fa-caret-right"></i>
              </Button>
            ) : null}
          </Table.Col>
        <%/ids%>
      </Table.Row>
    ))}
  </Table>
);`,

SEARCH_BODY:
`//hooks
const { _ } = useLanguage();
const { 
  config, 
  session, 
  request, 
  response 
} = useServer<
  AdminConfigProps, 
  Partial<StoreSearchQuery>, 
  <%type.model%> & { <%type.column%>: <%type.foreign%>[] }
>();
const [ opened, open ] = useState(false);
//variables
const can = session.can.bind(session);
const base = config.path('admin.base', '/admin');
const query = request.data();
const skip = query.skip || 0;
const take = query.take || 50;
const results = response.results!;
const total = response.total || 0;
//handlers
const page = (skip: number) => paginate('skip', skip);
//render
return (
  <main className="admin-detail-page admin-search-page admin-page">
    <div className="admin-crumbs">
      <<%crumbs%> base={base} can={can} results={results} />
    </div>
    {response.code === 200 ? (
      <>
        <div className={\`admin-filters \${opened? 'open': '' }\`}>
          <<%filters%> query={query} close={() => open(false)} />
        </div>
        <<%tabs%> 
          can={can} 
          base={base} 
          results={results} 
        />
        <div className="admin-tab-body">
          <div className="admin-search-form">
            <<%form%>
              base={base} 
              token={session.data.token} 
              results={results}
              open={open} 
              can={can} 
            />
          </div>
          {!!results?.<%type.column%>.length && (
            <h1 className="admin-search-title">{_(
              'Showing %s - %s of %s',
              (skip + 1).toString(),
              (skip + results.<%type.column%>.length).toString(),
              total.toString()
            )}</h1>
          )}
          <div className="admin-search-results">
            {!results?.<%type.column%>.length ? (
              <div className="admin-no-results">
                <Alert info>
                  <i className="no-results-icon fas fa-fw fa-info-circle"></i>
                  {_('No results found.')}
                </Alert>
              </div>
            ): (
              <<%results%>
                base={base}
                can={can} 
                query={query} 
                results={results.<%type.column%>} 
              />
            )}
          </div>
          {total > take && (
            <div className="admin-pager">
              <Pager 
                className={({ active }) => active 
                  ? 'px-w-32 px-h-32 !font-normal' 
                  : 'px-w-32 px-h-32 theme-info'
                } 
                total={total} 
                skip={skip} 
                take={take}
                radius={3} 
                prev={<i className="fas fa-fw fa-backward theme-1"></i>}
                next={<i className="fas fa-fw fa-forward theme-1"></i>}
                start={<i className="fas fa-fw fa-backward-fast theme-1"></i>}
                end={<i className="fas fa-fw fa-forward-fast theme-1"></i>}
                onUpdate={page}
              />
            </div>
          )}
        </div>
      </>
    ) : response.code === 404 ? (
      <div className="flex-grow">
        <div className="flex flex-col frui-fa-center px-h-100-0">
          <h1 className="px-pb-20 px-fs-20 font-bold">
            {_('Not Found')}
          </h1>
          <p>
            {_('Looks like this page does not exist. Please make sure the URL is correct.')}
          </p>
        </div>
      </div>
    ) : (
      <div className="flex-grow">
        <div className="flex flex-col frui-fa-center px-h-100-0">
          <h1 className="px-pb-20 px-fs-20 font-bold">
            {_('Unknown Error')}
          </h1>
          <p>
            {_('Sorry, something went wrong. Ask an admin to help, then try again later.')}
          </p>
        </div>
      </div>
    )}
  </main>
);`,

SEARCH_HEAD:
`//props
const { data, styles = [] } = props;
//hooks
const { _ } = useLanguage();
//variables
const { favicon = '/favicon.ico' } = data?.brand || {};
const mimetype = favicon.endsWith('.png')
  ? 'image/png'
  : favicon.endsWith('.svg')
  ? 'image/svg+xml'
  : 'image/x-icon';
//render
return (
  <>
    <title>{_('<%name%> <%relation%>')}</title>
    {favicon && <link rel="icon" type={mimetype} href={favicon} />}
    <link rel="stylesheet" type="text/css" href="/styles/global.css" />
    {styles.map((href, index) => (
      <link key={index} rel="stylesheet" type="text/css" href={href} />
    ))}
  </>
);`,

SEARCH_PAGE:
`//render
return (
  <LayoutAdmin {...props}>
    <<%component%> />
  </LayoutAdmin>
);`

};