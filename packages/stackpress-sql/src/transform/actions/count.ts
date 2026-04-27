//modules
import type { ClassDeclaration } from 'ts-morph';
import { Scope } from 'ts-morph';

export default function generate(definition: ClassDeclaration) {
  //public async count(query: StoreSelectFilters & { columns?: string[] }) {}
  definition.addMethod({
    scope: Scope.Public,
    isAsync: true,
    name: 'count',
    parameters: [{
      name: 'query',
      type: `StoreSelectFilters & { columns?: string[] }`
    }],
    statements: TEMPLATE.COUNT
  });
};

export const TEMPLATE = {

//public async count(query: StoreSelectFilters & { columns?: string[] }) {}
COUNT:
`const { q, columns, eq, ne, ge, le, has, like, hasnt } = query;
const count = this.store.select<{ total: number }>(
  { q, columns, eq, ne, ge, le, has, like, hasnt, take: 0 }
);
count.engine = this.engine;
const results = await count.select('COUNT(*) AS total');
return results?.[0]?.total || 0;`

};