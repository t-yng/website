---
title: A use case for TypeScript template literal types
date: 2021-02-20
description: An example of using TypeScript template literal types.
tags: ['TypeScript']
---

I recently had a chance to use TypeScript's template literal types.

## Motivation

I was working on adding i18n to the frontend using [i18next/i18next](https://github.com/i18next/i18next).

You can define a dictionary file as a nested object, but when specifying a key you need to write it as `common.badge.required`. The problem when using TypeScript is that there is no type checking on the key string, so typos go unnoticed.

```typescript
import { t } from 'i18next';

const translation = {
    common: {
        badge: {
            required: 'Required',
            optional: 'Optional'
        }
    }
}

export const resources = {
    ja: {
        translation: translation,
    },
} as const;

i18n.init({
    lng: 'ja',
    resources: resources,
})

// 'badge' is typo'd as 'bage', but you won't notice until runtime
console.log(t('common.bage.required'));
```

## Defining types with template literal types

This problem can be solved by using template literal types to generate a literal type of all keys joined by `.` from the object.

The `FlattenKeyOf` utility type takes an object type as a type argument and uses Mapped Types to get a list of keys. It uses Conditional Types to check if the value for each key is an object. If it is, it adds the key followed by `.` to the front and recursively calls `FlattenKeyOf` on the nested object to build the remaining key string. If the value is not an object, it returns the key as a literal type.

The `string & K` part is written because `K` is treated as `string | number | symbol`, but template literal types only accept primitive types. Using an Intersection Type returns `K` if it is a `string`, and `never` otherwise, which avoids the type error.

```typescript
// const translation = { link: { top: 'Top Page' }}
// type keys = FlattenKeyOf<typeof translation> = 'link.top'
// FlattenKeyOf<{link: { top: 'Top Page' }}> = {
//     ['link']: `link.top` <= `link.${FlattenKeyOf<{top: 'Top Page'}>`
// }['link']                               ^
//                                         |__ 'top' = FlattenKeyOf<{top: 'Top Page'}> = { ['top']: 'top' }['top']
type FlattenKeyOf<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K] extends Record<string, unknown> ? `${string & K}.${FlattenKeyOf<T[K]>}` : string & K
}[keyof T]

// common.badge.required | common.badge.optional
type ResourceKeys = FlattenKeyOf<typeof messages>;

// The key string argument is limited to a union type of keys in the dictionary file,
// so a type error will occur for typos.
console.log(t<string, ResouceKeys>('common.bage.required'))
```
