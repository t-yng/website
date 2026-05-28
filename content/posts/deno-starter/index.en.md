---
title: Let's try Deno
date: 2020-04-06
description: Getting started with Deno
tags: ['Deno', 'TypeScript']
---

## Installation

[denoland/deno: A secure JavaScript and TypeScript runtime](https://github.com/denoland/deno)

```shell
$ curl -fsSL https://deno.land/x/install/install.sh | sh
$ vi ~/.zshrc
# Set Deno path
export DENO_INSTALL="/Users/t-yng/.local"
export PATH="$DENO_INSTALL/bin:$PATH"

$ source ~/.zshrc
```

Right after installation, Deno is not in your PATH, so add the Deno path settings to `~/.zshrc` and reload it.
Note: Adjust the path to match your environment.

You can also install using Homebrew or Cargo.
See [https://deno.land/](https://deno.land/) for details.

## VS Code extension

Without any setup, VS Code treats Deno code as TypeScript and shows errors for Deno syntax.
Install [Deno - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=axetroy.vscode-deno) to fix this.

By default the extension is disabled, so enable it in `.vscode/settings.json`.
I enable it per project to avoid conflicts with Node.js TypeScript environments.

```json
{
  "deno.enable": true
}
```

## Display hello world

Let's implement a simple sample that shows "Hello World."

```shell
$ mkdir deno-sample
$ cd deno-sample
$ touch server.ts
```

### server.ts

Write the following sample code in `deno-sample/server.ts`.

```typescript
import { serve } from "https://deno.land/std@v0.39.0/http/server.ts";

const s = serve({ port: 8000 });
console.log("access to http://localhost:8000/");

for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
```

The first import statement loads a module.
Deno loads modules by URL or file path without using npm. In this sample, we load a standard API module hosted on deno.land.

Next, `serve({port: 8000})` creates a server instance.

The server instance is a Promise iterator, so we use `for await` to get each request instance in a loop and return "Hello World" as the response.

### Run

An error occurred.

```shell
$ deno server.ts

Compile file:///Users/xxxxxx/workspace/deno/deno-sample/server.ts
error: Uncaught PermissionDenied: network access to "127.0.0.1:8000", run again with the --allow-net flag
```

Deno requires permission for network and file access. Add the `--allow-net` flag to allow network access.

```
$ deno --allow-net server.ts
access to http://localhost:8000/
```

This time it worked.
Now open http://localhost:8000/ in your browser to see "Hello World" displayed. 🎉

## Return HTML

Next, let's implement a web server that returns HTML.

### Directory structure

Create `public/index.html` with any content you like.

```
.
├── public
│   └── index.html
└── server.ts
```

### server.ts

We use `readFileStr` from the `fs` module to read the HTML file as a string.

For a proper implementation, using a [File Server](https://deno.land/std/manual.md#file-server) would be better. But I wrote it this way because I wanted to try file reading.

```typescript
import { serve } from "https://deno.land/std/http/server.ts";
import { readFileStr } from "https://deno.land/std/fs/mod.ts";

// Read the HTML file as a string
const html = await readFileStr("./public/index.html", {
    encoding: "utf8",
}).catch((error) => {
    console.log(error);
    return "Failed to read file";
});

const s = serve({ port: 8000 });
console.log("access to http://localhost:8000");
for await (const req of s) {
    req.respond({ body: html }); // Set HTML string as response body
}
```

### Run

Since we are reading a file, we also add the `--allow-read` flag.

```shell
$ deno --allow-net --allow-read server.ts
access to http://localhost:8000/
```

## Package management

### Problem

Currently there is no package manager like npm. We write external module imports directly in each source file.
To understand what external libraries the project depends on, you need to read all source files, which makes management difficult.

### deps.ts

By creating a `deps.ts` file and putting all module imports there, you can do simple package management.
`deps.ts` is a filename mentioned in the manual, but any name works.
Looking at libraries, many use either `deps.ts` or `package.ts` as the filename.

Here is part of the HTML server sample rewritten using `deps.ts`:

deps.ts
```typescript
export { serve } from "https://deno.land/std/http/server.ts";
export { readFileStr } from "https://deno.land/std/fs/mod.ts";
```

server.ts
```typescript
import { serve, readFileStr } from "./deps.ts";

// The rest is the same
...
```

## Documentation

* [Deno Official Documentation](https://deno.land/)
* [API Reference](https://deno.land/typedoc/)
