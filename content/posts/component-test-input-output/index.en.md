---
title: Writing unit tests by thinking about component inputs and outputs
date: 2021-12-07
description: When writing frontend component unit tests for the first time, it can be hard to know "what to test." This article explains how thinking about component inputs and outputs helps you understand what to test.
tags: ['React', 'Frontend', 'Testing']
---

This article is for Day 7 of the [YAMAP Engineer Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers).

## Introduction

When writing frontend component unit tests for the first time, it can be hard to know "what to test," making it difficult to write good tests.

This article explains how thinking about component inputs and outputs helps you understand what to test in unit tests.

## What do automated tests test?

First, let me clarify what automated tests generally test.

Automated tests check whether **a given input produces the expected output**. If you keep this in mind, you can write most automated tests. (This is a bit of an oversimplification.)

For example, consider a test for a function that checks whether a URL belongs to the Google domain.

```typescript
const isGoogleDomain = (url: string): boolean => {
  return url.match(/^http[s]:\/\/google.com\//) != null;
}
```

If asked to write tests for this function, what would you write?
Most people would think of at least these two tests:
1. Does it return true for `https://google.com/search?q=test`?
2. Does it return false for `https://example.com`?

Summarizing the inputs and outputs of these test cases:

| Input | Output |
|--|--|
| https://google.com/search?q=test | true |
| https://example.com | false |

## Why component tests are hard

As we just saw, utility functions have clear inputs and outputs, so they are relatively easy to test. Compared to them, components can feel harder to test because inputs and outputs are less obvious.

I think the main reason component tests feel hard is not that **you don't know how to write tests**, but that **you don't know the inputs and outputs**.

In other words, if you can identify a component's inputs and outputs, you can write component tests in the same way as utility function tests.

## Component inputs and outputs

From here I'll use React function components as an example, but the basic idea is the same for Vue components too.
A React function component is, as the name says, just a function. A function has inputs and outputs.

So what is the output of a function component?
It is the **HTML DOM structure**.

The inputs are mainly these three types:
1. Props
2. User events such as clicks
3. Global stores such as Redux

From this, you can write component tests by checking **whether the correct HTML structure is output for each of the three types of input**.

## Why it feels strange not to write tests for components

When you think about it this way, function components and utility functions are the same — they are both just functions.

When implementing a function component, you often have conditional logic like "if props are X, output DOM Y," or calculations like "calculate the number of days from start and end dates and show the text."

These are clearly logic. It feels strange to write tests for utility function logic but not for component logic.

So I think it's fine to write component tests with the same mindset as utility function tests.

## Try writing tests by thinking about inputs and outputs

### Think about inputs and outputs

Let's think about the inputs and outputs of the following counter component.

Before moving on, try to think about the inputs and outputs yourself.

```tsx
const Counter = ({count}: {count: number}) => {
    const [countState, setCount] = useState(count);

    const handleClick = () => {
        setCount(count => count + 1);
    }

    return (
        <div>
            <span>{count}</span>
            <button onClick={handleClick}>Count Up</button>
        </div>
    );
}
```

The inputs and outputs look like this:

| Input | Output |
|--|--|
| count props | Text showing the count value |
| Button click event | Text showing count + 1 |

Here, it doesn't matter that the output is a span element. What matters is that **the count value is output as text**. So I describe the output as "text."

### Write the tests

Now that we have identified the inputs and outputs, let's write the tests.

I'll use jest + testing-library. Even if you haven't used them before, you should be able to understand what is happening and get a feel for how tests are written.

First, let's write a test for the output based on props input.

| Input | Output |
|--|--|
| count props | Text showing the count value |

The expected behavior is "the count value passed as a prop is output as text in the HTML." So we can check whether the value passed as a prop (5) is displayed as text in the DOM.

```tsx
import { render } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
    it('shows the count number specified by props', () => {
        render(<Counter count={5} />);
        const count = screen.queryByText(5);
        expect(count).toBeInTheDocument();
    }
});
```

Next, let's write a test for the button click input.

| Input | Output |
|--|--|
| Button click event | Text showing count + 1 |

The idea is the same as for props. When a button click event is given as input, check whether the count value plus 1 is output as text.

