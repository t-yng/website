---
title: Notes on converting a TypeScript project to a monorepo
date: 2020-08-09
description: Notes on refactoring a repository that managed frontend and server code in separate directories into a monorepo structure.
tags: ['TypeScript']
---

I was managing frontend and server code in a single repository using directory separation, but it became difficult to work with. So I refactored it into a monorepo structure.
Here are the things I considered during that process.

Note: The refactored repository is private, so it is not public.

## Development environment

I use Next.js as the frontend framework, and I implemented a BFF (Backend for Frontend) using Express as a custom Next.js server for proxying external API requests.

* BFF: TypeScript, Node.js, Express (Next.js custom server)
* Frontend: TypeScript, Next.js

### Initial structure

The structure before refactoring looked like this. Frontend and server code were managed by directory separation.

```
.
├── .storybook
├── pages
├── public
├── src
│   ├── client
│   ├── common
│   ├── config
│   ├── server
│   └── types
├── stories
├── test
│   ├── src
│   │   ├── client
│   │   ├── common
│   │   └── server
│   └── tsconfig.json
├── next.config.js
├── nodemon.json
├── package.json
├── server.ts
├── tsconfig.json
├── tsconfig.common.json
└── tsconfig.server.json
```

### Problems with the initial structure

In the initial directory structure, many files and directories existed at the root level. For a first-time reader, it was very hard to understand which files and directories related to the frontend and which to the server. Also, while `src` and `test` were split into `server` and `client` directories, the TypeScript settings were different for the frontend and server, making the tsconfig configuration complex.
Note: I simplified for explanation, but in reality there were also Docker directories and more.

## Converting to monorepo

### Choosing a tool

For this conversion, I only used yarn workspace.

[lerna](https://github.com/lerna/lerna) is a well-known library for monorepos, but I chose not to use it. For my case, yarn workspace alone was enough to achieve my goals. Also, lerna seemed to be designed for OSS projects (projects meant to be published publicly), and for a private repository it felt redundant. I also wanted to avoid adding extra dependencies and management cost.

I also considered [Nx](https://nx.dev/react) as a tool for managing frontend and server in a monorepo. But after a quick look, it felt very full-stack and seemed to require following Nx's directory structure, which would make migrating an existing project very costly. So I passed on it too.

For reference, there are articles like [Yarn Workspaces: monorepo management without Lerna for applications and coding examples](https://codewithhugo.com/yarn-workspaces-application-monorepo/).

### TypeScript project references

For the monorepo conversion, I introduced TypeScript's [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html). This feature was added in TypeScript 3.0. It lets you manage TypeScript projects independently. Since I was splitting into packages with the monorepo, I also wanted to split TypeScript builds by package.

In a monorepo environment, when `@app/web` depends on `@app/server`, if you build `@app/web` first, `@app/server` may not be built yet, causing module resolution failures. With Project References, running `tsc --build` will automatically build `@app/server` if needed when building `@app/web`, solving the dependency problem.

### Final structure

The directory structure after converting to a monorepo looks like this. Frontend and server are now split into separate packages, and related config files and directories are organized within each package. The structure is much easier to understand.

```
├── workspaces
|   ├── common                Package shared across multiple packages
|   │   ├── src               Source code
|   |   ├── package.json
|   |   └── tsconfig.json     
|   ├── config                Package holding config files
|   │   ├── index.ts          Barrel file
|   │   ├── firebase.ts       
|   |   ├── package.json
|   |   └── tsconfig.json     TypeScript config file
|   ├── server                Server-side package
|   │   ├── src               Source code
|   │   ├── test              Test code
|   │   ├── types             Type definition files
|   |   ├── package.json
|   |   └── tsconfig.json     
|   ├── web
|   |   ├── .storybook        Storybook config files
|   |   ├── public            Public files such as images
|   |   ├── pages             Next.js page components
|   |   ├── src
|   |   ├── stories           Storybook story files
|   |   ├── test              Test code
|   |   ├── next.config.js    Next.js config file
|   |   ├── nodemon.json      Config for auto-starting Next.js custom server in dev
|   |   ├── package.json
|   |   ├── server.ts         Next.js custom server (implementation in server package)
|   |   ├── tsconfig.json
|   |   └── tsconfig.server.json
|   └── tsconfig.json
└── pakcage.json
```

Here is part of the `web` package's `package.json` and `tsconfig.json`.

```json
# web/package.json

{
    "dependencies": {
        "@app/server": "*"
    }
}
```

```json
# web/tsconfig.json

{
    "extends": "../tsconfig.json",
    "references": [
        { "path": "../server" }
    ]
}
```
