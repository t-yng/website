---
title: Denoを触ってみよう
date: 2020-04-06
description: Denoを触ってみよう
tags: ['Deno', 'TypeScript']
---

## インストール
[denoland/deno: A secure JavaScript and TypeScript runtime](https://github.com/denoland/deno)

```shell
$ curl -fsSL https://deno.land/x/install/install.sh | sh
$ vi ~/.zshrc
# Denoのパス設定
export DENO_INSTALL="/Users/t-yng/.local"
export PATH="$DENO_INSTALL/bin:$PATH"

$ source ~/.zshrc
```

インストール直後はパスが通っていない状態なので ~/.zshrc にDenoのパス設定を追加して再読み込みします。  
※ 個人の環境に合わせて適宜読み替えてください

HomeblewやCargoを利用してもインストールできます。  
詳細は [https://deno.land/](https://deno.land/) を確認してください。

## VsCodeの拡張

今の状態でVSCodeでコードを書くとTypeScriptとして認識されるので、Denoの構文でエラーが発生します。  
そこで [Deno - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=axetroy.vscode-deno) をインストールしておきます。

デフォルトでは設定が false になっているので .vscode/setting.json で拡張を有効化します。  
自分は Node.js 環境で TypeScript を書く場合に競合する事を避けるために、プロジェクト単位で有効化しています。

```json
{
  "deno.enable": true
}
```

## Hello World を表示する
最初に「Hello World」を表示するサンプルコードを実装してみます。

```shell
$ mkdir deno-sample
$ cd deno-sample
$ touch server.ts
```

### server.ts
deno-sample/server.ts に次のサンプルコードを記述します。

```typescript
import { serve } from "https://deno.land/std@v0.39.0/http/server.ts";

const s = serve({ port: 8000 });
console.log("access to http://localhost:8000/");

for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
```

最初のimport文はモジュール読み込みです。  
Denoは npm を利用せずにURLやファイルパスでモジュールを読み込む仕組みになっており、サンプルコードでは deno.land にホスティングされた標準APIのモジュールを読み込んでいます。

次に `serve({port: 8000})` でサーバーインスタンスを生成しています。

ここで生成されるサーバーインスタンスはPromiseのイテレーターとなっているので、 `for await` でループ処理にてリクエストのインスタンスを取得して、 Hello World の文字列をレスポンスとして返しています。

### 実行
エラーが発生しました。

```shell
$ deno server.ts

Compile file:///Users/xxxxxx/workspace/deno/deno-sample/server.ts
error: Uncaught PermissionDenied: network access to "127.0.0.1:8000", run again with the --allow-net flag
```

Denoではネットワークアクセスやファイルアクセスには許可が必要なため、今回はネットワークアクセスを許可するために `--allow-net` フラグを指定します。

```
$ deno --allow-net server.ts
access to http://localhost:8000/
```

今度は成功しました。
この状態で http://localhost:8000/ にアクセスすれば、「Hello World」がブラウザに表示されます。🎉

## HTMLを返す
次にHTMLを返すWebサーバーを実装してみます。

### ディレクトリ構造
public/index.html は適当に作成してください。

```
.
├── public
│   └── index.html
└── server.ts
```

### server.ts

fs モジュールの `readFileStr` でHTMLファイルの文字列を読み込みをしています。

正しく実装するなら、[File Server](https://deno.land/std/manual.md#file-server)として実装した方が良さそうですが、ファイル読み込みをを試してみたかったので、この書き方をしています。

```typescript
import { serve } from "https://deno.land/std/http/server.ts";
import { readFileStr } from "https://deno.land/std/fs/mod.ts";

// HTMLファイルを読み込んで文字列を取得
const html = await readFileStr("./public/index.html", {
    encoding: "utf8",
}).catch((error) => {
    console.log(error);
    return "読み込みに失敗したよ";
});

const s = serve({ port: 8000 });
console.log("access to http://localhost:8000");
for await (const req of s) {
    req.respond({ body: html }); // HTML文字列をレスポンスBodyにセット
}
```

### 実行
ファイル読み込みをしているので `--allow-read` フラグを新たに指定しています。

```shell
$ deno --allow-net --allow-read server.ts
access to http://localhost:8000/
```

## パッケージ管理

### 問題
現状では npm のようなパッケージ管理ツールがなく、ソース単位で外部モジュールの読み込みを書いている状態です。  
依存している外部ライブラリを把握するためには、ソースコードを全て見る必要があり管理が困難になってしまいます。

### deps.ts
deps.ts ファイルを新しく作り、モジュール読み込みの記述をまとめることで簡易的なパッケージ管理が実現できます。  
deps.ts はマニュアルで紹介されいているファイル名で名前は何でもOKです。  
ライブラリを見ていると、deps.ts か package.ts をファイル名として利用しているパターンが多かったです。

先ほどのHTMLを返すサンプルコードの一部を deps.ts を利用して書き直してみるとこんな感じです。

deps.ts
```typescript
export { serve } from "https://deno.land/std/http/server.ts";
export { readFileStr } from "https://deno.land/std/fs/mod.ts";
```

server.ts
```typescript
import { serve, readFileStr } from "./deps.ts";

// 後は同じ
...
```

## ドキュメント

* [Dono 公式ドキュメント](https://deno.land/)
* [API Reference](https://deno.land/typedoc/)
