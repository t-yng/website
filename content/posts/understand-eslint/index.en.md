---
title: Understanding ESLint properly
date: 2021-01-19
description: I always set up ESLint at the start of a project and then rarely touch it again. Since I often forget what each setting does, I summarized the purpose of each configuration option and plugin.
tags: ['Frontend']
---

I always set up [ESLint](https://github.com/eslint/eslint) at the start of a project and then rarely touch it again. I usually configure it by feel, and when I need to set it up again in a new project, I forget what each setting does. So I decided to properly understand the purpose of each configuration option and plugin.

## What is ESLint?

ESLint is a linter tool for EcmaScript/JavaScript. It is difficult for a team to agree on coding conventions and have everyone follow them manually. When a new member joins, you may need to point out the same issues in code review many times until they get used to the team's rules. By introducing ESLint, you can automate code rule checking and ensure consistent code.

## ESLint configuration

In ESLint, you can configure all rules in a configuration file. Let's look at the basic configuration options.

[Configuring ESLint - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/user-guide/configuring)

### Rules

The `rules` option sets which syntax ESLint should flag as an error or ignore. There are built-in rules like `semi`, which requires a semicolon at the end of statements. By setting these rules in the configuration file, you can customize the linter behavior to your liking.

Rules can be set to `off` or `0`, `warn` or `1`, or `error` or `2`. Both string and number formats work.

When ESLint finds a rule set to `error`, it exits with a non-zero exit code. For `warn`, it outputs a warning but the syntax check passes. Setting everything to `error` is one approach, but sometimes it takes a lot of time to fix all lint errors. It's better to discuss with the team and decide how strict the rules should be.

In the example below, `"quotes": ["error", "single"]` makes it an error if single quotes are not used. `"no-unused-var": "warn"` treats unused variables as warnings. `off` is often used together with `extends` (described next) to turn off specific rules from the base config.

```javascript
// error  Strings must use singlequote  quotes
const name = "taro"
// warning  'age' is assigned a value but never used  no-unused-vars
const age = 10
console.log(name)
```

```json
// .eslintrc
{
	"rules": {
		"quotes": ["error", "single"],
        "no-unused-var": "warn"
    }
}
```

### Extends

The `extends` option lets you inherit a base configuration. In the `rules` example above, we configured each rule one by one. But configuring all rules from scratch for every project is a lot of work. ESLint has official recommended presets for this purpose.

By specifying `eslint:recommended` in the `extends` option, you can inherit the base configuration all at once.

You can check which rules are included in the [official documentation](https://eslint.org/docs/rules/).

```json
{
	"extends": "eslint:recommended"
}
```

If you want to disable some rules from the base configuration, use the `rules` option with `off`.

```json
{
	"extends": [
		"eslint:recommended"
	],
	"rules": {
        "no-ununsed-vars": "off"
    }
}
```

You can specify multiple items in `extends` as an array. If the same rule (like `no-unused-vars`) is defined in multiple places, the later one overwrites the earlier one.
In the example below, settings from `eslint:recommended` are overwritten by settings from `plugin:react/recommended`.

```json
{
	"extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ]
}
```

### Parser options

ESLint supports ES5 syntax by default. To support ES6+ syntax or JSX, configure `parserOptions`.

Here are three items to know:
- ecmaVersion
- sourceType
- ecmaFeatures

`ecmaVersion` specifies the ECMAScript version. The default is 5.
With the default setting, the following code will cause a syntax error:

```javascript
// error  Parsing error: The keyword 'const' is reserved
const hello = () => {
    console.log("hello");
};
```

Setting `ecmaVersion` lets you change which ECMAScript version is checked:

```json
{
	"parserOptions": {
		"ecmaVersion": 2020
	}
}
```

`sourceType` specifies the module type. The default is `"script"`.
With the default setting, using ES modules like `import`/`export` will cause a syntax error:

```javascript
// 'import' and 'export' may appear only with 'sourceType: module'
import { pick } from 'lodash';
```

Specify `"module"` to allow `import`/`export`:

```json
{
	"parserOptions": {
		"sourceType": "module"
	}
}
```

`ecmaFeatures` specifies additional syntax extensions to enable in JavaScript.
For example, JSX is a syntax extension, so by default it causes a syntax error:

```javascript
// error  Parsing error: Unexpected token <
const Hello = ({ name }) => <div>{name}</div>;
```

Setting `"jsx": true` allows JSX in syntax checking:

```json
{
    "parserOptions": {
        "ecmaVersion": 2020,
        "ecmaFeatures": {
            "jsx": true
        }
    }
}
```

### Parser

ESLint uses [Espree](https://github.com/eslint/espree) as its default parser. When type-checking TypeScript, the `type` keyword is not valid ECMAScript syntax, so parsing fails. You need to specify a different parser using the `parser` option.

```typescript
// error  Parsing error: Unexpected token User
type User = {
    name: String;
}
```

To parse TypeScript, specify `@typescript-eslint/parser`:

```bash
$ yarn add -D typescript @typescript-eslint/parser
```

```json
{
  "parser": "@typescript-eslint/parser"
}
```

### Processor

Some plugins provide processors as a specific feature. Processors can, for example, extract JavaScript code from Markdown files and run ESLint on it.
For example, [mradionov/eslint-plugin-disable](https://github.com/mradionov/eslint-plugin-disable), which disables specific plugins for certain file paths, uses the `processor` option like this:

```json
{
    "plugins": ["react", "disable"],
    "processor": "disable/disable",
    "overrides": [
        {
            "files": ["tests/**/*.test.js"],
            "settings": {
                "disable/plugins": ["react"]
            }
        }
    ]
}
```

### Environments

This setting tells ESLint about predefined global variables and functions for environments like the browser or jest.
For example, jest defines global functions like `describe` and `it`, but ESLint doesn't know they exist. If you enable the `no-undef` rule, ESLint will report them as undefined:

```javascript
// error  'describe' is not defined  no-undef
describe("test", () => {
	// error  'it' is not defined  no-undef
    it("test", () => {});
});
```

```json
{
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "no-undef": "error"
    },
}
```

Setting `jest: true` in the `env` option tells ESLint that functions like `describe` are already defined, which removes the error.
You can see a list of available environments in the [official documentation](https://eslint.org/docs/user-guide/configuring#specifying-environments).

```json
{
  "env": {
    "jest": true,
  }
}
```

### Globals

This setting makes ESLint recognize custom global variables that are not part of any specific environment.
Values can be `writable`, `readonly`, or `off`.

```javascript
// error  'bar' is not defined  no-undef
bar = "bar"
// error  'hoge' is not defined  no-undef
console.log(hoge)
```

```json
{
    "rules": {
        "no-undef": "error",
        "no-global-assign": "error"
    },
    "env": {
        "browser": true
    }
}
```

`writable` and `readonly` represent what operations are allowed on the defined global variable. Since overwriting a global variable is almost never done and is generally a bad practice, using `readonly` is usually fine.

```javascript
// Overwriting a "readonly" global variable still causes an error
// error  Read-only global 'bar' should not be modified  no-global-assign
bar = "bar"
console.log(hoge)
```

```json
// .eslintrc
{
    // (omitted)
	"globals": {
		"hoge": "readonly",
		"bar": "readonly"
    }
}
```

In the example above, with `no-global-assign` enabled, trying to overwrite `bar` (which is marked as `readonly` in `globals`) causes a syntax error.
To allow overwriting a global variable, use `writable`:

```javascript
hoge = 'new hoge'
console.log(hoge)
```

```json
// .eslintrc
{
    // (omitted)
	"globals": {
		"hoge": "readonly",
		"bar": "writable"
    }
}
```

### Plugins

ESLint lets you add custom rules through plugins — for example, "React must be imported when JSX is used."
The `plugins` option takes an array of plugins you want to use. Plugins must be installed as packages before they can be used.

As an example, let's install the React syntax checker plugin [yannickcr/eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react).

First, install the plugin:

```bash
$ yarn add -D eslint-plugin-react
```

Then specify the plugin in the `plugins` option and enable the rules you want to use.
The `eslint-plugin-` prefix can be omitted when specifying the plugin name.

```json
{
    // "eslint-plugin-react" also works
	"plugins": ["react"],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"rules": {
		"react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error"
    }
}
```

The example above is intentionally verbose to show how `plugins` works. If you want to apply the preset settings provided by the plugin all at once, you can use the `extends` option instead:

```json
{
	"extends": [
	    "eslint:recommended",
	    "plugin:react/recommended"
    ]
}
```

### Shared settings

The `settings` option defines common values that are referenced when ESLint rules run. This is useful when you want custom rules to share a common value.

When using [yannickcr/eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), you can specify the React version with this setting:

```json
{
	"plugins": ["react"],
	"settings": {
		"react": {
			"version": "16.3"
        }
    }
}
```

## Using ESLint with Prettier

Prettier is an automatic code formatter.

Prettier formats code that `eslint --fix` does not, making it a better formatting tool than ESLint alone. For example, ESLint won't auto-format the following long line, but Prettier will:

```typescript
// eslint --fix does not format this
const getAllPostsImpl: GetAllPosts = new GetAllPostsImpl(postsRepository, directoryRepository);
```

```typescript
// Prettier formats it like this
const getAllPostsImpl: GetAllPosts = new GetAllPostsImpl(
	postsRepository, 
	directoryRepository
);
```

When searching for how to use ESLint and Prettier together, you may find instructions to install [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier), which runs Prettier inside ESLint. However, this approach is slower than running Prettier directly, and formatted code may appear as a syntax error. The [official Prettier documentation](https://prettier.io/docs/en/integrating-with-linters.html) recommends against this approach.

The recommended approach is to install [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to disable ESLint rules that conflict with Prettier, then run `prettier && eslint` — first format the code with Prettier, then run ESLint.

```json
{
	"extends": [
		"eslint:recommended",
		"prettier"
	]
}
```

```bash
# Run
$ prettier && eslint
```

## Example configuration for React

Packages to install:
- [yannickcr/eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks)

If you use React v17.0 or later, you don't need to import React in every file, so I recommend setting `react/react-in-jsx-scope` to `off`.

Configuration file:

```json
{
    "plugins": [
        "react-hooks"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2020
    },
    "env": {
        "browser": true,
        "jest": true
    },
    "rules": {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/display-name": "off",
    }
}
```

## Example configuration for TypeScript

Packages to install:
- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

```bash
$ yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Configuration file:

```json
{
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2020
    },
    "env": {
        "browser": true,
        "jest": true
    }
}
```
