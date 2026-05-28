---
title: Replacing ts-jest with @swc/jest to cut CI test time in half
date: 2021-12-26
description: How replacing ts-jest with @swc/jest cut the CI test execution time by half in a real project.
tags: ['Jest', 'Testing']
---

This article is the 21st entry in the [YAMAP Engineer Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers).

## The problem with ts-jest

Using ts-jest adds noticeable overhead because of the compilation time.

At YAMAP, we started writing unit tests on the frontend side too. With about 180 test cases, CI test execution was taking about 1 minute. When doing TDD, you run unit tests very frequently during development, so the slowness of ts-jest directly affects development efficiency.

So I tried replacing ts-jest with @swc/jest to improve execution time.

## Results

After replacing with @swc/jest, the CI unit test execution time was cut in half.

| Before | After |
|--|--|
| 53s | 21s |

## What is @swc/jest?

@swc/jest is a Jest transformer built using swc, a TypeScript compiler written in Rust.
The benefits I personally see are:
- swc is written in Rust, so it runs much faster than ts-jest (tsc)
- Configuration can be written inside `jest.config.js`, so you don't need a separate `tsconfig.test.json` file for testing

## Replacing ts-jest with @swc/jest

First, install `@swc/core` (the compiler) and `@swc/jest` (the transformer).

```shell
$ yarn install -D @swc/core @swc/jest
```

The Jest configuration file before the change looked like this:

```js
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  // (omitted)
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
};
```

I changed this to use @swc/jest.
I added the swc configuration inside the file and changed `transform` to use @swc/jest.
Since tsconfig is no longer needed, I also removed the `globals` setting.

See the comments in the code for details about the swc settings. For full details, see the [official documentation](https://swc.rs/docs/configuration/compilation).

```js
/** @type {import('@swc/core').Config} */
const swcConfig = {
  // Enable source map output
  sourceMaps: true,
  module: {
    // Output as CommonJS because Jest loads modules in CommonJS format
    type: 'commonjs',
  },
  jsc: {
    parser: {
      // Compile as TypeScript
      syntax: 'typescript',
      // Enable TSX compilation to test React components
      tsx: true,
    },
    transform: {
      react: {
        // Specify the React JSX transform
        // Compile to the _jsx (react/jsx-runtime) format introduced in React 17
        // to avoid needing to import React in every file
        runtime: 'automatic',
      },
    },
  },
};

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', swcConfig],
  },
  // (omitted)
};
```

## Concern about different compilers

Because of the existing babel configuration, the production build still uses tsc. This means the compiler used in tests differs from the one used in production. There is a small concern that some compiler-specific behavior could make a test pass even if the production code has a problem.

However, the chance of this causing a real bug is quite low, and the benefit of faster test execution outweighs this risk, so I consider it acceptable.

## Conclusion

The migration went more smoothly than expected, with no problems. Tests continue to work the same as before, so I'm glad I made the switch.