```tsx
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
    it('shows the count number specified by props', () => {
        render(<Counter count={5} />);
        const count = screen.queryByText(5);
        expect(count).toBeInTheDocument();
    }

    it('increases the displayed count when the button is clicked', () => {
        render(<Counter count={5} />);
        const button = screen.getByRole('button');
        userEvent.click(button);
        userEvent.click(button);
        const count = screen.queryByText(7);
        expect(count).toBeInTheDocument();
    }
});
```

## Think about tests for a more realistic component

The counter component might be too simple as an example. Let's think about tests for a more realistic component: `NotificationLink`, which shows a link based on notification content.

`NotificationLink` receives a `Notification` object as a prop and returns an `a` tag based on its property values.

The requirements are:
- If `webLaunchUrl` is null or empty, show the text inside a `span` element
- If `webLaunchUrl` is an external link, show an `a` element that opens the link in a new tab
- If `webLaunchUrl` is an internal link, show an `a` element with a relative path as the link

Based on this information, let's think about the inputs and outputs.

```tsx
export const NotificationLink = ({notification}: Notification) => {
    const webLaunchUrl = notification.webLaunchUrl;

    if(webLaunchUrl == null || webLaunchUrl === '') {
        return <span>{notification.text}</span>
    }

    if (isExternalLink(webLaunchUrl)) {
        return <a href={webLaunchUrl} target="_blank">{notification.text}</a>
    }

    const relativePath = getRelativePath(webLaunchUrl);
    return <a href={relativePath}>{notification.text}</a>   
}
```

The inputs and outputs:

| Input | Output |
|--|--|
| notification with null webLaunchUrl | Text of notification.text (not inside an `a` element) |
| notification with external webLaunchUrl | `a` element that opens external link in new tab |
| notification with internal webLaunchUrl | `a` element with relative path as link |

Now that we know the inputs and outputs, let's write the tests.

```tsx
import { render } from '@testing-library/react';
import { NotificationLink } from './NotificationLink';

describe('NotificationLink', () => {
    it('shows only text when webLaunchUrl is null', () => {
        const notification = { webLaunchUrl: null, text: 'test' };
        render(<NotificationLink notification={notification} />);
        const text = screen.queryByText(notification.text);
        const link = screen.queryByRole('link');

        expect(text).toBeInTheDocument();
        expect(link).not.toBeInTheDocument();
    });

    it('shows a new-tab link when webLaunchUrl is an external link', () => {
        const notification = { webLaunchUrl: 'https://example.com', text: 'test' };
        render(<NotificationLink notification={notification} />);
        const link = screen.queryByRole('link');

        expect(link).toHaveAttribute('href', notification.webLaunchUrl);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveTextContent(notification.text);
    });

    it('shows a relative path link when webLaunchUrl is an internal link', () => {
        const notification = { webLaunchUrl: 'https://t-yng.jp/tag/typescript', text: 'test' };
        render(<NotificationLink notification={notification} />);
        const link = screen.queryByRole('link');

        expect(link).toHaveAttribute('href', '/activities');
        expect(link).not.toHaveAttribute('target', '_blank');
        expect(link).toHaveTextContent(notification.text);
    });
})
```

## Benefits of writing component tests

### A standard for good design

"Code that is hard to test has bad design" is a common saying in testing, and this applies to components too.

When you try to write tests for a complex component with many responsibilities, the inputs and outputs become unclear and you need many mocks, making tests very hard to write.

Component design is especially difficult to judge. Writing tests gives you a clear standard: if tests are easy to write, the design is probably good. This gives you confidence to move forward with your implementation.

### Safe refactoring

In general, automated tests are most useful when you are refactoring — that is, modifying existing code.

During code review, it is common to refactor components based on review feedback. If you have tests, you can modify the code with confidence.

Tests give you benefits even if you write them just before release.

### Reduced verification cost

For the `NotificationLink` component, if the `notification` object comes from an API response, manual verification requires mocking different API responses and manually operating the browser for each pattern. This can take 10 to 15 minutes including setup.

If you write component tests, you can mock the input, and after writing the test once, you can verify in 5 seconds with a button click.

In cases where the display changes based on API responses, writing tests is much more efficient than manual verification.

## Summary

- Component tests become easier to write when you clearly identify inputs and outputs and check whether the expected output is produced.
- Component unit tests have many benefits, including reducing verification cost.

There is a lot you won't understand about component tests until you actually write them. So start writing even just one simple test case!
