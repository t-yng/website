---
title: What I think about when doing frontend code reviews
date: 2021-12-09
description: This article is for Day 10 of the YAMAP Engineer Advent Calendar 2021. Code review is hard. Even after 6 years, I still can't say with confidence that I'm good at it.
tags: ['Frontend']
---

This article is for Day 10 of the [YAMAP Engineer Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers).

## Introduction

Code review is hard.
This is my 6th year doing it, and I still can't say with confidence that I'm good at code reviews.

I sometimes spend more time than planned. I sometimes point out small things that didn't need to be mentioned. I also sometimes miss important issues. The problems are endless.

While thinking about code review, I realized I had never really thought about how I actually do reviews. So I decided to organize what I keep in mind during reviews.

## Understanding the requirements

When I start a code review, the first thing I do is understand the requirements of the changes. By "requirements" I mean "what state should happen in what situation."

Code review is the process of checking changes from an objective point of view to find problems.
At this point, without a standard for **what is correct**, you cannot judge whether there are problems. So I always try to understand the requirements of the PR first to know **what is correct**.

### Read the PR description

When reviewing as a team, the PR description usually has the purpose of the change.

Reading the description first helps you understand the overall picture quickly. So I always read it carefully first. (This assumes the description is written well.)

### Check the behavior in the browser

Before reading the source code, I check the actual behavior in the browser to understand the changes.

Checking the actual behavior first makes it easier to understand the code. You can read the code while imagining what it is doing. This makes code review easier.

If something is unclear or I notice something during the initial check, I read only that part of the code to understand the requirements. I often find bugs at this step too.

### About API request requirements

If there are API requests, I also check the API response data structure carefully.
The main role of the frontend is to display API response data on the screen. So if you don't understand the data requirements, it's hard to judge whether the data is being handled correctly.

If I don't understand the meaning of an external API response, I check the API specification document. This sometimes helps me find unexpected bugs.

## Review priority

When reviewing, I divide items into categories and assign priorities.

1. Will this cause bugs or regressions?
2. Are there security problems?
3. Is the code easy to change? (Design)
4. Is the code easy to read?

By dividing and prioritizing review items, you can control how much time you spend on each part depending on the PR content.
- When you have little time for code review, focus on at least items 1 and 2, and spend less time on 3 and 4.
- For important features that will change often, spend more time checking all items carefully.

## Areas to focus on

- Important features of the service or anything related to money
- Parts where security bugs like XSS are likely to happen
  - For example, when referencing query parameters inside the app
- Files that are used in many places
  - Common libraries and components

## Will this cause bugs or regressions?

- Try unusual operations with a critical mindset
- Does the design break on both PC and mobile viewports?
- Are the CSS and JS supported by the target browsers?
  - ESLint can automate some of these checks
- Are conditional expressions correct?
- Does the change affect other parts that call the modified code?

### Places where bugs and regressions often happen

From my experience, the following areas are where bugs and regressions tend to happen, so I review them carefully.

- Parts with low code readability
- Parts where the developer's intent is unclear
  - Complex hidden requirements may exist, making regressions more likely
- Parts with complex data structures
  - Likely doing too many things, making the logic complex
- Parts with complex conditional branches
  - Likely doing too many things, making the logic complex
- Parts referenced from many places
  - Logic for different callers tends to be written in one place, making it complex
- Parts that seem unusual at first glance
  - If something feels like "I wouldn't implement it this way normally," complex hidden requirements may exist, making bugs more likely
- Parts that give you a vague feeling of unease
  - That feeling is often intuition from experience. You may have encountered a similar bug before, and the intuition is often correct

## Are there security problems?

- If user-input values like URL parameters are referenced, check for XSS and other security issues
- If features are restricted by permissions, check whether a local proxy could modify responses to bypass restrictions
  - If restrictions can be bypassed by modifying responses, think about the service risk if that happened

## Is the code easy to change? (Design)

- Imagine possible future requirement changes and check if the code can handle them easily
  - If a requirement change requires modifying multiple places, forgetting one place can cause regressions
  - More places to change means more risk of regressions
- Is a single file doing too many things?
  - Doing too much in one place makes logic complex and regressions more likely
  - It becomes harder to understand the scope of changes
  - More things to consider during changes means more time spent on feature work

## Code readability

- Could your future self read and understand the same code one month later?
- Is the code unnecessarily complex?
- Do variable names cause any misunderstanding?
- Imagine how you would implement it yourself

## Review comments

- When pointing out readability or design issues, try to give the reason it's bad AND a suggestion for improvement (with sample code)
  - If you only say something is bad, the reviewee doesn't know what to do and feels bad too
- Use labels
  - Labels help reviewees prioritize and handle comments efficiently
  - For example: FIX (bug fix), REFACTOR, COMMENT, etc.
  - [Adding Labels to Review Comments to Improve Development Efficiency - Qiita](https://qiita.com/godgarden/items/3ea57a7ee6dbff1df6e6)
- Use emoji or ASCII art
  - Code review involves pointing out issues with someone's code, so it can feel tense
  - I use emoji and ASCII art to soften the atmosphere a little
- Give a Good reaction when you find something good
  - Being praised feels good 👍
- Don't deny the person
  - Never say things like "Writing code like this is completely wrong!" Personal attacks are absolutely not okay
  - It would hurt if someone said that to me 🥲
- Don't make comments that could start a religious war
  - However, it's quite difficult to judge what might cause a religious war
  - For code style issues, it's best to define coding standards and check with a linter
  - If it might start a religious war, preface with "This might be a matter of personal preference, but..." and soften the comment
  - Use a COMMENT label to just express your feelings without demanding a change

## Enjoy code review 🎉

I try to do code reviews as if it were a game. If I find a bug, the reviewer wins! If there are no bugs, the reviewee wins! Having a goal makes code review fun and motivates me to look hard for bugs.

Note: Please keep the win/loss count to yourself.

## References

These are well-organized resources I recommend reading together.

- [Things I Keep in Mind for Better Code Reviews | Mercari Engineering](https://engineering.mercari.com/blog/entry/2019-12-22-080000/)
- [Things to Keep in Mind During Code Review - Qiita](https://qiita.com/awakia/items/8344ba751426e386e0f5)
- [What I Keep in Mind During Code Reviews | su- | note](https://note.com/su_k/n/nf23ab5c6dba2)
