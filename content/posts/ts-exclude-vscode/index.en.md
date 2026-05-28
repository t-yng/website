---
title: Why TSConfig exclude files still show type errors in VSCode
date: 2024-02-15
description: Even when a file is excluded from compilation in TSConfig, VSCode may still show type errors when you open that file.
tags: ['TypeScript']
---

TSConfig has `include` and `exclude` options to control which files are compiled.
Even when you exclude a specific file using these options, you may still see type errors in VSCode when you open that file.

For example, in the case below, test files (`*.spec.ts`) are excluded using the `exclude` option. However, when you open a test file in VSCode, a type error occurs because path aliases cannot be resolved.

I had always expected that files excluded from compilation would not be type-checked, so this behavior was confusing to me.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@test/*": ["test/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "src/**/*.spec.ts"]
}
```

```ts
// src/utils/math.spec.ts
import { it } from 'vitest';
// Error: Cannot find module '@/utils/math' or its corresponding type declarations.
import { add } from '@/utils/math';
```

## How VSCode establishes the project context

VSCode uses `tsconfig.json` to establish the project context. If a file is not included in the paths specified by the `include` option, or if it is listed in `exclude`, that file is not considered part of the project and is treated as out of project scope.

## How out-of-scope files are handled

Files outside the project scope are not affected by the project settings (the settings defined in `tsconfig.json`).
This means that compile options, module resolution strategies, and type definition file references are not applied.

The VSCode TypeScript language service analyzes these files using global or default settings instead.
As a result, type checking is done with default settings rather than the project settings, which means path aliases cannot be resolved and type errors occur.

## Summary

Unless you explicitly use something like `@ts-ignore`, VSCode always analyzes open TypeScript files using some configuration. Which configuration is used is determined by the project's `tsconfig.json`.

If a file is listed in `exclude`, it is out of the project scope and the project's `tsconfig.json` settings are not applied. Instead, default or global settings are used for analysis.

Keep in mind that excluding a file from compilation does NOT mean it is excluded from type checking in VSCode.

## Reference

[Should VSCode report errors for TS files that are excluded from compilation?](https://stackoverflow.com/questions/52265758/should-vscode-report-errors-for-ts-files-that-are-excluded-from-compilation)
