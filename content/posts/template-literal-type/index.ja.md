---
title: TypeScriptのテンプレートリテラル型の利用例
date: 2021-02-20
description: TypeScriptのテンプレートリテラル型の利用例を紹介します。
tags: ['TypeScript']
---

先日、TypeScriptのテンプレートリテラル型を使う機会がありました。

## モチベーション
フロントエンドで i18n を導入するために [i18next/i18next](https://github.com/i18next/i18next) を利用して文字列の辞書対応を進めていました。

辞書ファイルを入れ子のオブジェクトとして定義ができますが、キーを指定する場合は `common.badge.required` と指定する必要があります。TypeScripeで実装をするときの問題として、キーの文字列に対して型チェックが有効にならないため、タイポをしても気づかない問題があります。

```typescript
import { t } from 'i18next';

const translation = {
    common: {
        badge: {
            required: '必須',
            optional: '任意'
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

// badge => bage とタイポしているが実行時まで気づけない
console.log(t('common.bage.required'));
```

## テンプレートリテラル型で型定義
この問題はテンプレートリテラル型を活用してオブジェクトからキーを `.` で繋いだリテラル型を生成することで解消することができます。

`FlattenKeyOf` のユーティリティ型は型引数としてオブジェクトの型を受け取り、Mapped Types を利用してキーの一覧を取得します。取得したキーに対応する値の型を Conditional Types で判定しオブジェクト型である場合は、キーを `.` で先頭に結合して、対応する値のオブジェクトを `FlattenKeyOf` の型引数に渡して再帰的に呼び出すことで残りのキーを文字列として結合します。値がオブジェクトでない場合はキーをリテラル型として返します。  

`string & K` と書いている部分は `K` が `string | number | symbol` 型として扱われますが、テンプレートリテラル型が受け付ける型はプリミティブ型となっているため、型のミスマッチが発生してエラーが発生するので、Intersection Types を利用して `string` 型であれば `K` を返し違う場合は `never` を返すようにすることで型のエラーを回避しています。

```typescript
// const translation = { link: { top: 'トップページ' }}
// type keys = FlattenKeyOf<typeof translation> = 'link.top'
// FlattenKeyOf<{link: { top: 'トップページへ' }}> = {
//     ['link']: `link.top` <= `link.${FlattenKeyOf<{top: 'トップページへ'}}`
// }['link']                               ^
//                                         |__ 'top' = FlattenKeyOf<{top: 'トップページへ'}> = { ['top']: 'top' }['top']
type FlattenKeyOf<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K] extends Record<string, unknown> ? `${string & K}.${FlattenKeyOf<T[K]>}` : string & K
}[keyof T]

// common.badge.required | common.badge.optional
type ResourceKeys = FlattenKeyOf<typeof messages>;

// 引数のキー文字列が辞書ファイルのキー文字列のユニオン型に限定されるため、型チェックでエラーとなる。
console.log(t<string, ResouceKeys>('common.bage.required'))
```