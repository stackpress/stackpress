# 300 Idea

Learn how Stackpress uses idea files as source input for generated app pieces. Idea files let a project describe models and metadata once, then let Stackpress produce schema, SQL, admin, view, and client output from that source.

**Previously:** The previous course, `JSON Fields`, finished the data level by
showing how flexible database values can be queried safely. This course moves
into idea authoring, where Stackpress starts turning source models into
generated app pieces.

## 300.1. Why Idea Comes Before Build

Idea files are powerful because they describe app structure in a compact form.
They should appear before build and deploy because generation depends on the
models, fields, attributes, and relations declared in `schema.idea`.

By this point, the earlier lessons have made runtime and data work concrete.
The `300` level can now explain `schema.idea` as the source input that later
build and inspection lessons depend on.

## 300.2. The Smallest Anchor

The scaffolded project starts `schema.idea` with a `use` line. A scaffolded app begins the same way, then adds enums, models, fields, attributes, and relations.

```idea
use "stackpress/stackpress.idea"
```

This example imports the built-in Stackpress idea definitions. It is small, but it gives the reader the first anchor: idea files can compose other idea files before they define project-specific models.

## 300.3. The Blueprint Mental Model

Treat an idea file like a blueprint for generated app pieces. The blueprint is not the building, but changing the blueprint is how you ask Stackpress to rebuild parts of the building consistently.

This mental model is useful because it protects generated output from casual edits. When schema, SQL, view, or client output is wrong, the first question is usually what the idea source said.

## 300.4. What This Level Covers

`310 Idea Files` introduces the file shape and composition tools. `320 Modeling` teaches models, fields, enums, types, props, attributes, and relations as product modeling concepts, with the remaining props generator limitation kept local to the props page.

`330 Generation` shows how idea input becomes generated artifacts, and `340 Idea Plugin Authoring` introduces custom generator work. The path moves from authoring to output to advanced extension, while any remaining owner-input needs stay tied to the exact page and behavior they affect.

## 300.5. How To Read This Level

Start with syntax only long enough to read the file comfortably. Then move quickly into modeling because the real skill is turning product language into declarations that Stackpress can generate from.

Use the output pages as inspection guides. They show how to confirm that the idea source created the schema, SQL, view, and client pieces you expected.

**Learning checkpoint:** Before moving on, make sure you can explain `schema.idea` as a source input for generated output. You should also know why the course teaches idea authoring before build, deploy, and project-structure organization.

**Next course:** Continue with `Idea Files`. That course gives the idea-file shape a small source-backed anchor before the detailed syntax pages.
