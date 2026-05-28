---
title: GitHubのディレクトリをCLIでダウンロード
date: 2020-04-01
description: GitHubのディレクトリをCLIでダウンロード
tags: ['ターミナル']
---

GitHubのリポジトリ内の特定のディレクトリだけをローカルにダウンロードした場合  
https://github.com/zeit/next.js/tree/canary/examples/analyze-bundles

svnを利用して `svn export <リポジトリのURL>/trunk/<ディレクトリのパス>` とする事で簡単にダウンロードできます。

```shell
$ svn export https://github.com/zeit/next.js/trunk/examples/analyze-bundles
```

MacOSであればsvnは標準でインストールされているので手軽にダウンロードができて便利です。
