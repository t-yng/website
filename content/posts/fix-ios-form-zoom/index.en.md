---
title: Fix auto-zoom on form fields in iOS
date: 2021-02-17
description: Solutions for the auto-zoom behavior that happens when focusing on form input elements in iOS.
tags: ['Frontend']
---

On iOS devices, when the font size of a form input element is less than 16px, the browser automatically zooms in when the input gets focus.
When auto-zoom happens, users are forced to zoom back out manually. This hurts usability, so it is best to avoid it when possible.

## Solutions

### Set the font size to 16px or larger

By setting the input element's font size to 16px or larger, you can prevent the browser from auto-zooming.

```css
input, textarea, select {
  font-size: 16px;
}
```

### Set the viewport

From a design point of view, there are often cases where you want the input font size to be less than 16px.
Also, if the font size is set with a relative unit like `rem`, changing the base value could unexpectedly make it less than 16px. So forcing the font size to 16px is not always a good solution.

Another approach is to set `maximum-scale=1` in the `viewport` meta tag.
The default value of `maximum-scale` is `1.6`. By changing it to `1.0`, even if the browser tries to auto-zoom, the maximum zoom level becomes 1x, which prevents zoom.

```html
<meta name="viewport" content="initial-scale=1.0, width=device-width, maximum-scale=1.0" />
```

## Which one should you use?

Setting the font size to 16px or more can become a hidden rule that is easy to forget, so I prefer to avoid it.
Personally, 16px also feels too large for input elements and limits design choices. So I think setting the viewport is generally the best approach.
