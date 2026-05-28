---
title: msw not intercepting network requests in Node.js 18
date: 2022-09-22
description: How to fix the problem where msw does not intercept network requests in Node.js 18
tags: ['Frontend', 'Testing']
---

When I upgraded Node.js from 16 to 18, msw stopped intercepting network requests in my tests.

## Cause

Node.js 18 added a built-in `fetch` API. This built-in fetch is implemented using `undici`, not Node's `http` module.

msw intercepts network requests by overriding the `http` module. So it cannot intercept requests made through `undici`.

## Solution

Replace the global `fetch` with `node-fetch` in your test setup file.

```ts
import fetch from 'node-fetch';

global.fetch = fetch as typeof global.fetch;
```

With this change, `fetch` calls in your code will use `node-fetch`, which goes through the `http` module. msw can then intercept those requests as expected.

## Reference

- [Support for native fetch · Issue #1555 · mswjs/msw](https://github.com/mswjs/msw/issues/1555)
