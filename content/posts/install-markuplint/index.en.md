---
title: Adding markuplint to a React project
date: 2022-12-19
description: How to add markuplint to a React project for HTML syntax checking
tags: ['Frontend', 'React']
---

Writing HTML correctly based on the specification requires more specialized knowledge than you might expect.
For example, the following code is invalid HTML because the `p` element only allows phrasing content:

```html
<p>
  <h1>Heading</h1>
</p>
```

## Why write HTML based on the specification

The code above is a syntax error in HTML, but browsers still display it without any problem. You might think: if there's no visible issue, does it really matter?

The audience for a page includes not only people but also machines like screen readers and search bots. For these machines to correctly understand a page, HTML must be written correctly according to the specification.

## Adding markuplint

As mentioned, writing HTML correctly requires some specialized knowledge. Someone with that knowledge could check code at the pull request stage, but reviewing every line of code would be a huge burden.

[markuplint](https://markuplint.dev/) automates HTML syntax checking, so everyone can notice syntax errors during development. It also helps you learn the HTML specification through those errors — two benefits in one.

### Installation

First, install the required packages.

The `markuplint` package is a CLI tool that provides the core HTML syntax checking functionality.

The `@markuplint/jsx-parser` package parses JSX code into HTML strings for syntax checking.

The `@markuplint/react-spec` package allows React-defined attributes like `key` to be recognized as valid. Without it, checking React code would show `error: Attribute "key" is not allowed (invalid-attr)` because `key` is not part of the HTML specification.

For parsers and specs for other libraries like Vue and Svelte, check the [official repository](https://github.com/markuplint/markuplint/tree/dev/packages/@markuplint).

```shell
$ yarn add markuplint @markuplint/jsx-parser @markuplint/react-spec
```

### Create a config file

Create `.markuplintrc` at the project root with the following content.

```json
// .markuplintrc
{
    // Exclude test and story files
    "excludeFiles": [
        "./**/*.{test,spec,stories}.tsx"
    ],
    // Use the tool's recommended settings
    "extends": [
        "markuplint:recommended"
    ],
    // Parse JSX as HTML text
    "parser": {
        ".tsx$": "@markuplint/jsx-parser"
    },
    "specs": {
        ".tsx$": "@markuplint/react-spec"
    }
}
```

### Run the syntax check

Let's run the syntax check on this component file:

```tsx
// src/
const Hello = () => {
  return (
    <p>
      <h1>Hello</h1>
    </p>
  )
}
```

Specify the target files using a blob pattern and run the check. By default all results are shown. Add the `-p` option to show only errors.

The HTML syntax error was detected correctly.

```shell
$ yarn markuplint -p src/**/*.tsx
<markuplint> error: The content of element "p" is not valid according to the HTML specification (permitted-contents)
  4: ••••••••<p>
  5: ••••••••••••<h1>Test</h1>
```

If you use VS Code, there is also a [markuplint plugin](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint). Installing it is convenient for real-time checking while writing code.
