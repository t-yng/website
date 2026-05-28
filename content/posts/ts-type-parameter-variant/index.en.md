---
title: TypeScript type parameter variance and variance annotations
date: 2023-10-21
description: An overview of the default behavior of type parameter variance in TypeScript and the variance annotations available.
tags: ['TypeScript']
---

## What is Variance?

Variance is a term that describes what range of types (subtypes, supertypes) a given type `T` can accept.

| Variance | Accepted types |
|---|---|
| Invariant | T only |
| Covariant | T and its subtypes |
| Contravariant | T and its supertypes |
| Bivariant | T, its subtypes, and its supertypes |

In the example below, the supertype of `Dog` is `Animal`, and the subtype is `Pomeranian`.
Here is what each variance means for type `Dog`:

| Variance | Accepted types |
|---|---|
| Invariant | Dog only |
| Covariant | Dog and Pomeranian |
| Contravariant | Dog and Animal |
| Bivariant | Dog, Pomeranian, and Animal |

```typescript
interface Animal {
  animalFeature: any;
}

interface Dog extends Animal {
  dogFeature: any;
}

interface Pomeranian extends Dog {
  pomeranianFeature: any;
}
```

## Type parameter variance

In TypeScript, the variance of a type parameter `T` changes based on where that type is used.

- If a type parameter is used as input, it is contravariant
- If a type parameter is used as output, it is covariant
- If a type parameter is used as both input and output, it is invariant

Using `Dog` as an example, let's define three interfaces with the type parameter used in different positions and verify the behavior.

- `GetState<Dog>` is covariant, so `GetState<Pomeranian>` can be assigned to it, but `GetState<Animal>` cannot
- `SetState<Dog>` is contravariant, so `SetState<Animal>` can be assigned to it, but `SetState<Pomeranian>` cannot
- `GetSetState<Dog>` is invariant, so neither `GetSetState<Pomeranian>` nor `GetSetState<Animal>` can be assigned

```typescript
interface GetState<T> {
    get: () => T;
}

interface SetState<T> {
    set: (value: T) => void;
}

interface GetSetState<T> {
    get: () => T;
    set: (value: T) => void;
}

declare let getAnimal: GetState<Animal>;
declare let getDog: GetState<Dog>;
declare let getPomeranian: GetState<Pomeranian>;

// Type 'GetState<Animal>' is not assignable to type 'GetState<Dog>'.
getDog = getAnimal;
getDog = getDog;
getDog = getPomeranian;

declare let setAnimal: SetState<Animal>;
declare let setDog: SetState<Dog>;
declare let setPomeranian: SetState<Pomeranian>;

setDog = setAnimal;
setDog = setDog;
// Type 'SetState<Pomeranian>' is not assignable to type 'SetState<Dog>'.
setDog = setPomeranian;

declare let getSetAnimal: GetSetState<Animal>;
declare let getSetDog: GetSetState<Dog>;
declare let getSetPomeranian: GetSetState<Pomeranian>;

// Type 'GetSetState<Animal>' is not assignable to type 'GetSetState<Dog>'.
getSetDog = getSetAnimal;
getSetDog = getSetDog;
// Type 'GetSetState<Pomeranian>' is not assignable to type 'GetSetState<Dog>'.
getSetDog = getSetPomeranian;
```

## Variance annotations

Starting from TypeScript 4.7, you can explicitly specify variance behavior using `in`, `out`, and `in out` annotations.

- `in` (input): Makes the type parameter contravariant (not covariant — be careful)
- `out` (output): Makes the type parameter covariant (not contravariant — be careful)
- `in out` (input and output): Makes the type parameter invariant

Just looking at the keywords, you might think `in` means covariant and `out` means contravariant, but it's actually the opposite — be careful.
The relationship between `in`, `out`, `in out` and variance is defined based on the default type parameter behavior described earlier. To understand these annotations, it helps to first understand the default behavior well.

In the example below, I changed `SetState<in T>` to switch the variance from covariant to contravariant.
As a result, like `GetState`, `SetState<Pomeranian>` can now be assigned, but `SetState<Animal>` cannot.

This sample is only written to check the behavior. In general, forcibly changing variance is not recommended because it can cause bugs. Use this only as a last resort when absolutely necessary.

```typescript
interface SetState<out T> {
    set: (value: T) => void;
}

declare let setAnimal: SetState<Animal>;
declare let setDog: SetState<Dog>;
declare let setPomeranian: SetState<Pomeranian>;

// Type 'SetState<Animal>' is not assignable to type 'SetState<Dog>'.
setDog = setAnimal;
setDog = setDog;
setDog = setPomeranian;
```

## When to use variance annotations

Now that we understand the behavior, when would you actually use variance annotations, given the risk of bugs? Based on the official [Optional Variance Annotations for Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#optional-variance-annotations-for-type-parameters), the two main benefits are:

- Making the behavior explicit improves code readability and prevents unintended use of the type parameter
- Telling the compiler the variance explicitly reduces computation cost and improves type inference accuracy

### Improving readability

For example, suppose you want to restrict a type parameter to only be used as input, and you want to prevent any future additions that return the type parameter.

```typescript
// We want type T to be contravariant
interface State<T> {
  set: (value: T) => void;
}
```

Without variance annotations, the default behavior would change the variance from contravariant to invariant if someone added an output use of the type parameter. This could cause unexpected type errors elsewhere.

```typescript
interface State<T> {
  // Another developer later adds a function that returns the type parameter against the original intent
  // The variance changes from contravariant to invariant
  get: () => T;
  set: (value: T) => void;
}
```

By adding the `in` annotation, adding a function that returns the type parameter will now cause a type error.

*Note: I haven't actually encountered a case in real development where I needed to restrict type parameter variance like this, so I don't have a well-tested real-world use case.*

```typescript
// Type 'SetState<super-T>' is not assignable to type 'SetState<sub-T>' as implied by variance annotation.
//  The types returned by 'get()' are incompatible between these types.
//    Type 'super-T' is not assignable to type 'sub-T'
interface State<in T> {
  get: () => T;
  set: (value: T) => void;
}
```

## Improving compiler type inference accuracy

TypeScript's type inference allows assigning a variable with type parameter `string` to one with type parameter `unknown`.

```typescript
interface State<T> {
  value: T;
}

declare let stateUnknown: State<unknown>;
declare let stateString: State<string>;

// This should be an error but it isn't
stateUnknown = stateString;
```

By explicitly marking the variance as invariant with `in out`, this assignment becomes a type error.

```typescript
interface State<in out T> {
  value: T;
}

declare let stateUnknown: State<unknown>;
declare let stateString: State<string>;

// Type 'State<string>' is not assignable to type 'State<unknown>'.
//  Type 'unknown' is not assignable to type 'string'.
stateUnknown = stateString;
```

## References

- [Optional Variance Annotations for Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#optional-variance-annotations-for-type-parameters)
- [TypeScript における変性（variance）について - 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/07/04/095737)

## Conclusion

I investigated TypeScript type parameters and variance because I couldn't follow a discussion about variance at all. It turned out to be a very deep topic, and I realized I need to read a proper book on type systems and type inference to truly understand it. At least now I have a better idea of what I don't know.
