---
title: Material-UI + webpack のアイコン読み込みでハマった
date: 2020-09-19
description: Mateial-UI + webpack の環境でアイコンのパッケージ読み込み方法がビルド時間に影響する問題について紹介しています。
tags: ['フロントエンド']
---

Mateial-UI + webpackの環境で開発を進めている時に、ある時から突然ビルドに時間がかかるようになりました。
最初は、開発を進めていてファイル数が増えたからビルド時間が増えたのかなと思っていたのですが、それを理由にするには、時間がかかり過ぎていました。

改善のために、調査を進めると Material-UI のアイコン読み込みが原因であることが分かりました。

## 問題
問題のコードでは次のようにアイコンを読み込んでいました。

```
import { AccountCircle } from "@material-ui/icons";
```

上記のパッケージ読み込みをしている1ファイルだけを対象にwebpackでビルドした時のパフォーマンスを計測してみると、1ファイルをビルドをするのに20sほどかかっていました。

※ [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin) で計測

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
This can impact web performance.
Assets:
  bundle.js (2.16 MiB)

WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  main (2.16 MiB)
      bundle.js

WARNING in webpack performance recommendations:
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/
✨  Done in 23.36s.
```

## 原因
これは不要なファイルを大量に読み込んでいる事が原因でした。

`@material-ui/icons/index.js`の実装を見てみると、で各アイコンのファイルをrequireしているため、上記のパッケージ読み込みの方法だと、1000個近いアイコンファイルを全て読み込む状態になっていました。

```
var _AccountCircle = _interopRequireDefault(require("./AccountCircle"));

var _AccountCircleOutlined = _interopRequireDefault(require("./AccountCircleOutlined"));
```

## 解決策
解決策としてはシンプルに特定アイコンファイルだけ読み込むように修正すればOKです。

```
import AccountCircle from "@material-ui/icons/AccountCircle";
```

修正版のwebpackのビルド時間を見てみると、無事にパフォーマンスが改善されており、バンドルサイズについても発生していた Warning も消えてくれてました。

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

## 参考
[How to improve the build speed in React\-Typescript, when using material ui \- DEV](https://dev.to/janpauldahlke/how-to-improve-material-ui-speed-in-react-typescript-1199)