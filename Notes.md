# Stackpress Notes

The following notes discuss about the technologies used as well as the 
nuances of the project.

 - Stackpress distributables have both CJS and ESM, because it is unclear 
   which one works better depending on the end use case.
 - Because Vite only generates ESM, it's generally better to setup your
   project root as ESM.
 - You can setup your project as CJS, if your project is not using the 
   reactus view engine.
   - You can control the format of the generated `client` using the 
     tsconfig filepath setting in Stackpress
   - In other words, the generated `client` can be in CJS/ESM, but keep 
     in mind that it also produces react views (and Vite requires them 
     to be ESM).
   - If you point the tsconfig filepath setting in Stackpress to ESM,
     you will get an error if you use the `client` in a CJS environment.
 - In either CJS/ESM, you need to bundle `react` and `react-dom` in ESM
   **(somehow)**.

## ESM Mode

To setup a project in ESM, add `"type": "module"` to your `package.json`
and setup your `tsconfig.json` similar to this.

```js
{
  "compilerOptions": {
    /* Module System */

    //allow js files to be imported inside your project
    "allowJs": true,
    //type definitions to use
    "lib": [ "es2022", "dom", "dom.iterable" ],
    //module system for the program (import, require)
    "module": "esnext",
    //makes ESM (import) loose (vs strict)
    "moduleResolution": "bundler",

    /* Developing */
  
    //Fixes import issues with cjs/umd/amd modules
    "esModuleInterop": true,
    //Emit .js files with the JSX changed to _jsx calls 
    //(as opposed to React.createElement) optimized for 
    //production
    "jsx": "react-jsx",
    //do not erase const enum declarations in generated code. 
    "preserveConstEnums": true,
    //allows importing modules with a .json extension
    "resolveJsonModule": true,
    //skip type checking of declaration files.
    "skipLibCheck": true,
    //js strict mode
    "strict": true,

    /* Compiling */
    
    //include `.d.ts` files
    "declaration": true,
    //strips all comments when converting into JavaScript
    "removeComments": true,
    //include `.map` files
    "sourceMap": false,
    //what code will compile to
    "target": "es2022",

    /* Linting */
    
    //report errors on unused local variables.
    "noUnusedLocals": true,
    //report when arguments are unused (prefix _arg to ignore)
    "noUnusedParameters": true
  }
}
```

The following considerations are normally added to ESM builds but, not 
added to the defaults.

 - `moduleDetection`
   - `auto` (default) - TypeScript will not only look for import and 
     export statements, but it will also check whether the "type" field 
     in a package.json is set to "module" when running with module: 
     nodenext or node16, and check whether the current file is a JSX 
     file when running under jsx: react-jsx.
   - `legacy` - The same behavior as 4.6 and prior, usings import and 
     export statements to determine whether a file is a module.
   - `force` - Ensures that every non-declaration file is treated as 
     a module.
 - `isolatedModules` - forbid files without import/export
 - `verbatimModuleSyntax` - any imports or exports without a type 
   modifier are left around. Anything that uses the type modifier 
   is dropped entirely.
 - `noImplicitOverride` - functions which override should include the 
   keyword override

## CJS Mode

To setup a project in CommonJS, remove `"type": "module"` from your 
`package.json` and setup your `tsconfig.json` similar to this.

```js
{
  "compilerOptions": {
    /* Module System */

    //type definitions to use
    "lib": [ "es2021", "es7", "es6", "dom" ],
    //module system for the program (import, require)
    "module": "commonjs",
    
    /* Developing */
    
    //Fixes import issues with cjs/umd/amd modules
    "esModuleInterop": true,
    //Emit .js files with the JSX changed to _jsx calls 
    //(as opposed to React.createElement) optimized for 
    //production
    "jsx": "react-jsx",
    //do not erase const enum declarations in generated code. 
    "preserveConstEnums": true,
    //allows importing modules with a .json extension
    "resolveJsonModule": true,
    //skip type checking of declaration files.
    "skipLibCheck": true,
    //js strict mode
    "strict": true,

    /* Compiling */
    
    //include `.d.ts` files
    "declaration": true,
    //strips all comments when converting into JavaScript
    "removeComments": true,
    //include `.map` files
    "sourceMap": false,
    //what code will compile to
    "target": "es6",

    /* Linting */
    
    //report errors on unused local variables.
    "noUnusedLocals": true
  }
}
```

