---
title: TSConfig options added in TypeScript 4.5 and later
date: 2023-12-14
description: I got curious about how many new TSConfig options were added in the past two years. TypeScript 4.5 was released around November 2021, so I looked at all options added since then.
tags: ['TypeScript']
---

This article is the 14th entry in the [TypeScript Advent Calendar](https://qiita.com/advent-calendar/2023/typescript).

## Introduction

`tsconfig.json` has a lot of options. I got curious about how many new ones were added in the past two years.

TypeScript 4.5 was released around November 2021, which is about two years ago, so I looked at all TSConfig options added since TypeScript 4.5.

## List of new options added since version 4.5

| Option | Added in version |
|--|--|
| preserveValueImports | 4.5 |
| moduleSuffixes | 4.7 |
| moduleDetection | 4.7 |
| allowArbitraryExtensions | 5.0 |
| allowImportingTsExtensions | 5.0 |
| customConditions | 5.0 |
| resolvePackageJsonExports | 5.0 |
| resolvePackageJsonImports | 5.0 |
| verbatimModuleSyntax | 5.0 |

## preserveValueImports

This option prevents tsc from removing imports that it considers unused.
This option is now deprecated in version 5.0 because `verbatimModuleSyntax` was added.

### Usage

In the code below, the `eval` function calls the `Animal` class. However, tsc thinks `Animal` is unused and removes the import, causing an error at runtime.

```typescript
import { Animal } from "./animal.js";
eval("console.log(new Animal().isDangerous())");
```

Setting `preserveValueImports` to `true` in `tsconfig.json` prevents unused imports from being removed.

```json
{
  "compilerOptions": {
    "preserveValueImports": true
  }
}
```

## moduleSuffixes

This option defines how file extensions are handled during module resolution.
It is useful when building modules with different file extensions for different environments (for example, browser and Node.js), as it allows the correct file to be resolved for each environment.

For example, if you have different types of modules in your project (like `.browser.ts` and `.node.ts`), `moduleSuffixes` helps resolve them appropriately and keeps your code organized.

### Usage

Specify the extensions to look for when resolving modules, in order. In this example, TypeScript will look for `.browser.ts`, `.node.ts`, and standard `.ts` extensions in that order.

```json
{
  "compilerOptions": {
    "moduleSuffixes": [".browser", ".node", ""]
  }
}
```

With this setting, importing the following will check for `myModule.browser.ts`, then `myModule.node.ts`, then `myModule.ts`:

```typescript
import { myFunction } from "./myModule";
```

## moduleDetection

This option controls whether a file is treated as a module or a script.
It has three values: `auto`, `legacy`, and `force`. The default is `auto`.

TypeScript originally used the presence of `import` or `export` statements to determine if a file was a module. This behavior changed in 4.7, which is why this option was added.

### Usage

With `auto`, TypeScript checks additional conditions beyond just the presence of `import` or `export` to determine if a file is a module.
If `module` is `nodenext` or `node16`, it checks the `type` field in `package.json`.
If `jsx` is `react-jsx`, it checks if the file is a JSX file.

`legacy` behaves the same as TypeScript 4.6 and below. A file is treated as a module if it has `import` or `export` statements, otherwise it is treated as a script.

`force` treats all files except type definition files as modules unconditionally.

```json
{
  "compilerOptions": {
    "moduleDetection": "legacy"
  }
}
```

## allowArbitraryExtensions

This option allows import paths that end with non-standard JavaScript or TypeScript file extensions. When enabled, the TypeScript compiler looks for declaration files corresponding to those non-standard extensions.

For example, if your project uses a bundler to import CSS files directly into TypeScript files, enabling this option prevents TypeScript from throwing an error for non-standard extension imports. Instead, TypeScript will look for a declaration file in the format `{filename}.d.{extension}.ts`, allowing you to write (or generate) type declarations for non-standard files.

### Usage

For example, if you have a CSS file called `button.css`, you can create a declaration file `button.d.css.ts` to declare the types and exports for the CSS file. TypeScript will then correctly interpret the CSS import and allow it to be used in TypeScript code.

This feature is intended to be used with bundlers or other tools that can handle these non-standard imports at runtime. If your runtime or bundler is not configured to handle such imports, enabling this option may cause runtime errors.

```css
/* button.css */
.button {
  color: red;
}
```

```typescript
// button.d.css.ts
declare const css: {
  button: string;
};
export default css;
```

```typescript
// Button.tsx
import styles from "./button.css";

styles.button; // string
```

```json
{
  "compilerOptions": {
    "allowArbitraryExtensions": true
  }  
}
```

## allowImportingTsExtensions

This option allows importing files using TypeScript-specific extensions like `.ts`, `.mts`, or `.tsx`.

Previously, importing a file with a `.ts` extension like `./util.ts` caused an error because the path could not be resolved at the JavaScript runtime.
Enabling this option prevents the error for the following code:

```typescript
// index.ts
import { hello } from './util.ts';
```

### Usage

This option can only be used when `--noEmit` or `--emitDeclarationOnly` is enabled (i.e., when JavaScript files are not being output). This is because outputting import paths with `.ts` extensions as-is in JavaScript would cause runtime resolution errors.

```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

## customConditions

This option allows you to add extra conditions when TypeScript resolves the `exports` or `imports` fields in a package.

### Usage

By specifying multiple conditions in `customConditions`, TypeScript will import the file that matches the condition if it exists in the `exports` or `imports` fields of `package.json`.

In the example below, `foo` is specified as a condition, so `foo.mjs` is loaded.

This field is only effective when `--module` is `node16` or `nodenext` and `--moduleResolution` is `bundler`.

```json
{
  "compilerOptions": {
    "target": "es2022",
    "moduleResolution": "bundler",
    "customConditions": ["foo"]
  }
}
```

```json
// package.json
{
  // ...
  "exports": {
    "./hoge": {
      "foo": "./foo.mjs",
      "node": "./hoge.mjs",
      "import": "./hoge.mjs",
      "require": "./hoge.js"
    }
  }
}
```

## resolvePackageJsonExports

This option controls whether TypeScript references the `exports` field in a package's `package.json` when loading files from `node_modules`.
When enabled, TypeScript uses the `exports` field for module resolution.

This setting defaults to `true` when `--moduleResolution` is `node16`, `nodenext`, or `bundler`.

### About the exports field

The `exports` field in `package.json` lets the package publisher control which file is loaded for each platform.

### Compatibility issues

One backward compatibility issue: when `resolvePackageJsonExports` is `true`, referencing the `exports` field may block imports of files that the package didn't intend to expose, causing compile errors.

In the example below, the package only exposes `src/utility.js` via the `exports` field, so imports of any other files are blocked.

```typescript
// Importing an unexposed file directly for some special reason
// Referencing the exports field may block this import
import { xxx } from '@package/dist/private/hoge';
```

```json
{
  "name": "package",
  "version": "1.0.0",
  "exports": {
    "./utility": "./src/utility.js"
  }
}
```

## resolvePackageJsonImports

This option controls whether TypeScript reads the `imports` field in `package.json` when loading files.
When enabled, TypeScript references the `imports` field when resolving imports.

This setting defaults to `true` when `--moduleResolution` is `node16`, `nodenext`, or `bundler`.

### About the imports field

The `imports` field in `package.json` lets you map custom names to packages.
In the example below, `#dep` is mapped to `dep-node-native`.

```typescript
import {} from '#dep';
```

```json
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
} 
```

## verbatimModuleSyntax

This option simplifies how module imports and exports are handled.
The default value is `false`.

By default, TypeScript removes unused imports and imports that are only used as types from the output JavaScript.
`importsNotUsedAsValues` and `preserveValueImports` were introduced to control this behavior. However, combining these options became complex, and there were edge cases they couldn't handle.

Enabling `verbatimModuleSyntax` makes the rules simpler.

### Usage

Setting it to `true` makes TypeScript remove all imports with the `type` modifier, while keeping all other imports.

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  },
}
```

```typescript
// index.ts
// This entire import is removed
import type { Util } from "./utils";

// Output as 'import { b } from "./utils";'
import { group, type Pick, type Filter } from "./utils";

// Output as 'import {} from "./utils";'
import { type Map } from "./utils";
```

## Conclusion

Looking into the TSConfig options added in the past two years, I found many options I had never used before and learned a lot.

Looking at the trend, there are overwhelmingly many options related to module resolution. It made me realize just how complicated the ESM and CJS module situation is, which I found interesting.
