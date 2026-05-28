---
title: Node.js18の環境でmswを使ったらハマった話
date: 2022-12-06
description: Node.js18の環境でmswを使った時にネットワークをインターセプトできない問題にハマった話です
tags: ['フロントエンド', 'テスト']
---

この記事は [YAMAP エンジニア Advent Calendar 2022](https://qiita.com/advent-calendar/2022/yamap-engineers) 7日目の記事です。

## mswとは？
ネットワークレベルでAPIリクエストをモックできるAPIモックライブラリです。
[MSW – Seamless API mocking library for browser and Node \| Mock Service Worker](https://mswjs.io/)

## Node.js18とグローバルfetch()
今までは`fetch()`を利用したフロントエンドのコードをNode.js環境でユニットテストを実行するには、グローバルスコープに`fetch()`が存在しないので、モックをしたりテスト実行時に[node-fetch](https://github.com/node-fetch/node-fetch)をPolyfillとして適用してグローバルスコープに`fetch()`を生やすなどの対応をしていました。

Node.js18から新たにグローバルスコープのfetch APIがデフォルトで利用可能になり、モック対応をせずともテスト実行時に`fetch()`が利用できる状態になりました。

## Node.js18環境でmswが動かない
グローバルスコープでfetch APIが利用可能になったので、何の対応もせずそのままmswでテストを実行できると思い次のサンプルコードを実行したら、mswがAPIリクエストをインターセプトしてくれずリクエスエラーが発生して盛大にハマりました。
`Caused by: Error: connect ECONNREFUSED ::1:3000`

当たり前に使えると思っていたので、無駄に時間を溶かしました。

```ts
// User.tsx
export const User = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/user").then(async (res) => {
      const user = await res.json();
      setUser(user);
    });
  }, []);

  if (user == null) {
    return null;
  }

  return <span>{user.name}</span>;
};

// User.test.tsx
import { rest } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import { server } from "../../test/server";

describe("User", () => {
  it("show user name", async () => {
    server.use(
      rest.get("/user", (_req, res, ctx) => {
        return res(ctx.json({ name: "taro" }));
      })
    );

    render(<User />);
    await waitFor(() => expect(screen.getByText("taro")).toBeInTheDocument());
  });
});
```

## mswのインターセプターと対象モジュール
[mswのインターセプター](https://github.com/mswjs/interceptors)は

- `http.get`/`http.request`
- `https.get`/`https.request`
- `XMLHttpRequest`
- `window.fetch`
- その他のAPIクライアント(i.e. axios, request, node-fetch, supertest, etc.)

により発行されたリクエストを割り込み対象としてサポートしています。

Node.jsのfetch APIは標準の`http`モジュールを利用しておらず、[undici](https://github.com/nodejs/undici)という別のモジュールによって実装されています。そのため、標準のfetch APIで発生したリクエストはmswのインターセプターの対象とならず今回のエラーが発生していました。

参考: [Node.js v18 の主な変更点](https://shisama.hatenablog.com/entry/2022/04/20/011103)

## node-fetchでfetch()を置き換える
現時点でmswを利用するには今まで通り`fetch()`をnode-fetchで置き換えてあげる必要があります。

```ts
// test/setup.ts
import _fetch from "node-fetch";
import { server } from "./server";

// グローバルスコープのfetch()をnode-fetchで置き換える
// @ts-ignore
global.fetch = _fetch;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['./test/setup.ts'], 
}
```

## mswのFetch APIへの対応
調べてみたら[標準のfetch APIに対応するPR](https://github.com/mswjs/interceptors/pull/283)が既に作成されていたので、近い将来にはモック対応をせずにそのままmswが使えるかもです。
