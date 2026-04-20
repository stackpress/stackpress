//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import { renderCode } from 'stackpress-schema/transform/helpers';

export default function generate(model: Model, definition: ClassDeclaration) {
  //public async findAll(query: StoreSelectQuery) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'findAll',
    parameters: [{
      name: 'query',
      type: `StoreSelectQuery`
    }],
    statements: renderCode(TEMPLATE.FIND_ALL, {
      extended: model.name.toTypeName('%sExtended')
    })
  });
};

export const TEMPLATE = {

//public async findAll(query: StoreSelectQuery) {}
FIND_ALL:
`//extract params
//valid columns:
// - createdAt
// - userProfile.createdAt
// - auth.userProfile.addressLocation:references.googleId
// - userProfile.*
// - *
const { columns = [ '*' ] } = query;
//get all selectors based on the provided columns
//example selector:
// - alias: auth__user_profile__address_location__references__google_id
// - selector: [ auth, user_profile, address_location ]
// - parents: [ auth, user_profile ]
// - navigation: [ auth ]
// - table: user_profile
// - column: address_location
// - json: [ references, googleId ]
// - path: StorePath
const selectors = this.store.selectors(columns);
//now get the select query builder
const select = this.store.select(query, this.engine.dialect.q);
select.engine = this.engine;
//remote call and get the raw results
const results = await select;
//return the formatted and expanded results
return results.map(row => {
  //the nest object will help us make a nested object result set 
  // to return instead of a flat one...
  const nest = new Nest();
  //ex. created_at: "2021-01-01T00:00:00.000Z"
  //ex. user__email_address: "john@doe.com"
  //ex. user__address__street_name: "123 Main St"
  Object.entries(row).forEach(([ alias, value ]) => {
    const selector = selectors.find(selector => selector.alias === alias);
    //if no selector was found
    if (!selector) {
      //we can use heuristics to form the object key path to make 
      // and assign into a nested object, but we wont be able to 
      // unserialize the value without the selector's column 
      // instance, so we'll just return the raw value...
      return nest.withPath.set(
        alias.trim()
          //user__address__street_name -> user.address.street_name
          .replaceAll('__', '.')
          //user.address.street_name -> user.address.streetName
          .replace(
            /([a-z])_([a-z0-9])/ig, 
            (_, a, b) => a + b.toUpperCase()
          ),
        value
      );
    }
    //extract column and store from the selector path
    const { column, store: { columns, relations } } = selector.path;
    //from: auth.userProfile.addressLocation:references.googleId
    //  to: auth.userProfile.addressLocation.references.googleId
    const keys = selector.path.expression.replaceAll(':', '.');
    //if we are here, then a path was found...
    //if column is a store column (as opposed to a relation column)
    if (column in columns) {
      //then we can unserialize the value
      const unserialized = columns[column].unserialize(
        //unknown to any because of the dynamic nature of 
        //the selectors and columns, but it should be correct
        value as any, 
        true
      );
      //add to the nest
      nest.withPath.set(keys, unserialized);
    } else if (column in relations) {
      //then we can unserialize the value
      const unserialized = relations[column].store.unserialize(
        //unknown to any because of the dynamic nature of 
        //the selectors and columns, but it should be correct
        value as Record<string, any>, 
        true
      );
      //add to the nest
      nest.withPath.set(keys, unserialized);
    }
  });
  return nest.get<<%extended%>>();
});`

};