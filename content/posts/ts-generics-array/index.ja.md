---
title: TypeScriptでジェネリクスと配列で戻り値のキーを制限する
date: 2023-10-20
description: 引数の配列の値をキーに持つオブジェクトを返す関数を型安全にする実装を紹介します。また、const-type-parametersを利用して、より型安全にする方法をまとめています。
tags: ['TypeScript']
---

この記事では、引数の配列の値をキーに持つオブジェクトを返す関数を型安全にする実装を紹介します。
また、const-type-parametersを利用して、より型安全にする方法をまとめています。

## 配列でキーを指定する関数
次のように引数で指定した配列の値をキーにランダムな数値を持つオブジェクトを生成する関数を型安全にしていく方法を考えてみます。
この関数では戻り値のキーの型が`string`のため、戻り値のオブジェクトで存在しないキーを指定しても型エラーになりません。

```typescript
const useIds = <T extends string[]>(keys: T) => {
    return keys.reduce((acc, key: string) => {
        acc[key] = Math.floor(Math.random() * 10)
        return acc;
    } ,{} as {[key: string]: number});    
}

const ids = useIds(['a', 'b']);

// エラーにならない
console.log(ids.hoge);
```

## 型安全にする
ポイントは`[key in (typeof keys[number])]: number`の所です。MappedTypesと配列からユニオン型を生成する仕組みを組み合わせることで、配列の値だけをキーとして持つオブジェクトの型を生成できます。

また、`T extends readonly string[]`で`readonly`を指定することで、呼び出し側で値を`['a', 'b'] as const`と固定することができます。呼び出し側で`as const`を指定できないと、ユニオン型を生成できず、キーを制限することができなくなります。

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

## const-type-parametersでリファクタ
先ほどのサンプルコードでは呼び出し側で`as const`を指定して値を固定する必要がありました。逆に言うとTypeScriptに慣れてない人と一緒に開発をする時に`as const`が指定されずに型安全にならない可能性があります。

人のスキルに依存せずに、できる限り仕組みで強制できるようにしたいです。

TypeScript5.0から追加された[const-type-parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)を利用することで、関数側で仕組みを強制することができます。

`const T extends readonly string[]`とジェネリクスの前に`const`を付けることで、型推論が`string[]`から`['a','b']`となります。
関数の内部の型定義を意識せずに、文字列の配列を渡すだけで型安全に関数を利用することが可能になります。

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