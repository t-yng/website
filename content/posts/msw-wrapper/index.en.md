---
title: Creating utility functions to wrap msw
date: 2022-12-07
description: Implementing useful utility functions by wrapping msw.
tags: ['Frontend', 'Testing']
---

## Mocking API responses with server.use

In msw, you can use `server.use` to change the API response for each test case.
However, `server.use` requires a lot of repetitive code, which can be tedious to write.

```ts
it('shows avatar image', () => {
  server.use(
    rest.get("/user", (_req, res, ctx) => {
      return res(
        ctx.json({ name: "taro", avatar: "https://example.com/images/xxxxx" })
      );
    })
  );
}) 

it('shows default image when no avatar is set', () => {
  server.use(
    rest.get("/user", (_req, res, ctx) => {
      return res(ctx.json({ name: "taro", avatar: null }));
    })
  );
});
```

## Wrapping server.use

Since there is a lot of repetitive code, you can create a `mockApiResponse` function that wraps `server.use`. This reduces the amount of code you need to write in each test, and makes the test code clearer and easier to understand.

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
it('shows avatar image', () => {
  mockApiResponse("get", "/user", {
    body: { name: "taro", avatar: "https://example.com/images/xxxxx" },
  });
});

it('shows default image when no avatar is set', () => {
  mockApiResponse("get", "/user", {
    body: { name: "taro", avatar: null },
  });
});
```

## Mocking pagination APIs

For pagination APIs, you need to write code that changes the response based on the request parameter, which makes the code quite long. Writing this in every test is annoying.

```ts
it("shows page 2 results after clicking Next", () => {
  server.use(
    rest.get("/articles", (req, res, ctx) => {
      const page = req.params["page"];
      let body;
      switch (page) {
        // /articles?page=1
        case "1": {
          body = {
            articles: [{ title: "Great article" }],
          };
        }
        // /articles?page=2
        case "2": {
          body = {
            articles: [{ title: "Good article" }],
          };
        }
      }
      return res(ctx.json(body));
    })
  );
});
```

You can create a wrapper function that takes the response for each page as an argument and switches the response based on the `page` parameter. This way, you only need to define the list of responses per page, which makes the API mock much simpler.

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
it("shows page 2 results after clicking Next", () => {
  const pages: Pages = {
    1: {
      body: {
        articles: [{ title: "Great article" }],
      },
    },
    2: {
      body: {
        articles: [{ title: "Good article" }],
      },
    },
  };
  mockPaginationApiResponse("get", "/articles", pages);
});
```
