# 327 Relations

Relate models by separating the stored key from the object connection. Relations matter because most apps are not just isolated rows; articles have authors, comments belong to articles, and join models connect records that need to be shown together.

**Previously:** The previous course, `Attributes`, covered the metadata families Stackpress gives built-in meaning to. This course applies those ideas to model connections.

## 327.1. The Relation Shape

Canonical Stackpress relation modeling usually pairs a scalar relation key with a relation object field. The scalar key stores the local value, while the relation field describes how that value connects to another model.

```idea
profileId String
          @label("Profile")
          @field.relation({
            id "id"
            search "/admin/profile/search?json&q={{query}}"
            template "{{name}}"
          })
          @is.required("Profile is required")
          @filter.relation({
            id "id"
            search "/admin/profile/search?json&q={{query}}"
            template "{{name}}"
          })
          @list.template({ template "{{profile.name}}" })
          @view.template({ template "{{profile.name}}" })

profile   Profile @relation({ local "profileId" foreign "id" })
```

In this example, `profileId` is the value stored on the current model. The `profile` field is the object connection, and `@relation({ local "profileId" foreign "id" })` tells Stackpress that the local `profileId` points to the related profile's `id`.

## 327.2. Why The UI Metadata Stays On The Key

The scalar key is the field a form edits, filters, lists, and views. That is why the generated UI metadata usually stays on `profileId`, even though the relation object is named `profile`.

`@field.relation(...)` gives the generated form enough information to search for profiles and display names while storing IDs. `@list.template(...)` and `@view.template(...)` let generated views show `profile.name` instead of exposing only the raw ID.

## 327.3. Reverse Lists

Some models expose the other side of a relation as an array. In a scaffolded app, `Profile` is extended with arrays so generated or handwritten code can understand that one profile can have many articles and comments.

```idea
model Profile {
  articles Article[] @label("Articles")
  comments Comment[] @label("Comments")
}
```

This example shows the reverse side as a collection. The array does not replace the scalar key on the child model; it gives the parent model a way to describe related records in the other direction.

## 327.4. Join Models

Many-to-many relationships often need a join-like model with composite identity. A scaffolded app uses `Catalog` to connect `Category` and `Article`.

```idea
model Catalog
  @labels("Catalog" "Catalogs")
  @display("{{category.name}} - {{article.title}}")
  @query("*" "category.*" "article.*" "article.profile.*")
{
  categoryId  String @id
  articleId   String @id

  category    Category @relation({ local "categoryId" foreign "id" })
  article     Article @relation({ local "articleId" foreign "id" })
}
```

This example uses two scalar keys as the identity for the join row. The relation object fields then explain how each key connects to its related model, while `@query(...)` asks generated consumers to load the related category and article data intentionally.

## 327.5. Mistakes To Avoid

Relation mistakes usually come from losing track of which field stores the
value and which field describes the object connection. Keep the scalar key and
relation object visible as separate jobs.

### 327.5.1. Confuse The Key With The Object

```idea
profile Profile
```

This names the related object, but it does not show which local value is
stored. The clearer Stackpress pattern keeps a scalar key such as `profileId`
and a relation object such as `profile` so storage and relation loading are
not mixed together.

### 327.5.2. Put UI Metadata Only On The Object Field

```idea
profile Profile
        @field.relation({ search "/admin/profile/search?json&q={{query}}" })
        @relation({ local "profileId" foreign "id" })
```

Generated forms usually need to edit the scalar key, not the related object
field directly. Put search, template, filter, list, and view metadata where the
generated surface can use it for the stored value.

### 327.5.3. Add Reverse Arrays Without The Forward Relation

```idea
model Profile {
  articles Article[] @label("Articles")
}
```

This reverse list is easier to understand when `Article` also has a clear
`profileId` key and `profile Profile @relation(...)` mapping. Without the
forward relation, the reverse side has no obvious source-backed connection to
inspect.

**Learning checkpoint:** Before moving on, make sure you can explain local fields, foreign fields, scalar relation keys, relation object fields, reverse lists, and join models. You should also be able to explain each line in the `profileId` and `profile` example.

**Next course:** Continue with `Generation`. That course shows how schema decisions flow into generated Stackpress output.
