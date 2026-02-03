//modules
import type { Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
//schema
import type Schema from '../../../schema/Schema.js';
import type Model from '../../../schema/model/Model.js';

export default function createView(directory: Directory, _schema: Schema, model: Model) {
  const file = `${model.name.toString()}/admin/views/create.tsx`;
  const source = directory.createSourceFile(file, '', { overwrite: true });
  //import 'frui/frui.css';
  //import 'stackpress/fouc.css';

  //import type { NestedObject, ServerPageProps } from 'stackpress/view/client';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'NestedObject', 'ServerPageProps' ]
  });
  //import type { AdminConfigProps } from 'stackpress/admin/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'stackpress/admin/types',
    namedImports: [ 'AdminConfigProps' ]
  });
  //import type { ProfileInput, Profile } from '../../types.js';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../../types.js',
    namedImports: [ `${model.name.titleCase}Input`, model.name.titleCase ]
  });
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Button from 'frui/Button';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/Button',
    defaultImport: 'Button'
  });
  //import { useServer, Crumbs, LayoutAdmin } from 'stackpress/view/client';
  source.addImportDeclaration({
    moduleSpecifier: 'stackpress/view/client',
    namedImports: [ 'useServer', 'Crumbs', 'LayoutAdmin' ]
  });
  //import { ActiveFieldControl } from '../../components/fields/ActiveField.js';
  model.component.formFields.forEach(column => {
    //skip if no component
    const field = column.component.formField;
    if (!field) return;
    if (field.name === 'Fieldset') {
      //import { ActiveFieldsetControl } from '../../components/fields/ActiveField.js';
      source.addImportDeclaration({
        moduleSpecifier: `../../components/fields/${column.name.titleCase}Field.js`,
        namedImports: [ `${column.name.titleCase}FieldsetControl` ]
      });
      return;
    }
    source.addImportDeclaration({
      moduleSpecifier: `../../components/fields/${column.name.titleCase}Field.js`,
      namedImports: [ `${column.name.titleCase}FieldControl` ]
    });
  });
  
  //export function AdminProfileCreateCrumbs() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}CreateCrumbs`,
    statements: (`
      //hooks
      const { _ } = useLanguage();
      //variables
      const crumbs = [
        {
          label: (<span className="admin-crumb">{_('${model.name.plural}')}</span>),
          icon: 'user',
          href: 'search'
        },
        {
          label: _('Create'),
          icon: 'plus'
        }
      ];
      return (<Crumbs crumbs={crumbs} />);
    `)
  });
  //export function AdminProfileCreateForm() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}CreateForm`,
    parameters: [{ 
      name: 'props', 
      type: `{ 
        input: Partial<${model.name.titleCase}Input>, 
        errors: NestedObject<string | string[]> 
      }` 
    }],
    statements: (`
      const { input, errors } = props;
      const { _ } = useLanguage();
      return (
        <form method="post">
          ${model.component.formFields.toArray().map(column => {
            const attribute = column.component.formField!;
            const component = attribute.component.definition!;
            if (component.name === 'Fieldset') {
              return (`
                <${column.name.titleCase}FieldsetControl 
                  className="control"
                  name="${column.name.toString()}"
                  value={input['${column.name.toString()}']} 
                  errors={errors['${column.name.toString()}']} 
                />
              `);
            }
            return (`
              <${column.name.titleCase}FieldControl 
                className="control"
                name="${column.name.toString()}${column.type.multiple ? '[]' : ''}"
                value={input['${column.name.toString()}']} 
                error={errors.${column.name.toString()}?.toString()} 
              />
            `);
          }).join('\n')}
          <Button className="submit" type="submit">
            <i className="icon fas fa-fw fa-save"></i>
            {_('Save')}
          </Button>
        </form>
      ); 
    `)
  });
  //export function AdminProfileCreateBody() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}CreateBody`,
    statements: (`
      const { request, response } = useServer<${[
        'AdminConfigProps', 
        `Partial<${model.name.titleCase}Input>`,
        model.name.titleCase
      ].join(', ')}>();
      const input = { ...response.results, ...request.data() };
      const errors = response.errors();
      //render
      return (
        <main className="admin-page admin-form-page">
          <div className="admin-crumbs">
            <Admin${model.name.titleCase}CreateCrumbs />
          </div>
          <div className="admin-form">
            <Admin${model.name.titleCase}CreateForm errors={errors} input={input} />
          </div>
        </main>
      );
    `)
  });
  //export function AdminProfileCreateHead() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}CreateHead`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      const { data, styles = [] } = props;
      const { favicon = '/favicon.ico' } = data?.brand || {};
      const { _ } = useLanguage();
      const mimetype = favicon.endsWith('.png')
        ? 'image/png'
        : favicon.endsWith('.svg')
        ? 'image/svg+xml'
        : 'image/x-icon';
      return (
        <>
          <title>{_('Create ${model.name.singular}')}</title>
          {favicon && <link rel="icon" type={mimetype} href={favicon} />}
          <link rel="stylesheet" type="text/css" href="/styles/global.css" />
          {styles.map((href, index) => (
            <link key={index} rel="stylesheet" type="text/css" href={href} />
          ))}
        </>
      );  
    `)
  });
  //export function AdminProfileCreatePage() {}
  source.addFunction({
    isExported: true,
    name: `Admin${model.name.titleCase}CreatePage`,
    parameters: [{ 
      name: 'props', 
      type: 'ServerPageProps<AdminConfigProps>'
    }],
    statements: (`
      return (
        <LayoutAdmin {...props}>
          <Admin${model.name.titleCase}CreateBody />
        </LayoutAdmin>
      );  
    `)
  });
  //export const Head = AdminProfileCreateHead;
  source.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'Head',
      initializer: `Admin${model.name.titleCase}CreateHead`
    }]
  });
  //export default AdminProfileCreatePage;
  source.addStatements(`export default Admin${model.name.titleCase}CreatePage;`);
}
