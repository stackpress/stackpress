# Incept Example

A basic boilerplate for incept.

## Install

Copy `.env.sample` to `./env`, then run the following commands in terminal.

```bash
$ yarn
$ yarn generate
$ yarn push
$ yarn populate
$ yarn develop
```

 - `yarn` - Install node module dependencies
 - `yarn generate` - Generates `@stackpress/.incept` based on `schema.idea`
 - `yarn push` - Creates example database tables
 - `yarn populate` - Populates example database
 - `yarn develop` - Starts the example development server

Goto `http://localhost:3000/auth/signin` and login with `admin/admin`.

## Utilities

The following utilities are available per block and follow a common 
pattern of `yarn [block]:[migrate|test|dev|live] [?event] [...params]`.
The following are example commands.

```bash
$ yarn develop
$ yarn emit
$ yarn generate
$ yarn migrate
$ yarn populate
$ yarn purge
$ yarn push
$ yarn query
$ yarn test
```

### Develop

```bash
$ yarn develop
```

Starts the development server

### Events

```bash
$ yarn emit [event-name] [?data]
```

Emits an event. For example, you can query the profile table 
using the following command.

```bash
$ yarn emit profile-search take=1
```

### Generate

```bash
$ yarn generate
```

Generates client code

### Migrate

```bash
$ yarn migrate
```

Migrate creates a `migrations` folder in the `[block]` folder and 
generates an SQL file based on the `development` database only.

> It does not push these changes to the database.

### Populate

```bash
$ yarn populate
```

Populates database defined in `src/modules/util/populate.ts`

### Purge

```bash
$ yarn purge
```

Purges database.

> Use a combination of purge/populate to reset the data inside the database.

### Push

```bash
$ yarn push
```

Pushes schema changes to the database.

### Query

```bash
$ yarn query [query]
```

Queries the database. For example, you can query the profile table 
using the following command.

```bash
$ yarn query "SELECT * from profile"
```

### Test

```bash
$ yarn test
```

Tests are automatically generated, but you can add special tests in the 
`tests` folder.