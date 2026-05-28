---
title: Formatting numbers with a fixed number of decimal places in JavaScript
date: 2020-09-01
description: How to format numbers with a specified number of decimal places in JavaScript.
tags: ['Frontend']
---

To format a number with a specified number of decimal places in JavaScript, use the `toFixed()` method.

[Number.prototype.toFixed() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)

```js
const number = 12.3456789; 
console.log(number.toFixed()) // 12 : Returns an approximation; without an argument, decimal places are set to 0.
console.log(number.toFixed(2)) // 12.35 : Returns an approximation
```

Personally, I often use this when displaying processing time during performance measurement.

```js
const start = performance.now();
// some process
const end = performance.now();

const seconds = ((end - start) / 1000).toFixed(2);
console.log('Processing time: ', seconds, 's');  // 1.23s 
```
