---
title: Introduction to frontend TDD starting from bug fixes
date: 2021-12-22
description: This article is for Day 22 of the YAMAP Engineer Advent Calendar 2021. I am currently reading "Test-Driven Development" (TDD) in a book club. Starting TDD from bug fixes worked well for me, so I want to share the experience.
tags: ['Frontend', 'Testing']
---

This article is for Day 22 of the [YAMAP Engineer Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers).

## Introduction

I am currently reading [Test-Driven Development](https://www.amazon.co.jp/dp/B077D2L69C/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1) (TDD) in a book club.
I have learned a lot from the book and wanted to apply it in real work. Starting TDD from bug fixes worked well for me, so I want to share it.

## Why start from bug fixes?

The hardest part of TDD for me is **not knowing what tests to write before implementing**.
If you have little experience writing tests, it is hard to imagine what to test when there is no code yet.

With bug fixes, the code already exists, and you need to write a test that reproduces the bug. What to test is clear, which makes it much easier to write tests.

For this reason, bug fixes are a good way to practice the TDD flow without much difficulty.

## Try TDD for bug fixing

### Overview

Consider a `UserBio` component that shows a user's avatar image and username.

This component has a bug where avatar images are not handled correctly.
- Bug: When no avatar image is set, a broken image is displayed
- Expected behavior: When no avatar image is set, show a thumbnail image

```tsx
// src/components/UserBio.tsx
import { FC } from 'react';

type Props = {
  user: {
    name: string;
    avatar?: string;
  }
}

export const UserBio: FC<Props> = ({ user }) => {
  return (
    <div>
      <img src={user.avatar} />
      <span>{user.name}</span>
    </div>
  )
}
```

### Write a test that reproduces the bug

Hold back the urge to fix the code right away. Write the test first.

What test should you write?
Since the goal is bug fixing, you need to write a test that **reproduces the bug**. What to test is very clear.

Normally, if no tests exist at all, you would also write a test for the normal avatar display case first. But I'll skip that here for simplicity.

```typescript
// src/components/UserBio.spec.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { UserBio } from "./UserBio";

describe("UserBio", () => {
  it("shows a thumbnail image when no avatar is set", () => {
    render(<UserBio user={{ name: "Taro Test" }} />);

    const expected = "https://example.com/images/avatar";
    expect(screen.getByRole("img")).toHaveAttribute("src", expected);
  });
});
```

Run the test.
The test fails as expected. The test that reproduces the bug is ready.

```shell
$ yarn jest src/components/UserBio.spec.tsx

 FAIL  src/components/UserBio.spec.tsx
  UserBio
    ✕ shows a thumbnail image when no avatar is set (85 ms)

  ● UserBio › shows a thumbnail image when no avatar is set

    expect(element).toHaveAttribute("src", "https://example.com/images/avatar") // element.getAttribute("src") === "https://example.com/images/avatar"

    Expected the element to have attribute:
      src="https://example.com/images/avatar"
    Received:
      null
```

### Fix the bug

Now that we have a test that reproduces the bug, let's write the fix.

```tsx
const AVATAR_THUMBNAIL = 'https://example.com/images/avatar';

export const UserBio: FC<Props> = ({ user }) => {
  return (
    <div>
      <img src={user.avatar ?? AVATAR_THUMBNAIL} />
      <span>{user.name}</span>
    </div>
  );
}
```

Run the test again.
The test passes and the bug is fixed! ⸜(｡˃ ᵕ ˂ )⸝

```shell
$ yarn jest src/components/UserBio.spec.tsx

 PASS  src/components/UserBio.spec.tsx
  UserBio
    ✓ shows a thumbnail image when no avatar is set (61 ms)
```

### No browser needed for verification

During this bug fix, I never opened a browser to verify the behavior.
I will do a final browser check before creating the PR, but that is only once.

One of the benefits of frontend TDD is that verification becomes simpler.
In normal frontend development, you often switch between code and browser many times during implementation. This is surprisingly time-consuming.

By writing tests first in TDD and automating verification, you can reduce this cost and improve development speed.

## Closing

I introduced frontend TDD through a very simple bug fix example.

For TDD and testing, I think the most important thing is to **write lots of tests and gain experience**, no matter how simple they are.

If you want to try TDD but don't know where to start, try writing tests for a very simple fix like this one.
