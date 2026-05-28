---
title: tsc and Babel
date: 2020-12-19
description: A summary of the roles of tsc and Babel when transpiling TypeScript.
tags: ['TypeScript']
---

## Introduction

There are two main ways to transpile TypeScript: tsc and Babel. Here is a summary of the differences between these tools.
(When using webpack, there is also ts-loader, but we'll focus on tsc and Babel here.)

## tsc

tsc is the official TypeScript transpiler provided by the TypeScript team. It converts TypeScript source code into JavaScript. tsc supports transpiling to older JavaScript using the `target` option in `tsconfig.json`. For example, setting `"target": "es5"` transpiles TypeScript code into JavaScript syntax that works in IE11 and similar browsers.

However, there is an important thing to note. tsc only transpiles **JavaScript syntax**. Let's look at a concrete example — the `index.js` output from transpiling `index.ts`:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "ES2015"
    ]
  }
}

// index.ts
const fetchNumber = (): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    resolve(1);
  });
};

// index.js
var fetchNumber = function () {
    return new Promise(function (resolve, reject) {
        resolve(1);
    });
};
```

Arrow functions `() => {}` are syntax introduced in ES2015, so they can't be used in IE11. tsc converts them to the ES5 format `function() {}`. However, `Promise` remains unchanged. `Promise` was also introduced in ES2015, so this code won't run in IE11 as is.

As mentioned, tsc only transpiles **JavaScript syntax**, and built-in objects like `Promise` are not syntax, so they are not transpiled by tsc.

Babel solves this problem.

## Babel

Babel is a transpiler that converts modern JavaScript (like ES2020) into JavaScript that works in browsers like IE11. In addition to transpiling syntax, it can also do things like removing `test-id` attributes used in tests or removing `console.log` statements in production builds.

### Plugins and presets

When using Babel, you need to understand two concepts: `Plugins` and `Presets`.

`Plugins` are JavaScript programs that define how Babel converts code.
For example, `@babel/plugin-transform-arrow-functions` converts the arrow function syntax `() => {}` (introduced in ES2015) to the ES5 format `function() {}`. When using Babel, you combine multiple plugins to transpile code for your needs.

Transpiling ES2015 syntax to ES5 requires many plugins. Installing and managing them one by one is a lot of work. It would be convenient if they were bundled together in one package.

`Presets` bundle multiple plugins together for a specific purpose. You can define your own presets or install presets made by others. A commonly used preset is `@babel/preset-env`, provided by the official Babel team. It bundles plugins that transpile ES2015+ JavaScript syntax to ES5. You can see all the included plugins at [babel/available-plugins.js at master · babel/babel](https://github.com/babel/babel/blob/master/packages/babel-preset-env/src/available-plugins.js).

### Transpiling TypeScript with Babel

Let's actually transpile the TypeScript code from before using Babel into code that works in IE11.

First, install the necessary packages:

- @babel/cli: Babel CLI tool
- @babel/core: Babel core
- @babel/preset-env: Transpiles JavaScript syntax and injects polyfills like Promise
- @babel/preset-typescript: Transpiles TypeScript
- core-js@3: Module that defines polyfills like Promise

```bash
# Install Babel and related presets
$ yarn add -D @babel/cli @babel/core @babel/preset-env @babel/preset-typescript
$ yarn add core-js@3
```

The Babel configuration file looks like this:

```json
// babel.config.json
{
  "presets": [
    [
      "@babel/preset-typescript",
      "@babel/preset-env",
      {
        "targets": {
          "ie": "11"
        },
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

The transpilation flow is: TypeScript → @babel/preset-typescript → @babel/preset-env → JavaScript.
Unlike tsc, setting `"useBuiltIns": "usage"` makes Babel automatically inject the polyfills needed to run in the browsers specified by the `targets` option.

Let's run the transpilation on `index.ts` and check the output JavaScript:

```javascript
// src/index.js
"use strict";

require("core-js/modules/ES2015.promise.js");

require("core-js/modules/ES2015.object.to-string.js");

var fetchNumber = function fetchNumber() {
  return new Promise(function (resolve, reject) {
    resolve(1);
  });
};
```

Unlike tsc, the `Promise` polyfill is loaded as a separate module. This shows how Babel allows more flexible transpilation.

Note: the polyfills are loaded using `require` (CommonJS Module format), so this code cannot run directly in a browser. You need a module bundler like webpack to resolve these module imports.

### Notes on @babel/preset-typescript

There are a few important things to know when using @babel/preset-typescript.

#### Type checking

One thing to note is that type checking is not performed. Babel only strips the TypeScript types and transpiles to JavaScript, so even if there are type errors, transpilation will succeed.

```typescript
// src/index.ts
const n: number = "hello";
```

Running this code with tsc and Babel shows that Babel transpiles successfully without a type error. This means you lose the main benefit of using TypeScript.

```bash
# tsc fails transpilation due to type error
$ tsc src/index.ts
src/test.ts:1:7 - error TS2322: Type 'string' is not assignable to type 'number'.

1 const n: number = "test"
        ~
Found 1 error.

# Babel doesn't do type checking, so transpilation succeeds
$ yarn babel src/index.ts
(# omitted)
✨  Done in 0.54s.
```

Therefore, when transpiling with Babel, you need to run type checking separately with tsc beforehand.

```bash
$ tsc --noEmit src/index.ts && babel src/index.ts
src/test.ts:1:7 - error TS2322: Type 'string' is not assignable to type 'number'.
```

#### Some features are not supported

Some TypeScript features like `const enums` and decorators cannot be transpiled correctly. This isn't always a blocking issue, but it can be important depending on your project. It's important to be aware of these limitations.
For details, see [Choosing between Babel and TypeScript](https://blog.logrocket.com/choosing-between-babel-and-typescript-4ed1ad563e41/).

## Conclusion

This article summarized the differences between tsc and Babel through the lens of transpiling TypeScript using `@babel/preset-typescript`. Files output by Babel include module imports, so you need webpack to resolve those modules. When using webpack, you can also use `ts-loader` to transpile TypeScript. I'd like to cover that topic in a separate article.

## References

- [TypeScript: TSConfig Reference - Docs on every TSConfig option](https://www.typescriptlang.org/tsconfig#target)
- [@babel/preset-env · Babel](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)
- [TypeScript and Babel 7 | TypeScript](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/)
- [Choosing between Babel and TypeScript](https://blog.logrocket.com/choosing-between-babel-and-typescript-4ed1ad563e41/)
