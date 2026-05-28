---
title: How TypeScript Playground shares code via URL
date: 2021-10-01
description: TypeScript Playground lets you share code just by sharing a URL. I looked into how this works.
tags: ['TypeScript']
---

TypeScript Playground makes it easy to share code just by sharing a URL.
Since the code is not stored on any external server, I was curious about how the sharing works, so I looked into it.

## How it works

The code sharing works like this:

1. The code written in the editor is compressed using a string compression library
2. The compressed string is inserted into the URL
3. When the URL is opened, the compressed string is expanded and displayed as code in the editor

## Compressing the code

The compression is done in [this code](https://github.com/microsoft/TypeScript-website/blob/1e7ea49f60953aa446b591c6aff347a7c566e3cb/packages/sandbox/src/compilerOptions.ts#L85), using a string compression library called [lz-string](https://pieroxy.net/blog/pages/lz-string/index.html).

```typescript
  const hash = `code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`
```
