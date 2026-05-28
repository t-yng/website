---
title: TypeScriptの型パラメーターの変性と変性アノテーション
date: 2023-10-21
description: TypeScriptの型パラメーターの変性のデフォルトの振る舞いとそれに関する変性アノテーションについてまとめました。
tags: ['TypeScript']
---

## 変性(variance)とは？
変性とは、ある型`T`がどの範囲までの型（サブタイプ、スーパータイプ）を受け入れかの性質を示す用語です。

|変性|許容する型|
|---|----|
|不変(invariant)|Tのみ|
|共変(covariant)|Tとそのサブタイプ|
|反変(contravariant)|Tとそのスーパータイプ|
|双変(bivariant)|Tとそのサブタイプとスーパータイプ|

次のサンプルでは`Dog`のスーパータイプは`Animal`でサブタイプが`Pomeranian`です。
この時の型`Dog`の各変性の違いを具体例として示します。

|変性|許容する型|
|---|----|
|不変|Dogのみ|
|共変|DogとPomeranian|
|反変|DogとAnimal|
|双変|DogとPomeranianとAnimal|

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

## 型パラメーターの変性について
TypeScriptの型パラメーター`T`はその型が参照される位置によって、型の変性が変わります。

- 型パラメーターがinputとして利用される場合は、型パラメーターは共変(covariant)
- 型パラメーターがoutputとして利用される場合は、型パラメーターは反変(contravariant)
- 型パラメーターがinputとoutputの両方で利用される場合は、型パラメーターは不変(invariant)

先ほどの`Dog`を例にして、型パラメーターの参照位置が異なる3つのインターフェースを定義して確認してみます。

- `GetState<Dog>`は共変となるので、`GetState<Pomeranian>`は代入可能で`GetState<Animal>`の代入は型エラーになる
- `SetState<Dog>`は反変となるので、`SetState<Animal>`は代入可能で`SetState<Pomeranian>`の代入は型エラーになる
- `GetSetState<Dog>`は不変となるので、`GetSetState<Pomeranian>`と`GetSetState<Animal>`共に代入は型エラーになる

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

## 変性アノテーション(variance annotation)
TypeScript4.7から上記の変性の挙動を`in`,`out`,`in out`のアノテーションで指定できるようになりました。

- `in(input)`: 型パラメーターの変性を反変とする（共変でないので注意）
- `out(output)`: 型パラメーターの変性を共変とする（反変でないので注意）
- `in out(input and output)`: 型パラメーターの変性を不変とする

キーワードだけ見ると`in`が共変、`out`が反変の感覚を持ってしまいますが、実際は逆になるので注意が必要です。
`in`,`out`,`in out`アノテーションと変性の振る舞いの関係は、先ほどのデフォルトの型パラメーターの挙動の説明に即して定義付けられています。これらのアノテーションはを覚えるには、ちゃんとデフォルトの挙動を理解しておくと良いです。

先ほどの例を変更して`SetState<in T>`として、変性を共変から反変へと変更してみます。
すると、`GetState`と同様に`SetState<Pomeranian>`は代入可能で`SetState<Animal>`の代入は型エラーになりました。

このサンプルは挙動チェックのためだけに書いているだけなので、基本的には変性を無理やり変更するのはバグの原因になるため非推奨です。どうしても必要な場合のみ回避策として使うようにしましょう。

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

## 変性アノテーションの使い所
変性アノテーションの振る舞いは理解できましたが、バグの原因になる可能性も考えると、どんな時にこのアノテーションが利用できるのでしょうか？
公式の[Optional Variance Annotations for Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#optional-variance-annotations-for-type-parameters)を読む限りではアノテーションのメリットは次の2点です。

- 振る舞いを明示することでコードの可読性が良くなり、意図しない型パラメーターの使用を抑えることができる。
- コンパイラーに変性を明示することで、計算コストを抑えて型推論の精度を上げる

### 可読性の向上
例えば、型パラメーターを入力としてのみ使うように制限しておきたく、型パラメーターの型を返す関数のような関数を今後の拡張も含めて防止したいとします。

```typescript
// 型Tは共変にしておきたい
interface State<T> {
  set: (value: T) => void;
}
```

変性アノテーションを使わない場合は、デフォルトの挙動に沿って型パラメーターの変性が共変から不変に変わります。
これにより、他の箇所で予期せぬ型エラーが発生する可能性があります。

```typescript
interface State<T> {
  // 後から他の開発者が意図に反して型パラメーターの型を返す関数を追加
  // 型パラメーターの変性が共変から不変に変わる
  get: () => T;
  set: (value: T) => void;
}
```

`in`アノテーションを付与しておくことで、型パラメーターを返す関数を追加した時に型エラーとすることができます。

※ このように書いていますが、実際の開発で具体的な型パラメーターの変性を制限したい場面に遭遇した事が無いので、ちゃんとした利用想定はできていません。

```typescript
// Type 'SetState<super-T>' is not assignable to type 'SetState<sub-T>' as implied by variance annotation.
//  The types returned by 'get()' are incompatible between these types.
//    Type 'super-T' is not assignable to type 'sub-T'
interface State<in T> {
  get: () => T;
  set: (value: T) => void;
}
```

## コンパイラーの型推論の精度向上
TypeScriptの型推論は、型パラメーターで`unknown`を指定している変数に対して型パラメーター`string`のの変数を代入できてしまいます。

```typescript
interface State<T> {
  value: T;
}

declare let stateUnknown: State<unknown>;
declare let stateString: State<string>;

// エラーになって欲しい
stateUnknown = stateString;
```

`in out`アノテーションで不変の変性を明示することで、この代入を型エラーとできます。

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

## 参考
- [Optional Variance Annotations for Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#optional-variance-annotations-for-type-parameters)
- [TypeScript における変性（variance）について \- 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/07/04/095737)

## さいごに
変性についての話をしている時に全く話について行けなかったので、TypeScriptの型パラメーターと変性について調べてみました。
調べていて、めちゃくちゃ奥が深い話だったので真面目に理解するには、型システムや型推論の本をちゃんと読まないとダメだなという気持ちになり、何が分かってないかは少し把握できました。
