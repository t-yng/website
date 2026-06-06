---
title: TypeScript+Jestでテストを書くときに型安全にモックする方法を教えてほしかった
date: 2021-12-04
description: この記事はタイムリープTypeScript 〜TypeScript始めたてのあの頃に知っておきたかったこと〜の5日目の記事です。自分がTypeScriptを書き始めた頃に苦労したのが、Jestでテストを書くときのモックの型をどう書けば良いか分からないことでした。
tags: ['Jest', 'TypeScript', 'テスト']
---

この記事は
[タイムリープTypeScript 〜TypeScript始めたてのあの頃に知っておきたかったこと〜](https://qiita.com/advent-calendar/2021/timeleap-typescript)  
5日目の記事です。

## はじめに
自分がTypeScriptを書き始めた頃に苦労したのが、Jestでテストを書くときのモックの型をどう書けば良いか分からないことでした。

調べても型の指定方法が分からず、泣く泣く `as any` でコンパイラーを黙らせて、補完が効かなくなりモヤモヤしながらテストコードを書いていました。

TypeScriptで型を妥協してテストコードを書いていた時は次のような弊害もあったので、どう型安全にテストコードを書けば良いのか非常に知りたかったです。  
- 補完が効かなくなるのでコーディングが面倒になる
- プロパティをタイポした事に気づかずに、テストが失敗しても失敗している原因に気付けず疲弊する

## もくじ
- [モジュールモックの型指定](/post/jest-typescript-types#モジュールモックの型指定)
- [関数モックの型指定](/post/jest-typescript-types#関数モックの型指定)
- [スパイモックの型指定](/post/jest-typescript-types#スパイモックの型指定)

## モジュールモックの型指定
APIからユーザーの一覧を取得する関数のテストを考えてみます。

```typescript
// users.ts
import axios from 'axios';

export const all = () => {
  return axios.get('/users').then(res => res.data);
}
```

APIを直接リクエストせずにモックデータを返してテストが出来るように axios のモジュールをモックしてテストを書いてみます。

次の例では TypeScript は axios がモック化されたモジュールとして認識ができないので `axios.get.mockResolvedValue()` は型エラーとなります。  

当時はこの型エラーを解消するために `(axios.get as any).mockResolvedValue()` と書いていました。

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

モジュールをモックする場合は、モジュールを別の変数に代入して型指定を行うことでモック化されたモジュールとして扱うことができます。

Jestにはモック化の型定義が複数用意されており、モジュールモックの場合は `jest.Mocked<T>` の型定義を利用してモック化されていることを表現できます。  

`typeof axios` と指定することで、ジェネリクスの型もモジュールから自動生成ができます。

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

## 関数モックの型指定
次にデータをフェッチする関数を引数として渡す場合の実装を考えてみます。

```typescript
export type Fetch<T = any> = (url: string) => Promise<{ data: T }>;

export const all = (fetch: Fetch) => {
  return fetch("/users").then((res) => res.data);
};
```

関数のモックは `jest.fn()` を使い生成できます。

次のテストコードでは、 `mockImplementation()` を利用してモック関数を実装していますが、実装関数の引数と戻り値が `any` となるので、モック関数に不適切な実装を渡しても型エラーが発生しません。

そのため、型チェックは通過しますがテスト実行時に `fetch(...).then is not a function` というエラーが発生してしまいます。  

このエラーも型安全にテストコードが書けていれば、未然に回避することができます。

```typescript
import * as users from "./users";

describe("users", () => {
  it("fetch all", async () => {
    const usersMock = [{ name: "Bob" }];
    const response = { data: { users: usersMock } };

    // Promise<{data: any}> を返すべき所を誤って、User[] を返している
    // 型エラーにはならない
    const fetchMock = jest.fn().mockImplementation(() => usersMock);

    const result = await users.all(fetchMock);
    expect(result).toEqual(usersMock);
  });
});
```

`jest.fn()` の関数を型安全に実装するには大きく2つの方法があります。

1つは関数実装を`jest.fn()` の引数として直接渡す方法です。

引数として渡した場合に型推論により、モック関数の型が決まるので正しく実装されていない場合に `users.all(fetchMock)` の引数の型チェックで失敗します。

```typescript
const fetchMock = jest.fn(() => usersMock);
// Argument of type 'Mock<{ name: string; }[], []>' is not assignable to parameter of type 'Fetch<any>'.
const result = await users.all(fetchMock);
```

型が正しい関数実装を渡せば、型チェックが通過します。  

```typescript
const fetchMock = jest.fn(async (_url: string) => response);
const result = await users.all(fetchMock);
```

`mockImplementation()` で型安全に関数を実装したい場合は `jest.fn<T, Y>()` のジェネリクスで関数の引数と戻り値の型を指定できます。

```typescript
const fetchMock = jest.fn<ReturnType<Fetch>, Parameters<Fetch>>();

// error Argument of type '() => { name: string; }[]' is not assignable to parameter of type '(url: string) => Promise<{ data: any; }>'.
fetchMock.mockImplementation(() => usersMock);

// 型が正しい実装
fetchMock.mockImplementation(async (_url: string) => response);
users.all(fetchMock);
```

他には `jest.MockedFunction<T>` で変数に型注釈を書く方法があります。  
こちらの方が、ジェネリクスの指定をシンプルに書くことができます。

```typescript
const fetchMock: jest.MockedFunction<Fetch> = jest.fn();

// error Argument of type '() => { name: string; }[]' is not assignable to parameter of type '(url: string) => Promise<{ data: any; }>'.
fetchMock.mockImplementation(() => usersMock);

// 型が正しい実装
fetchMock.mockImplementation(async (_url: string) => response);
const result = await users.all(fetchMock);
```

`jest.MockedFunction<T>` で変数に型注釈を書くやり方は、`beforeEach()` で毎回モックの実装を初期化する場合には特に有効です。

```typescript
let fetchMock: jest.MockedFunction<Fetch>;

beforeEach(() => {
  fetchMock.mockImplementation(async (_url: string) => response);
});

it('fetch all users', () => {
  const result = await users.all(fetchMock);
})
```

## スパイモックの型指定
フロントエンドの実装をしていると、次のような Storage API をラップした `Storage` クラスを書くことがあります。

```typescript
export class Storage {
  get(key: string) {
    return localStorage.getItem(key);
  }
}
```

このクラスをテストしたい場合には `localStorage.getItem` をモックしてテストを書く必要があり、このようなモジュールの一部の関数だけをモックしたい場合には `jest.spyOn()` を利用してテストを書くことができます。

`jest.spyOn()` を普通に書く場合には、型推論によって型が決定されるため、そのままでも型安全に書くことができます。

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

`jest.spyOn()` でモックをする場合は、戻り値の型をジェネリクスで指定するような関数をモックする時に型に関する問題が発生します。

改めてユーザー情報の一覧を取得するモジュールを例に考えてみます。

```typescript
import axios from "axios";

export const all = () => {
  return axios.get("/users").then((res) => res.data);
};
```

今回は axios をモジュールモックせずに `axios.get` だけをモックしてテストを書いてみます。

`jest.spyOn<T, M>()` でジェネリクスを指定する場合には、モジュールの型とモックする関数名を文字列で指定します。

次のテストコードではジェネリクスで型を指定していますが、`spyAxiosGet.mockResolvedValue(usersMock)` で型エラーが発生しません。

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

    // spyAxiosGet: SpayInstance<Promise<unknown>>, ...>
    const spyAxiosGet = jest.spyOn<typeof axios, "get">(
      axios,
      "get"
    );
    // Promise<AxiosResponse>} を返すべき所を誤って User[] を返している
    // 型エラーになって欲しいがエラーにならない
    spyAxiosGet.mockResolvedValue(usersMock);
  });
});
```

`jest.spyOn()` と `axios.get()`の型定義をそれぞれ見てみると、`jest.spyOn()` の `SpyInstance<ReturnType<Required<T>[M]>, ...>` の部分で関数の型を取得していますが、関数のジェネリクスを指定していないため、`axios.get()` の戻り値は `Promise<unknown>` となってしまいます。

その結果 `spyAxiosGet` の変数が `SpayInstance<Promise<unknown>>, ...>` という型注釈となります。

上のテストコードでは `spyAxiosGet` の戻り値の型が `Promise<unknown>` となるため型エラーとならないのです。

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

この問題は型アサーションで `spyAxiosGet` の型を上書きすることで解消できます。

ここで `jest.fn()` と同様に型注釈で書こうとすると、戻り値の型が `Promise<unknown>` と`Promise<Partial<AxiosResponse<users.User[]>>>` で不一致が発生するので上手くいきません。

```typescript
const spyAxiosGet = jest.spyOn(axios, "get") as jest.SpyInstance<
  Promise<Partial<AxiosResponse>>
>;

// error Argument of type '{ name: string; }[]' is not assignable to parameter ...
spyAxiosGet.mockResolvedValue(usersMock);

// 型エラーは解消される
spyAxiosGet.mockResolvedValue(response);
```

## さいごに
自分のググり力が低いせいかTypeScriptをちゃんと書き始めた頃(2,3年前？)は、ここら辺の情報を検索しても全く見つけることが出来ませんでした。

ライブラリの型定義ファイルをちゃんと読むようにしたら、この型定義を使えば良いのか！このジェネリクスを指定すれば良いのか！と型の指定方法が分かるようになってきました。  

TypeScriptを書き始めて他のライブラリで似たような問題に直面している方がいたら、一歩踏み出してライブラリの型定義ファイルをしっかり読む事から始めてみると色々と型について理解できてくるのでオススメです。
