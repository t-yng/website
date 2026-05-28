---
title: Should you use a form tag or a div tag for forms?
date: 2020-04-21
description: Comparing the form tag and the div tag for form implementation
tags: ['Frontend']
---

I was once asked: when submitting a form with Ajax, which is better — using `form` or `div`? The idea behind the question was that using `form` requires calling `preventDefault()` to stop the submit event, which is annoying to do every time. If the behavior is the same, wouldn't `div` be better?

The short answer is: **use the form tag**.

Example using a div tag:

```html
<script>
    const button = document.getElementById('send');
    button.addEventListener('click', () => {
        // Get input values, validate data, etc.
        fetch(...);
    });
</script>

<div id="form">
    <input type="text" id="name" />
    <div>
        <button id="send">send</button>
    </div>
</div>
```

Example using a form tag:

```html
<script>
    const form = document.getElementById('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Get input values, validate data, etc.
        fetch(...);
    });
</script>

<form id="form">
    <input type="text" id="name" />
    <div>
        <button type="submit" id="send">send</button>
    </div>
</form>
```

## Differences between the form tag and the div tag

When using the `form` tag, the browser provides these default behaviors:

1. You can submit the form by pressing Enter on the keyboard
2. If a form with `type="password"` is submitted successfully, the browser automatically offers to save the password

With the `div` tag, you would need to implement these yourself:

1. Listen for the Enter key event and register a callback
2. Whether you can trigger the browser's password-save prompt via an API is unclear

In particular, for item 2, a quick search suggests there is no API for this, so it may not be possible at all.

When you consider the browser's default behaviors, there is little benefit to using a `div` tag for forms. Unless you have a specific reason, it is better to simply use the `form` tag.
