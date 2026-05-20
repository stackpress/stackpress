# Model: Catalog

- Recommended Icon: link
- Singular Label: "Catalog"
- Plural Label: "Catalogs"
- Per Row Display Format: `{{category.name}} - {{article.title}}`
- Primary IDs: `categoryId`, `articleId`

## Properties

The following properties are defined for this model.

### Category ID

Unique generated identifier for the category.

- Property name: `categoryId`
- Property label: "Category ID"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Category is required
- Example: `dz7tg8bcf7e2lig3iuej3pjf`

### Article ID

Unique generated identifier for the article.

- Property name: `articleId`
- Property label: "Article ID"
- Property type: `string`
- Type description: Primitive
- As multiple values (array): No
- Required on creation: Yes
- Max characters: 255
- Assertions: Must be a string; Article is required
- Example: `dz7tg8bcf7e2lig3iuej3pjf`

## Relationships

### category

- Foreign model: `Category`
- Foreign property: `id`
- Local property: `categoryId`
- Cardinality: `N:1`
  - A Catalog must have one Category
  - A Category can have many Catalogs
- Results namespace: `category`

### article

- Foreign model: `Article`
- Foreign property: `id`
- Local property: `articleId`
- Cardinality: `N:1`
  - A Catalog must have one Article
  - An Article can have many Catalogs
- Results namespace: `article`