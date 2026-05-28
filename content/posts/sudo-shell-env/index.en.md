---
title: Environment variables not passed to sudo
date: 2020-02-27
description: Environment variables defined in the user's shell are not passed when using sudo.
tags: ['Shell']
---

I heard that environment variables defined in the user's shell are not passed when running with `sudo`, so I tested it.

## Experiment

```shell
#!/bin/sh
echo TEST;
```

```
$ export TEST=hoge
$ sh test.sh
hoge

$ sudo sh test.sh

```

Indeed, the environment variable was not passed.
If you don't know this, it could be really hard to find the problem when something goes wrong.
