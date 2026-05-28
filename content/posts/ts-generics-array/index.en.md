---
title: Using TypeScript generics with arrays to restrict return value keys
date: 2023-10-20
description: How to make a function that returns an object with array element values as keys type-safe. Also covers how to make it even safer using const-type-parameters.
tags: ['TypeScript']
---

This article shows how to make a function that returns an object with array element values as keys type-safe. It also covers how to make it even safer using const-type-parameters.

## A function that specifies keys with an array

Let's think about how to make this function type-safe. It takes an array of strings as an argument and creates an object with those values as keys, each holding a random number.
Currently, the return type's key is `string`, so accessing a key that doesn't exist doesn't cause a type error.

```typescript
const useIds = <T extends string[]>(keys: T) => {
    return keys.reduce((acc, key: string) => {
        acc[key] = Math.floor(Math.random() * 10)
        return acc;
    } ,{} as {[key: string]: number});    
}

const ids = useIds(['a', 'b']);

// No error
console.log(ids.hoge);
```

## Making it type-safe

The key part is `[key in (typeof keys[number])]: number`. By combining Mapped Types with the technique to create a union type from an array, we can generate an object type that only has array element values as keys.

Also, specifying `readonly` in `T extends readonly string[]` allows the caller to use `as const` to fix the values as `['a', 'b'] as const`. Without `as const` on the caller's side, the union type cannot be generated and the keys cannot be restricted.

```typescript
const useIds = <T extends readonly string[]>(keys: T) => {
    return keys.reduce((acc, key: typeof keys[number]) => {
        acc[key] = Math.floor(Math.random() * 10)
        return acc;
    } ,{} as {[key in (typeof keys[number])]: number});    
}

const ids = useIds(['a', 'b'] as const);

// Property 'hoge' does not exist on type '{ a: number; b: number; }'.(2339)
console.log(ids.hoge);
```

## Refactoring with const-type-parameters

In the previous code, the caller had to add `as const` to fix the values. This means that developers unfamiliar with TypeScript might forget `as const` and lose type safety.

It would be better to enforce this with the code itself, rather than relying on each person's skill.

Using [const-type-parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) added in TypeScript 5.0, you can enforce this on the function side.

By adding `const` before the generic type as `<const T extends readonly string[]>`, the type inference changes from `string[]` to `['a', 'b']`.
This allows the function to be used in a type-safe way just by passing a string array, without the caller needing to think about the type definitions.

```typescript
const useIds = <const T extends readonly string[]>(keys: T) => {
    return keys.reduce((acc, key: typeof keys[number]) => {
        acc[key] = Math.floor(Math.random() * 10)
        return acc;
    } ,{} as {[key in (typeof keys[number])]: number});    
}

const ids = useIds(['a', 'b']);

// Property 'hoge' does not exist on type '{ a: number; b: number; }'.(2339)
console.log(ids.hoge);
```
