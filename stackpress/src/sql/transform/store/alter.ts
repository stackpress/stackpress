//modules
import type { SourceFile, ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(
  source: SourceFile,
  definition: ClassDeclaration
) {
  //import Alter from '@stackpress/inquire/Alter';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/Alter',
    defaultImport: 'Alter'
  });
  //import { jsonCompare } from '@stackpress/inquire/helpers';
  source.addImportDeclaration({
    moduleSpecifier: '@stackpress/inquire/helpers',
    namedImports: [ 'jsonCompare' ]
  });
  //public alter(to?: Create) {}
  definition.addMethod({
    scope: Scope.Public,
    name: 'alter',
    parameters: [
      { name: 'to', type: 'Create', hasQuestionToken: true }
    ],
    statements: TEMPLATE.ALTER
  });
};

export const TEMPLATE = {

ALTER:
`//if no to is provided, return an empty 
// Alter object with the current table name
if (!to) return new Alter(this.table);

//start comparing the current table with the new table
const build = { from: this.create().build(), to: to.build() };
const alter = new Alter(build.from.table);
//remove column if not in the new table
//find fields that exists in both tables
//and check if they are different
for (const name in build.from.fields) {
  if (!build.to.fields[name]) {
    alter.removeField(name);
    continue;
  }
  const from = build.from.fields[name];
  const to = build.to.fields[name];
  //check for differences
  if (from.type !== to.type
    || from.length !== to.length
    || from.nullable !== to.nullable
    || from.default !== to.default
    || from.autoIncrement !== to.autoIncrement
    || from.attribute !== to.attribute
    || from.comment !== to.comment
    || from.unsigned !== to.unsigned
  ) {
    alter.changeField(name, to)
  }
}
//remove primary key if not in the new table
for (const name of build.from.primary) {
  if (!build.to.primary.includes(name)) {
    alter.removePrimaryKey(name);
  }
}
//remove unique key if not in the new table
for (const name in build.from.unique) {
  if (!build.to.unique[name]) {
    alter.removeUniqueKey(name);
    continue;
  }
  //check if the unique key is different
  if (!jsonCompare(build.from.unique[name], build.to.unique[name])) {
    alter.removeUniqueKey(name);
    alter.addUniqueKey(name, build.to.unique[name]);
  }
}
//remove index if not in the new table
for (const name in build.from.keys) {
  if (!build.to.keys[name]) {
    alter.removeKey(name);
    continue;
  }
  //check if the index is different
  if (!jsonCompare(build.from.keys[name], build.to.keys[name])) {
    alter.removeKey(name);
    alter.addKey(name, build.to.keys[name]);
  }
}
//remove foreign key if not in the new table
for (const name in build.from.foreign) {
  if (!build.to.foreign[name]) {
    alter.removeForeignKey(name);
    continue;
  }
  //check if the foreign key is different
  if (!jsonCompare(build.from.foreign[name], build.to.foreign[name])) {
    alter.removeForeignKey(name);
    alter.addForeignKey(name, build.to.foreign[name]);
  }
}
//add field if not in the old table
for (const name in build.to.fields) {
  if (!build.from.fields[name]) {
    alter.addField(name, build.to.fields[name]);
  }
}
//add primary key if not in the old table
for (const name of build.to.primary) {
  if (!build.from.primary.includes(name)) {
    alter.addPrimaryKey(name);
  }
}
//add unique key if not in the old table
for (const name in build.to.unique) {
  if (!build.from.unique[name]) {
    alter.addUniqueKey(name, build.to.unique[name]);
  }
}
//add index if not in the old table
for (const name in build.to.keys) {
  if (!build.from.keys[name]) {
    alter.addKey(name, build.to.keys[name]);
  }
}
//add foreign key if not in the old table
for (const name in build.to.foreign) {
  if (!build.from.foreign[name]) {
    alter.addForeignKey(name, build.to.foreign[name]);
  }
}

return alter;`,

};