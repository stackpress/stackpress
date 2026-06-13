# `Attribute`

`Attribute` represents one annotation from Idea source, such as `@label(...)`,
`@id`, `@field.string`, or `@is.required(...)`.

## Import

```ts
import { Attribute } from 'stackpress/schema';
```

## Instantiation

Create an attribute with a name and either args or a boolean flag.

```ts
const label = new Attribute('label', [ 'Title' ]);
const id = new Attribute('id', true);
```

The first example is a method-style attribute with arguments. The second is a
flag-style attribute.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `name` | `string` | Attribute name. |
| `enabled` | `boolean` | Whether the attribute is enabled. |
| `assertion` | `AttributeAssertion` | Assertion helper. |
| `component` | `AttributeComponent` | Component helper. |
| `reference` | `AttributeReference` | Relation/reference helper. |
| `args` | `Data[]` | Positional argument values. |
| `isFlag` | `boolean` | True when the attribute was created as a flag. |
| `isMethod` | `boolean` | True when the attribute has method-style args. |
| `value` | `Data` | First argument value for method attributes. |

## Example

```ts
const attribute = column.attribute('label');

if (attribute?.isMethod) {
  console.log(attribute.value);
}
```

This example checks that the attribute has arguments before reading its first
value. Flag attributes such as `@id` do not carry the same method-style value.

## Related

 - [Column](./Column.md)
 - [Fieldset](./Fieldset.md)
