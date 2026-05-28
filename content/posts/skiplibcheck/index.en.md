---
title: Understanding TypeScript's skipLibCheck
date: 2021-01-19
description: An explanation of the skipLibCheck option in tsconfig.json — what it does and when to use it.
tags: ['TypeScript']
---

`tsconfig.json` has a configuration option called [skipLibCheck](https://www.typescriptlang.org/tsconfig#skipLibCheck).
Here is a summary of how this option works and when to use it.

## What skipLibCheck does

The default value of this option is `false`. Setting it to `true` skips type checking for `*.d.ts` files.

Consider the following server code:

```typescript
import express from "express";

const app = express();

app.post("/uses/sign_in", (req: express.Request, res: express.Response) => {
    if (req.tokens.includes('abc')) {
        res.sendStatus(200)
    } else {
        res.sendStatus(403);
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
```

`skipLibCheck` is not set in `tsconfig.json`, so it defaults to `false`.

```json
{
    "compilerOptions": {
        "esModuleInterop": true,
        "typeRoots": [
            "node_modules/@types",
            "types"
        ]
    }
}
```

`req.tokens` is defined by creating a type definition file that extends the `express.Request` type. In this case, `tokens: Array` should have a generic type argument, but it's missing, which causes a type error.

```typescript
// types/express/index.d.ts
/// <reference types="express" />

// @see: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts
declare namespace Express {
    export interface Request {
        // Interface Array<T>
        // Generic type 'Array<T>' requires 1 type argument(s).ts(2314)
        tokens: Array;
    }
}
```

Now, if you set `skipLibCheck: true` in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "skipLibCheck": true,
        // (omitted)
    }
}
```

Type checking for `*.d.ts` files is skipped, so the error disappears. Even if a type definition file has an error, there will be no compile error.

```typescript
declare namespace Express {
    export interface Request {
        tokens: Array;
    }
}
```

In this state, `req.tokens` is treated as `any`.

```typescript
// (omitted)
app.post("/uses/sign_in", (req: express.Request, res: express.Response) => {
    // (property) Express.Request.tokens: any
    if (req.tokens.includes('abc')) {
        res.sendStatus(200)
    } else {
        res.sendStatus(403);
    }
});
```

## Benefits of skipLibCheck

From the behavior above, setting `skipLibCheck: true` reduces the accuracy of type checking. So what are the benefits?

As an application grows and depends on more packages, the number of type definition files increases. By default, `tsc` also type-checks `*.d.ts` files from libraries like `@types/express`, which increases compile time. Setting `skipLibCheck: true` reduces compile time at the cost of type checking accuracy.

```bash
# skipLibCheck: false
$ yarn tsc --extendedDiagnostics -p ./
Files:                          88
Check time:                  1.47s
Total time:                  2.51s
✨  Done in 2.85s.

# skipLibCheck: true
$ yarn tsc --extendedDiagnostics -p ./
Files:                         88
Check time:                 0.18s
Total time:                 1.17s
✨  Done in 1.49s.
```

Another scenario: if multiple packages depend on different versions of the same type definition file (for example, one depends on `@types/react@^16` and another on `@types/react@^17`), multiple copies of the same type definition file may be installed in `node_modules`. This causes a `error TS2300: Duplicate Identifier` error and compilation fails.

One solution is to update package versions to resolve the dependency conflict. However, if that is difficult, setting `skipLibCheck: true` will skip type checking for definition files and avoid the error.

## Conclusion

Both `true` and `false` for `skipLibCheck` have their own benefits and drawbacks. Decide which to use based on what your project values most.
