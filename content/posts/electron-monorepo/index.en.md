---
title: Building an Electron app with a monorepo structure
date: 2023-01-06
description: I changed the Electron app repository to a monorepo structure. Here is a summary of what I did.
tags: ['Electron']
---

For the full code and directory structure, see [higeOhige/review-cat](https://github.com/higeOhige/review-cat).

## Motivation

When I looked at the repository again after a long time, it took longer than expected to remember how the build system worked. I wanted to make build management easier, so I tried a monorepo structure as a solution.

## Problems before the change

Before the change, the directory structure looked like this. The main process and renderer process code were managed in `electron` and `renderer` directories.

The `electron` directory code was built with esbuild, and the `renderer` directory code was built with vite. Having two projects with different build configurations managed under one root made things very complex.

```shell
.
├── babel.config.js
├── build.js
├── electron
│   ├── app.ts
│   ├── assets
│   ├── preload.ts
│   └── src
├── esbuild.js
├── jest.config.js
├── package.json
├── renderer
│   ├── assets
│   ├── index.html
│   ├── public
│   └── src
├── tsconfig.electron.json
├── tsconfig.json
├── vite.config.ts
└── yarn.lock
```

Also, in `electron/app.ts`, the path to the HTML file depended on the built directory structure. If the build output directory changed, the app would stop working.

```ts
// electron/app.ts
const indexUrl = isDevelopment
  ? 'http://localhost:3000/'
  : `file://${path.resolve(__dirname, './index.html')}`; // Strongly depends on the dist directory structure
```

Looking at the build script, the build configuration was set up to merge build outputs into the `dist` directory, and the above code was tightly coupled to that structure.

```json
{
  "scripts": {
    "build": "yarn clean && yarn vite:build && yarn electron:build",
    "vite:build": "tsc && vite build",
    "electron:build": "node esbuild.js && yarn electron:copy && node build.js",
    "electron:copy": "cpx 'electron/assets/images/**' dist/assets/images",
  }
}
```

## Converting to monorepo structure

I created a new `packages` directory and added `main` (for the main process) and `web` (for the renderer process) directories inside it.

```shell
.
├── README.md
├── package.json
├── packages
│   ├── main
│   │   ├── assets
│   │   ├── build.js
│   │   ├── esbuild.js
│   │   ├── jest.config.js
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
│   └── web
│       ├── index.html
│       ├── jest.config.js
│       ├── package.json
│       ├── public
│       ├── src
│       ├── tsconfig.json
│       └── vite.config.ts
└── yarn.lock
```

To use Yarn Workspaces for the monorepo, I added `workspaces` to `package.json`.

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

### Building the renderer process

For the renderer process, I simply moved files like `vite.config.ts` to the `web` directory. There were no special changes. To define it as a package in the monorepo, I set `"name": "web"` in `package.json` and simplified the npm scripts since each package can now be built independently.

```json
{
  "name": "web",
  "scripts": {
    "dev": "yarn vite",
    "build": "yarn clean && vite build",
    "clean": "rimraf dist"
  }
}
```

### Building the main process

I changed the HTML file reference to use `require.resolve` to dynamically find the path to the HTML file in the `web` package. This fixes the problem where the HTML file reference depended on the built directory structure.

```ts
const indexUrl = isDevelopment
   ? 'http://localhost:3000/'
   : `file://${require.resolve('web/dist/index.html')}`;
```

I added the `web` package dependency to `package.json`.

```json
{
  "dependencies": {
    "web": "*"
  }
}
```

### Understanding build dependencies

To understand the build dependencies of this monorepo structure, I looked inside the app packaged by [electron-builder](https://www.electron.build/) to see how it was packaged.

First, Electron apps are packaged in asar format, so I installed a command to extract asar files.

```shell
$ npm install -g asar
$ asar -V
v3.2.0
```

I extracted the asar file from the generated app.

```shell
$ asar extract app/mac-arm64/ReviewCat.app/Contents/Resources/app.asar extracted
```

The contents look like this. The main process built files `app.js` and `preload.js` are in the `dist` directory, and the renderer process `web` package is in `node_modules/web`.

```shell
extracted/
├── dist
│   ├── app.js
│   └── preload.js
├── node_modules
│   └── web
└── package.json
```

By making the renderer process an external package and using `require.resolve` to reference `node_modules/web/dist/index.html`, the main process can now find the HTML file without depending on the built directory structure.

This shows how managing the main process and renderer process as independent packages in a monorepo makes the build dependencies much simpler.

### Managing tsconfig as a package

By making packages independent in the monorepo, `tsconfig.json` was now duplicated across packages. I referenced Turborepo's [examples/basic](https://github.com/vercel/turbo/tree/main/examples/basic) and added a new package to manage tsconfig as a shared config.

```shell
.
├── README.md
├── package.json
├── packages
│   ├── main
│   │   └── tsconfig.json
│   ├── tsconfig
│   │   ├── base.json
│   │   └── package.json
│   └── web
│       └── tsconfig.json
└── yarn.lock
```

I put shared settings in `packages/tsconfig/base.json` and each package's `tsconfig.json` extends it.

```json
// packages/main/package.json
{
  "devDependencies": {
    "tsconfig": "*"
  }
}
```

```json
// packages/main/tsconfig.json
{
  "extends": "tsconfig/base.json"
}
```

### Managing ESLint config as a package

I also manage ESLint plugins and config files in a single package.

```shell
.
├── README.md
├── package.json
├── packages
│   ├── eslint-config-custom
│   │   ├── index.js
│   │   └── package.json
│   ├── main
│   │   └── .eslintrc
│   └── web
│       └── .eslintrc
└── yarn.lock
```

Like tsconfig, I put shared settings in `packages/eslint-config-custom/index.js` and each package's `.eslintrc` extends it.

```json
// packages/main/package.json
{
  "devDependencies": {
    "eslint-config-custom": "*"
  }
}
```

```json
// packages/main/.eslintrc
{
  "extends": ["custom"]
}
```

### Full build and app packaging

Finally, the overall build configuration. I wrote npm scripts in the root `package.json` to manage the build for each package.

Using `yarn workspaces run build` would fail because packages like `packages/tsconfig` don't have a build script. So I specify each workspace individually.
The code builds are independent, so parallel builds like `xxx & yyy` should work. But I ran into a problem where processes didn't exit properly, so I build them in sequence. I'd like to use [Turborepo](https://turbo.build/repo) to improve this.

```json
{
  "scripts": {
    "build": "yarn workspace web build && yarn workspace main build",
    "package": "yarn workspace main package",
  }
}
```

### Sending coverage reports to Codecov

With the monorepo structure, test coverage is now in multiple directories. To handle this, I used Codecov's Flags feature, which lets you manage multiple coverage reports in one project.

I defined a new GitHub Actions workflow like this. I'm not sure this is the best approach.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # (omitted)
      - run: yarn test:coverage
      - name: Upload main coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          flags: main
          directory: packages/main
      - name: Upload web coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          flags: web
          directory: packages/web
```

## Thoughts after the change

I achieved my goal of being able to manage the main process and renderer process builds independently. I think Electron apps and monorepo structures work very well together.
