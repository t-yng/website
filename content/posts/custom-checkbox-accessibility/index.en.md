---
title: Changing checkbox design with accessibility in mind
date: 2022-12-11
description: How to implement a custom Checkbox with accessibility considerations.
tags: ['Frontend', 'Testing']
---

## Problem with sample implementations found on Google

Customizing the checkbox design is difficult with the default checkbox, so you need to build your own. If you search "checkbox design change" on Google and look at the top results, many implementations hide `input[type="checkbox"]` with `display:none` like the sample below.

With this implementation, the `<input>` element cannot receive focus. This means keyboard users cannot select and toggle the checkbox with Tab and Space keys.
Also, screen readers cannot detect the checkbox, so screen reader users cannot even know it exists.

<iframe src="https://stackblitz.com/edit/react-ts-2tdsqo?embed=1&file=src/BadCheckbox/style.css&initialpath=?bad" style="width: 100%; height: 400px;"></iframe>

## Implementing a checkbox with accessibility

Since `display:none` prevents focus, use `opacity:0;` to hide the `<input>` instead.
Since the `<input>` is still hidden, add a design for when it receives focus.

With just this change, keyboard operation becomes possible, usability improves, and screen reader users can also operate the checkbox.

```css
/* src/GoodCheckbox/style.css */

/* Original checkbox (hidden) */
input[type='checkbox'] {
  opacity: 0;
  position: absolute;
}

/* Design for when focused */
input[type='checkbox']:focus-visible + label::before {
  border-color: blue;
}
```

<iframe src="https://stackblitz.com/edit/react-ts-2tdsqo?embed=1&file=src/GoodCheckbox/style.css" style="width: 100%; height: 400px;"></iframe>

## Refactoring the design implementation (Bonus)

This next part is a matter of preference, but the CSS pseudo-element approach used in the sample is not very intuitive, which makes it a bit hard to maintain. Let's refactor it to specify design without pseudo-elements.

By implementing a custom checkbox with a `<span>` tag and using CSS for styling instead of pseudo-elements, the code becomes more declarative and easier to understand.

The check icon is changed to display directly using a `<svg>` tag. One important note here: the check icon image is visual information and becomes just noise for screen reader users. If you remove `aria-hidden` and let the screen reader read it, it will say "image" unnecessarily when the checkbox is checked. So you need to set `<svg aria-hidden="true">`. With `@mui/icons-material`, `aria-hidden="true"` is set by default, so you don't need to specify it separately.

<iframe src="https://stackblitz.com/edit/react-ts-2tdsqo?embed=1&file=src/Checkbox/Checkbox.tsx&initialpath=?refactor" style="width: 100%; height: 400px;"></iframe>

```tsx
// src/Checkbox/Checkbox.tsx

import * as React from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import './style.css';

type CheckboxProps = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <label className="checkbox">
      <input type="checkbox" defaultChecked={checked} onChange={onChange} />
      <span className="custom-checkbox">
        {checked && <CheckRoundedIcon fontSize="small" />}
      </span>
      <span>Label</span>
    </label>
  );
};
```

```css
/* src/Checkbox/Checkbox.tsx */

.checkbox {
  display: inline-flex;
  cursor: pointer;
  gap: 8px;
}

.checkbox input[type='checkbox'] {
  opacity: 0;
  position: absolute;
}

.checkbox .custom-checkbox {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid lightgray;
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
}

.checkbox input[type='checkbox']:checked + .custom-checkbox {
  background-color: lightcoral;
}

.checkbox input[type='checkbox']:focus + .custom-checkbox {
  border-color: blue;
}
```
