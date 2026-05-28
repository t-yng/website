---
title: TypeScript Playground のコード共有の仕組み
date: 2021-10-01
description: TypeScript Playground はURLを共有するだけでコードの共有が簡単にできるようになっている。その仕組みを調べてみました。
tags: ['TypeScript']
---

TypeScript Playground はURLを共有するだけでコードの共有が簡単にできるようになっています。  
外部にコードが保存されるという訳でもないので、どういう仕組みで共有が実現されているか気になったので、調べてみました。

## 仕組み
仕組みとしては以下の流れでURLを通してコード共有がされていました。

1. エディターに記述してあるコードを文字列圧縮ライブラリで圧縮
2. URLに圧縮した文字列を挿入
3. URLを開くときに圧縮された文字列を展開してエディターにコードとして表示する

## コードの文字列圧縮
コードの圧縮処理は[ここのコード](https://github.com/microsoft/TypeScript-website/blob/1e7ea49f60953aa446b591c6aff347a7c566e3cb/packages/sandbox/src/compilerOptions.ts#L85) で処理がされており、[lz-string](https://pieroxy.net/blog/pages/lz-string/index.html) という文字列圧縮ライブラリが使われていました。

```typescript
  const hash = `code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`
```