## React

The official `react` and `react-dom` libraries are written for CJS 
without any real consideration of ESM. This means trying to bundle 
react in a ESM build will throw errors as soon as `require()` is used.

Additionally these libraries doesn't technically have named exports, 
like `exports.useState`. So even if react is bundled separately, 
errors will occur from other files importing named components from 
react like this. 

```js
import { useState } from 'react';
```

## Reactus

Reactus is built around using Vite programmatically to produce react 
templates or "mini apps" and thus follows the laws of Vite very closely.

> There are no ESM/CJS specific settings to determine the output.

## Vite

**Vite only generates ESM.** Even if your project source code is CJS, 
it renders TSX as ESM. There are two phases that need to be considered 
when thinking about ESM/CJS in vite.

 - Development - serves the exact filepaths as ESM
 - Build - builds primarily in ESM

For example, there is a way to build in CJS using the Rollup config in 
Vite, but you still can't get CJS in development, especially when HMR
is considered.

> Vite cannot serve CommonJS during dev/HMR — it’s strictly ESM.

The exact error that will be thrown is `exports is not defined` where
`exports` is CJS and does not exist in an ESM environment.

## Vercel

When using Stackpress with Vercel serverless functions the following 
need to be considered.

 - While Vercel Build Output API v2 still kind of works, Vercel decided
   to remove the documentation for it entirely.
 - The Vercel build service itself has changed overnight.
   - Before the build step was hosted on the same space as the runtime.
     This means you could control how the file structure was created 
     using a custom build step.
   - Now Vercel hosts the build step separate from the where the final 
     code (lambda) lives. We denote the build working directory as 
     `/verce/path1`. 
   - Once your code is pushed and built it copies everything from either 
     the `.vercel` or the `api/` folder (not both) to the lambda without 
     any consideration for other files. We denote the lambda runtime 
     working directory as `/var/task`
   - There is no option to list files to include as well. For example 
     inserting code in `public`, `node_modules`, `.build` won't work.
 - These are the reasons why Vercel Build Output API v3 is recommended.
 - Vercel Build Output API v3 requires crafting each function by hand. 
   Meaning you need to generate the following during build time.
   - `.vercel/output/static` - the public static assets
   - `.vercel/output/config.json` - the old `vercel.json`
   - `.vercel/output/functions/api/[name].func/.vc-config`
   - `.vercel/output/functions/api/[name].func/package.json`
   - `.vercel/output/functions/api/[name].func/node_modules`
   - `.vercel/output/functions/api/[name].func/index.js`
   - `.vercel/output/functions/api/[name].func/[other assets]`
 - It is **highly recommended** to bundle `[name].func/index.js`
   - `[name].func` cannot be larger than 250MB.
   - `[name].func` does not use any `node_modules` outside of itself.
   - Using ESM mode there are more externals that need to be added in 
     your bundler. It is recommended to add externals one at a time 
     versus "all node packages" for example.
   - There is currently an issue with react and react-dom when manually
     bundling to ESM. See [React](#react) section above.
 - Vercel CLI does not provide a command to test custom `.vercel/output`.
   - `vercel dev --prebuilt` was silently deprecated.
 - Vercel still works with both CJS and ESM, but is strict ESM.

# TS-Node and TSX

 - `ts-node` for CJS project source code
   - `node --no-warnings=ExperimentalWarning --experimental-specifier-resolution=node --loader ts-node/esm scripts/develop.ts`
   - has a lot of issues with vite (ESM)
   - `Cannot find module @stackpress/lib/esm/data/map imported from @stackpress/lib/esm/router/Request.js`
   - This is because in ESM you should provide `.js` to every relative file extension.
   - So `ts-node` is stricter with ESM in this regard.
 - `tsx` for ESM project source code
   - solves the `Cannot find module` error compared to `ts-node`.