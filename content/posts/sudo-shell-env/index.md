---
title: sudoで環境変数が引き継がれない
date: 2020-02-27
description: sudoで環境変数が引き継がれない
tags: ['シェル']
---
sudo実行するとユーザー環境のシェルで定義した環境変数が引き継がれない事を聞いたので実験してみました。

## 実験

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

確かに環境変数が引き継がれなかった。  
これ知らないとハマった時に問題見つけるの大変そうですね。

