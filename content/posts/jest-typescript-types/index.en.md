---
title: I wish someone had taught me how to type-safe mock in TypeScript + Jest
date: 2021-12-04
description: This article is for Day 5 of "Time Leap TypeScript — Things I Wish I Knew When I Started TypeScript." When I first started writing TypeScript, one thing I struggled with was how to write types for mocks when writing tests with Jest.
tags: ['Jest', 'TypeScript', 'Testing']
---

This article is for Day 5 of [Time Leap TypeScript — Things I Wish I Knew When I Started TypeScript](https://qiita.com/advent-calendar/2021/timeleap-typescript).

## Introduction

When I first started writing TypeScript, one thing I struggled with was how to write types for mocks in Jest tests.

I couldn't find how to specify types, and ended up silencing the compiler with `as any`, losing autocompletion and writing tests with a vague feeling of unease.

When writing tests with compromised types in TypeScript, I had these problems:
- No autocompletion, making coding tedious
- Missing typos in property names, then being confused when tests fail without understanding why

## Table of contents

- [Typing Module Mocks](#typing-module-mocks)
- [Typing Function Mocks](#typing-function-mocks)
- [Typing Spy Mocks](#typing-spy-mocks)

## Typing module mocks

Let's consider a test for a function that fetches a list of users from an API.

```typescript
// users.ts
import axios from 'axios';

export const all = () => {
  return axios.get('/users').then(res => res.data);
}
```

Let's write a test by mocking the axios module to return mock data without making real API requests.

In the next example, TypeScript cannot recognize axios as a mocked module, so `axios.get.mockResolvedValue()` causes a type error.

Back then, I used to write `(axios.get as any).mockResolvedValue()` to work around this.

```typescript
// users.spec.ts
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', async () => {
  const usersMock = [{name: 'taro'}];
  // error TS2339: Property 'mockResolvedValue' does not exist on type
  axios.get.mockResolvedValue({ data: { users: usersMock } });  
});
```

When mocking a module, assign the module to a new variable with a type annotation to treat it as a mocked module.

Jest provides several mock type definitions. For module mocks, use `jest.Mocked<T>` to express that a module is mocked.

Using `typeof axios` lets you automatically get the generic type from the module.

```typescript
// users.spec.ts
import axios from 'axios';
import * as users from './users';

jest.mock('axios');

const axiosMock = axios as jest.Mocked<typeof axios>;

test('should fetch users', async () => {
  const usersMock = [{name: 'taro'}];
  axiosMock.get.mockResolvedValue({ data: { users: usersMock } });
});
```

## Typing function mocks

Next, consider an implementation where a data fetching function is passed as an argument.

```typescript
export type Fetch<T = any> = (url: string) => Promise<{ data: T }>;

export const all = (fetch: Fetch) => {
  return fetch("/users").then((res) => res.data);
};
```

You can create a function mock with `jest.fn()`.

In the test below, `mockImplementation()` is used to implement the mock function, but the implementation function's arguments and return type are `any`. So passing a wrong implementation doesn't cause a type error.

The type check passes, but at runtime you get `fetch(...).then is not a function`. Writing type-safe test code would prevent this error.

```typescript
import * as users from "./users";

describe("users", () => {
  it("fetch all", async () => {
    const usersMock = [{ name: "Bob" }];
    const response = { data: { users: usersMock } };

    // Should return Promise<{data: any}> but incorrectly returns User[]
    // No type error
    const fetchMock = jest.fn().mockImplementation(() => usersMock);

    const result = await users.all(fetchMock);
    expect(result).toEqual(usersMock);
  });
});
```

There are two main ways to write `jest.fn()` functions in a type-safe way.

The first is to pass the function implementation directly as an argument to `jest.fn()`.

When passed as an argument, type inference determines the mock function's type. If the implementation is incorrect, the type check of `users.all(fetchMock)` fails.

```typescript
const fetchMock = jest.fn(() => usersMock);
// Argument of type 'Mock<{ name: string; }[], []>' is not assignable to parameter of type 'Fetch<any>'.
const result = await users.all(fetchMock);
```

If you pass a correctly typed implementation, the type check passes.

```typescript
const fetchMock = jest.fn(async (_url: string) => response);
const result = await users.all(fetchMock);
```

When using `mockImplementation()` in a type-safe way, you can specify the function's argument and return types with generics in `jest.fn<T, Y>()`.

```typescript
const fetchMock = jest.fn<ReturnType<Fetch>, Parameters<Fetch>>();

// error Argument of type '() => { name: string; }[]' is not assignable to parameter of type '(url: string) => Promise<{ data: any; }>'.
fetchMock.mockImplementation(() => usersMock);

// Correct implementation
fetchMock.mockImplementation(async (_url: string) => response);
users.all(fetchMock);
```

Another way is to write a type annotation on the variable using `jest.MockedFunction<T>`. This lets you specify the generic more simply.

```typescript
const fetchMock: jest.MockedFunction<Fetch> = jest.fn();

// error Argument of type '() => { name: string; }[]' is not assignable to parameter of type '(url: string) => Promise<{ data: any; }>'.
fetchMock.mockImplementation(() => usersMock);

// Correct implementation
fetchMock.mockImplementation(async (_url: string) => response);
const result = await users.all(fetchMock);
```

Using `jest.MockedFunction<T>` for type annotation is especially useful when initializing the mock implementation in `beforeEach()`.

```typescript
let fetchMock: jest.MockedFunction<Fetch>;

beforeEach(() => {
  fetchMock.mockImplementation(async (_url: string) => response);
});

it('fetch all users', () => {
  const result = await users.all(fetchMock);
})
```

## Typing spy mocks

In frontend development, you might write a `Storage` class that wraps the Storage API.

```typescript
export class Storage {
  get(key: string) {
    return localStorage.getItem(key);
  }
}
```

To test this class, you need to mock `localStorage.getItem`. When you only want to mock specific functions in a module, use `jest.spyOn()`.

When writing `jest.spyOn()` normally, type inference determines the types, so you can write it in a type-safe way already.

```typescript
import { Storage } from "./storage";

describe("Storage", () => {
  it("get data", () => {
    const storage = new Storage();
    const spyGet = jest.spyOn(window.localStorage, "getItem");
    // error TS2345: Argument of type '42' is not assignable to parameter of type 'string | null'
    spyGet.mockReturnValue(42);
  });
});
```

A type problem occurs with `jest.spyOn()` when mocking functions that use generics for the return type.

Let's look at the user list fetching module again.

```typescript
import axios from "axios";

export const all = () => {
  return axios.get("/users").then((res) => res.data);
};
```

This time, instead of mocking the axios module, we only mock `axios.get`.

When specifying generics with `jest.spyOn<T, M>()`, you specify the module type and the function name as a string.

In the test below, generics are specified, but `spyAxiosGet.mockResolvedValue(usersMock)` does not cause a type error.

```typescript
import axios from "axios";
import * as users from "./users";

describe("users", () => {
  it("update user", async () => {
    const usersMock = [{ name: "taro" }];
    const response: AxiosResponse = {
      data: { users: usersMock },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };

    // spyAxiosGet: SpyInstance<Promise<unknown>, ...>
    const spyAxiosGet = jest.spyOn<typeof axios, "get">(
      axios,
      "get"
    );
    // Should return Promise<AxiosResponse> but incorrectly returns User[]
    // Should cause a type error but doesn't
    spyAxiosGet.mockResolvedValue(usersMock);
  });
});
```

Looking at the type definitions of `jest.spyOn()` and `axios.get()`, `jest.spyOn()` gets the function type from `SpyInstance<ReturnType<Required<T>[M]>, ...>`, but without specifying the function's generics, the return type of `axios.get()` becomes `Promise<unknown>`.

As a result, the type of `spyAxiosGet` becomes `SpyInstance<Promise<unknown>, ...>`, so no type error occurs when passing `usersMock`.

```typescript
// jest/index.d.ts
function spyOn<T extends {}, M extends FunctionPropertyNames<Required<T>>>(
    object: T,
    method: M
): Required<T>[M] extends (...args: any[]) => any
    ? SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>
    : never;

// axios/index.d.ts
get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
```

This problem can be solved by using a type assertion to override the type of `spyAxiosGet`.

If you try to write it as a type annotation like `jest.fn()`, the return types `Promise<unknown>` and `Promise<Partial<AxiosResponse<users.User[]>>>` don't match, so it doesn't work.

```typescript
const spyAxiosGet = jest.spyOn(axios, "get") as jest.SpyInstance<
  Promise<Partial<AxiosResponse>>
>;

// error Argument of type '{ name: string; }[]' is not assignable to parameter ...
spyAxiosGet.mockResolvedValue(usersMock);

// Type error is resolved
spyAxiosGet.mockResolvedValue(response);
```

## Closing

Maybe it was my poor search skills, but when I first started writing TypeScript properly (2-3 years ago?), I couldn't find any information on this topic at all.

When I started reading library type definition files carefully, I began to understand what type definitions to use and what generics to specify.

If you're new to TypeScript and facing similar problems with other libraries, I recommend taking the step of carefully reading library type definition files. It will help you understand types much better.
