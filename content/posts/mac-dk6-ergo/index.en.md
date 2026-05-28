---
title: Setting up the DK6 Ergo on macOS
date: 2021-05-28
description: How to set up the DK6 Ergo split keyboard on macOS
tags: ['Split Keyboard']
---

I bought the [DUMANG DK6 Ergo](http://www.beyondq.com/%E8%B6%85%E9%85%B7%E7%A7%91%E6%8A%80-%E6%AF%92%E8%9F%92%E9%94%AE%E7%9B%98-%E6%A8%A1%E5%9D%97%E5%8C%96%E9%94%AE%E7%9B%98-dk6-dumang.html), a split keyboard developed by a startup that allows you to freely rearrange the physical key layout.

There were a few issues when using this split keyboard on macOS, so I'm summarizing the setup steps I took.
Note: This article describes issues that occurred as of January 23, 2021. Since this keyboard is still under development, the situation may have improved by the time you read this.

## Key Combinations

### Problem

When using the DK6 Ergo on macOS, you cannot use key combinations that span the left and right keyboards. In Emacs, `Ctrl+N` moves the cursor down, but this requires pressing keys that are both on the right keyboard simultaneously. Pressing `Left Ctrl + Right N` does not work.

### Solution

Install [Karabiner-Elements](https://karabiner-elements.pqrs.org/). No special configuration is needed — just launching the app makes key combinations across the left and right keyboards work.
