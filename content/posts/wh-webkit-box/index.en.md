---
title: Truncating multi-line text and -webkit-box
date: 2021-06-04
description: A quick look at -webkit-box, which is used when truncating multi-line text.
tags: ['Frontend', 'CSS']
---

[-webkit-line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp) is a useful CSS property for truncating multi-line text with `...`.

This CSS property has usage restrictions: you need to set the `display` property to `-webkit-box` or `-webkit-inline-box`, and also set the `-webkit-box-orient` property to `vertical`.

```css
/* Typically used like this */
{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
```

The `-webkit-box` used here is actually a vendor prefix for the `flex` property.
It was the property used when WebKit implemented `flex` during the draft stage.

This information is from the [WHATWG page](https://compat.spec.whatwg.org/#css-keyword-mappings).
