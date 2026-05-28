---
title: Download a GitHub directory from the CLI
date: 2020-04-01
description: How to download a specific directory from a GitHub repository using the CLI
tags: ['Terminal']
---

When you want to download only a specific directory from a GitHub repository to your local machine, for example:
https://github.com/zeit/next.js/tree/canary/examples/analyze-bundles

You can easily download it using `svn export <repository URL>/trunk/<directory path>`.

```shell
$ svn export https://github.com/zeit/next.js/trunk/examples/analyze-bundles
```

On macOS, svn is installed by default, so you can download directories easily without any extra setup.
