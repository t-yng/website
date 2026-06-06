---
title: mswをラップした便利関数をつくる
date: 2022-12-07
description: mswをラップして便利なutil関数を実装します。
tags: ['フロントエンド', 'テスト']
---

## server.useでAPIレスポンスをモック
mswでは`server.use`を使うことでテストケースごとにAPIレスポンスを変更できます。
`server.use`は定型的なコードが多くテストを書いていると地味に記述が面倒になってきます。

```ts
it('アバター画像を表示', () => {
  server.use(
    rest.get("/user", (_req, res, ctx) => {
      return res(
        ctx.json({ name: "taro", avatar: "https://example.com/images/xxxxx" })
      );
    })
  );
}) 

it('アバター画像が未設定の場合にデフォルト画像を表示', () => {
  server.use(
    rest.get("/user", (_req, res, ctx) => {
      return res(ctx.json({ name: "taro", avatar: null }));
    })
  );
});
```

## server.useをラップする
定型的な記述が多いので`server.use`の実装をラップした`mockApiResponse`を実装しておくと、テストを書く時に記述量が減り快適にテストが書けるようになります。また、関数でインターフェースを新たに定義することでテストコードを直観的で分かりやすくもできます。

```ts
// mock/server.ts
import { rest } from "msw";
type Method = "get" | "post" | "put" | "delete" | "patch";

type ResponseBody = {
  [key in string]: any;
};

type MockResponse = {
  status?: number;
  body: ResponseBody;
};

export const mockApiResponse = (
  method: Method,
  path: string,
  response: MockResponse
) => {
  const status = response.status ?? 200;
  server.use(
    rest[method](path, (_req, res, ctx) => {
      return res(ctx.status(status), ctx.json(response.body));
    })
  );
};

// User.test.ts
it('アバター画像を表示', () => {
  mockApiResponse("get", "/user", {
    body: { name: "taro", avatar: "https://example.com/images/xxxxx" },
  });
});

it('アバター画像が未設定の場合にデフォルト画像を表示', () => {
  mockApiResponse("get", "/user", {
    body: { name: "taro", avatar: null },
  });
});
```

## ページネーションのAPIをモックする
ページネーションのAPIだとリクエストパラメーターでレスポンスを書き換えるコードが必要になるので、結構コード量が多くなります。テストごとにこの実装を書いていると結構面倒に感じてきます。

```ts
it("「次へ」をクリックして2ページ目の結果を表示", () => {
  server.use(
    rest.get("/articles", (req, res, ctx) => {
      const page = req.params["page"];
      let body;
      switch (page) {
        // /articles?page=1
        case "1": {
          body = {
            articles: [{ title: "すごい記事" }],
          };
        }
        // /articles?page=2
        case "2": {
          body = {
            articles: [{ title: "良い記事" }],
          };
        }
      }
      return res(ctx.json(body));
    })
  );
});
```

ページごとのレスポンスを引数として受け取り`page`パラメーターでレスポンスを切り替えるラップ関数を実装することで、ページネーションの結果一覧を定義するだけで、シンプルにAPIをモックできるようになります。

```ts
// mock/server.ts
export type Pages = {
  [key in number]: MockResponse;
};

export const mockPaginationApiResponse = (
  method: Method,
  path: string,
  pages: Pages
) => {
  server.use(
    rest[method](path, (req, res, ctx) => {
      const page = req.url.searchParams.get("page");
      const response = pages[Number(page)];
      const status = response.status ?? 200;
      return res(ctx.status(status), ctx.json(response.body));
    })
  );
};

// articles.test.ts
it("「次へ」をクリックして2ページ目の結果を表示", () => {
  const pages: Pages = {
    1: {
      body: {
        articles: [{ title: "すごい記事" }],
      },
    },
    2: {
      body: {
        articles: [{ title: "良い記事" }],
      },
    },
  };
  mockPaginationApiResponse("get", "/articles", pages);
});
```