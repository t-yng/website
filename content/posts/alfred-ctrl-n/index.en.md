---
title: Fix Ctrl+N cursor movement not working in Alfred
date: 2021-10-02
description: How to fix the issue where Ctrl+N selects a package instead of moving the cursor in Alfred
tags: ['Other']
---

## Problem

I use Emacs key bindings in my daily work. In Alfred's search results, when I press Ctrl+N to move the cursor down, it selects a package instead of moving the cursor. This was a problem for me.

![Ctrl+N selects a package](alfred-ctrl-n-bad.gif)

## Solution

In Alfred settings, go to Features > Actions > Show Actions and uncheck the "ctrl" checkbox. This fixes the problem.

![Alfred settings screen](alfred-settings.jpeg)
