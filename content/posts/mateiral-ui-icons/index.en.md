---
title: Issue with loading icons in Material-UI + webpack
date: 2020-09-19
description: The problem where the way you import the Material-UI icons package affects build time in a Material-UI + webpack environment.
tags: ['Frontend']
---

While developing in a Material-UI + webpack environment, builds suddenly started taking a very long time.
At first I thought it was because the number of files had increased, but it was taking far too long for that reason alone.

After investigating to improve things, I found that the way Material-UI icons were being imported was the cause.

## Problem

The problematic code was importing icons like this:

```
import { AccountCircle } from "@material-ui/icons";
```

I measured the webpack build performance with only this one file as the target, and it took about 20 seconds to build one file.

(Measured with [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin))

```
$ webpack

 SMP  ⏱
General output time took 21.63 secs

 SMP  ⏱  Loaders
modules with no loaders took 7.4 secs
  module count = 5702
ts-loader took 4.96 secs
  module count = 3

...

WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
...
  bundle.js (2.16 MiB)
...
✨  Done in 23.36s.
```

## Cause

The cause was loading a huge number of unnecessary files.

Looking at the implementation of `@material-ui/icons/index.js`, it requires each icon file individually. So the import above was loading all ~1000 icon files.

```
var _AccountCircle = _interopRequireDefault(require("./AccountCircle"));

var _AccountCircleOutlined = _interopRequireDefault(require("./AccountCircleOutlined"));
```

## Solution

The fix is simple — import only the specific icon file you need.

```
import AccountCircle from "@material-ui/icons/AccountCircle";
```

Checking the webpack build time after the fix, performance improved significantly. The bundle size warnings also disappeared.

```
$ webpack

 SMP  ⏱
General output time took 6.3 secs

 SMP  ⏱  Loaders
ts-loader took 5.47 secs
  module count = 3
modules with no loaders took 1.81 secs
  module count = 160

...

✨  Done in 7.69s.
```

## Reference

[How to improve the build speed in React-Typescript, when using material ui - DEV](https://dev.to/janpauldahlke/how-to-improve-material-ui-speed-in-react-typescript-1199)
