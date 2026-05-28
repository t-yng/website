---
title: The benefits of self-reviewing your own pull requests
date: 2022-05-12
description: Let's talk about the benefits of reviewing your own pull requests.
tags: ['Other']
---

Let's talk about the benefits of reviewing your own pull requests.

## What is a self-review?

A self-review means reviewing your own pull request before asking others to review it.

For complex implementations or large pull requests, I sometimes review my own pull request before asking others for a review.

## Benefits of self-reviews

- You can find inefficient code, unnecessary logic, forgotten debug code, and places where a comment is needed
- You can see your code objectively, the way a reviewer would
- Reviewers get fewer small comments to make, which reduces their workload
- Fewer small comments also means less back-and-forth communication, which reduces the workload for the author too

When you are deeply focused on coding, your perspective can become narrow. Looking at the whole pull request after you finish often helps you notice more efficient ways to write things or easier-to-read implementations. Code that seemed clear while you had everything in your head can look confusing when you revisit it later. You may also find places where a comment would help others understand the code.

Reviewing objectively also helps you spot places where a reviewer is likely to ask questions. If you add an explanation comment in advance, you reduce the reviewer's workload and the total amount of communication in the review.

Self-reviews benefit not only yourself but also the reviewers. When asking someone to review your code, it is very important to think about **how to make the review as easy as possible for them**.

## Self-review driven development

You can also write code, create a pull request, do a self-review and leave comments, then fix the code based on those comments. This is a kind of self-review driven development.

In personal projects where asking someone else for a review is difficult, trying this style often results in cleaner code than writing with no review at all.
