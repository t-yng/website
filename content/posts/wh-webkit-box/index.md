---
title: 複数行テキストの省略と-webkit-boxについて
date: 2021-06-04
description: 複数行テキストの省略時に使用される-webkit-boxについて簡単に調べました。
tags: ['フロントエンド', 'css']
---
複数行のテキストを `...` で省略する便利なCSSプロパティとして [-webkit-line-clamp](https://developer.mozilla.org/ja/docs/Web/CSS/-webkit-line-clamp) があります。

このCSSプロパティは使用方法に制限があり`display`プロパティに `-webkit-box` or `-webkit-inline-box` を設定して、かつ `-webkit-box-orient`プロパティに `vertical` を設定する必要があります。

```css
/* 大抵はこんな感じで指定する */
{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
```

ここで指定する `-webkit-box` の正体は `flex` プロパティのベンダープレフィックスです。  
flexが草案時代に WebKit で `flex` を利用するときに使われていたプロパティです。

情報は[WHATWGのページ](https://compat.spec.whatwg.org/#css-keyword-mappings)を参考にしました。
