# 844 Scaffold Skill

Use `stackpress-app-scaffold` to create the baseline app files before product-specific schema, generation, or plugin work begins. Scaffolding matters because later phases need a predictable project shape to build on.

**Previously:** The previous course, `App Coordinator Skill`, explained phase sequencing. This course covers the first phase that writes project files.

## 844.1. What The Scaffold Owns

The scaffold skill owns app-level bootstrap only. It copies the baseline template into an empty target folder, applies the required placeholders, renames the scaffold `gitignore` source to `.gitignore`, and stops before installing dependencies or implementing domain logic.

The skill's asset source is `skills/stackpress-app-scaffold/assets/template`. That folder is the reference for the baseline project shape, so the lesson should not invent additional required files outside that scaffold.

## 844.2. The Baseline Files

A scaffolded app should contain the baseline files and folders needed for later phases:

```text
package.json
schema.idea
tsconfig.json
uno.config.ts
config/
plugins/
public/
```

This list describes the starting contract, not the finished product. `schema.idea` can still be a starter schema, and plugin folders can still be thin, because product-specific work belongs to later phases.

## 844.3. Placeholder Replacement

The scaffold skill replaces four known placeholders. These values connect the copied template to the new app identity without changing the meaning of later schema or plugin work.

```text
__STACKPRESS_APP_NAME__
__STACKPRESS_PACKAGE_NAME__
__STACKPRESS_BRAND_NAME__
__STACKPRESS_PORT__
```

After scaffolding, these tokens should not remain in files where replacement was expected. If they do, the scaffold is incomplete and should not be handed to idea authoring yet.

## 844.4. What It Does Not Do

Scaffolding does not run generation, install dependencies, write domain models, or create custom plugin behavior. Those steps need their own source context and verification, so the scaffold skill intentionally stops at the baseline.

This boundary protects junior developers from a common mistake. A scaffold is not a complete app; it is the clean workspace where the complete app can be built.

## 844.5. Mistakes To Avoid

Scaffold mistakes are mostly boundary mistakes. The scaffold should create the
baseline app shape in a clean target, then stop before domain-specific schema,
plugins, or generation work begins.

### 844.5.1. Scaffold Into A Non-Empty Folder

```text
target/
  package.json
  old-plugin.ts
  schema.idea
```

This folder is risky because it already has app-shaped files. Scaffolding into
it can mix old and new output, so the skill should treat the target shape as a
decision that needs confirmation.

### 844.5.2. Add Every Plugin Folder By Default

```text
plugins/
  app/
```

This smaller shape is easier to trust than a scaffold with empty `events`,
`pages`, `views`, and `transform` folders that do not yet have a purpose. Add
specialized plugin folders when the routed feature needs them.

### 844.5.3. Skip Scaffold Evidence

```text
Check: package.json exists, schema.idea exists, config exists, placeholders are replaced.
```

Missing baseline files or unreplaced placeholders should be fixed before later
phases depend on the project. Schema and plugin work are harder to trust when
the project foundation is still uncertain.

**Learning checkpoint:** Before moving on, make sure you can explain what the scaffold skill creates and what it intentionally leaves for later. You should also be able to name the baseline files and the placeholder tokens that need replacement.

**Next course:** Continue with `Idea Authoring Skill`. That course turns the product brief into the `schema.idea` contract after the app folder exists.
