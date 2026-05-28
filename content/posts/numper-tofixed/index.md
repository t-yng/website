---
title: JavaScriptで小数点の桁数を指定してフォーマット表示
date: 2020-09-01
description: JavaScriptで小数点の桁数を指定してフォーマットする方法です。
tags: ['フロントエンド']
---

JavaScriptで小数点の桁数を指定してフォーマット表示するには、 `toFixed()` メソッドを使用します。

[Number.prototype.toFixed() - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)

```js
const number = 12.3456789; 
console.log(seconds.toFixed()) // 1 : 近似値で表現され、引数省略した場合は少数点の桁数は0。
console.log(milliseconds.toFixed(2)) // 12.35 : 近似値で表現される
```

個人的な利用ケースとして、パフォーマンス計測で処理時間を表示する時に使うことが多いです。

```js
const start = performance.now();
// 何かしらの処理
const end = performance.now();

const seconds = ((start - end) / 1000).toFixed(2);
console.log('処理時間: ', seconds, 's');  // 1.23s 
```
