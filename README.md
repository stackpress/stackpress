# Stackpress

Stackpress is a content management framework. It combines several open 
source projects maintained by the Stackpress Team.

 - [Idea](https://github.com/stackpress/idea)
 - [Ingest](https://github.com/stackpress/ingest)
 - [Inquire](https://github.com/stackpress/inquire)
 - [Reactus](https://github.com/stackpress/reactus)

# Features 

The goal of Stackpress is to build robust apps in days, not months.

 - Admin Generator
 - React Template Engine
 - Built-in SQL tools
 - Built-in User, Auth, Session, API, and Email plugins

## Nuances

Unlike other frameworks, we have chosen the following philosophies.

 - Server Side First
 - TS/ESM/CJS
 - Server/less framework
 - Unopinionated
 - Event Driven
 - Plugggable Design
 - Client Generator

## Usage

```js
import { server } from 'stackpress/http'

const app = server()

app.get('/', (req, res) => {
  const name = req.data.path('name', 'guest')
  res.setBody('text/plain', `Hello ${name}`)
})

app.create().listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

See [Example](https://github.com/stackpress/stackpress/tree/main/example) 
for use case.

## Routing

Stackpress uses several routers for callbacks, lazy imports and React 
templates. You can access each router like the following.

```js
//action routing
app.action.get('/home', (req, res, ctx) => {});
//import routing
app.import.get('/home', () => import('./pages/home'));
//view routing (react)
app.view.get('/home', '@/views/home');
```

Like other server frameworks, the following route methods are available.

```js
//common methods
app.connect('/home', action)
app.delete('/home', action)
app.get('/home', action)
app.head('/home', action)
app.options('/home', action)
app.patch('/home', action)
app.post('/home', action)
app.put('/home', action)
app.trace('/home', action)
//any method
app.all('/home', action)
//custom method
app.route('get', '/home')
```

You can let Stackpress infer your action implementation.

```js
//action callback
app.get('/home', (req, res, ctx) => {});
//lazy import action
app.get('/home', () => import('./pages/home'));
//react template
app.get('/home', '@/views/home');
```

You can prioritize routing in the following way where the highest number
calls first.

```js
//first
app.get('/home', action, 100);
//second
app.get('/home', action);
//third
app.get('/home', action);
//fourth
app.get('/home', action, -100);
```

## Events

Routing is built on top of events, a necessity to event driven design.

```js
app.on('email-send', logInDatabase)
app.on('email-send', smtpQueue)
app.on('email-send', updateDatabase)
```

Like routing, you can use action, imports and views.

```js
//action callback
app.action.on('email-send', logInDatabase)
//use a separate file
app.import.on('email-send', () => import('/event/smtp-queue'))
//set the response view
app.view.on('email-send', '@/views/email/success')
```

## Database

A minimal database setup would look like the following.

```js
import path from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { connect } from 'stackpress/pglite'

const db = await connect(async () => {
  return new PGlite(path.resolve(cwd, 'database'))
})

app.register('database', db);
```

Stackpress has support for the following SQL packages.

 - `mysql2`
 - `pg`
 - `pglite`
 - `better-sqlite3`

No matter the SQL package, the query builder is exactly the same. See 
the following example.

```js
const products = await db.select('*').from('products').where('price > %s', 100)
```

You can do a raw query like this as well.

```js
const users = await db.query('SELECT * from users')
```

And you can do transactions like this.

```js
await db.transaction(async () => {
  await db.update('users').set({ age: 100 }).where('age > %s', 100)
})
```

## Plugin

The following is an example of a basic plugin you can create in your 
project or use from a Stackpress project in `node_modules`.

```js
//plugin.ts
import type { Server } from 'stackpress/server'

export default function MyPlugin(app: Server) {
  //start plugging...
  app.on('email-send', logInDatabase)
  app.get('/signin', () => import('/page/signin'))
}
```

While developing a plugin, you can get the project configuration like this.

```js
export default function MyPlugin(app: Server) {
  //get all the config
  const config = app.config()
  //traverse the config
  const cwd = app.config<string>('server', 'cwd')
  //use dot pathing (default production)
  const mode = app.config.path<string>('server.mode', 'production')
}
```

You can register your plugin so other plugins can access like this.

```js
export default function MyPlugin(app: Server) {
  app.register('my-plugin', { foo: 'bar' })
}
```

You can add plugins by manually importing them xor using `package.json`.

```js
{
  "name": "my-project",
  "plugins": [ "./plugin", "stackpress" ],
  "dependencies": {...}
}
```

To load (initialize) plugins you just need to run this code.

```js
await app.bootstrap();
```

Then you can access plugins in your project like this.

```js
const myPlugin = app.plugin('my-plugin')
//or
const myPlugin2 = app.plugin<{ foo: string }>('my-plugin')
```

## Admin

To generate an admin you need to first create a `schema.idea` file in
the root of your project.

```js
model User @label("User" "Users") @template("{{name}}") @icon("user") {
  id   String @label("ID") 
              @id @default("cuid()")
              @list.overflow({ length 10 hellip true })

  name String @label("Name") 
              @searchable
              @field.text
              @is.required
              @list.text @view.text
}
```

Next emit emit following events.

```js
await app.emit('config')
await app.emit('listen')
await app.emit('route')
```

Next export a `const config` in your project root with the following configuration.

```js
export const config = {
  client: {
    //used by `stackpress/client` to `import()` 
    //the generated client code to memory
    module: '.client',
    //where to store the generated client code
    build: path.join(cwd, 'node_modules', '.client'),
    //what tsconfig file to base the typescript compiler on
    tsconfig: path.join(cwd, 'tsconfig.json')
  }
}
```

Then in terminal you can run the following.

```bash
$ npx stackpress index generate
```

This will generate a `.client` folder in `node_modules`. You can check 
the admin by visiting `http://localhost:3000/admin/user/search`. You can 
also access the ORM like the following.

```js
import type { ClientPlugin } from 'stackpress'

const client = app.plugin<ClientPlugin>('client')
const user = await client.model.user.create({ name: 'John Doe' })
```

New events will be available as well.

```js
import type { User } from '.client'

await app.resolve<User>('user-create', { name: 'John Doe' })
```

## Authentication

To use the default authentication, you need to add an `auth` configuration.

```js
app.config.set('auth', {
  //base route for signin, signout, signup pages
  base: '/auth',
  //default roles for new users
  roles: [ 'USER' ],
  //allow signin with username
  username: true,
  //allow signin with email address
  email: true,
  //allow signin with phone number
  phone: true
})
```

Next you need to import the `stackpress.idea` file to your main 
`schema.idea`.

```js
use "stackpress/stackpress.idea"
//your models here...
```

Lastly run the following in terminal.

```bash
$ npx stackpress transform
$ npx stackpress push
```

## Permissions

When you add a `session` configuration, your project will deny access to 
all pages *(blacklist by default)*. You can open/configure route access
by roles using just the configuration.

```js
app.config.set('session', {
  //name of the session cookie
  key: 'session',
  //used to generate the session id
  //also used to encrypt/decrypt data 
  //in the database
  seed: 'ABC123',
  access: {
    //role: permissions
    GUEST: [
      //dev routes
      { method: 'ALL', route: '/@vite/client' },
      { method: 'ALL', route: '/@react-refresh' },
      { method: 'ALL', route: '/@fs/**' },
      { method: 'ALL', route: '/node_modules/**' },
      { method: 'ALL', route: '/__uno.css' },
      { method: 'ALL', route: '/plugins/**' },
      { method: 'ALL', route: '/react.svg' },
      //public routes
      { method: 'GET', route: '/assets/**' },
      { method: 'GET', route: '/client/**' },
      { method: 'GET', route: '/images/**' },
      { method: 'GET', route: '/styles/**' },
      { method: 'GET', route: '/favicon.ico' },
      { method: 'GET', route: '/favicon.png' },
      //page routes
      { method: 'GET', route: '/' },
      { method: 'ALL', route: '/auth/**' },
      { method: 'ALL', route: '/admin/**' },
      { method: 'ALL', route: '/api/**' }
    ]
  }
})
```

By default everyone is a `GUEST` and other role names are arbitrary.