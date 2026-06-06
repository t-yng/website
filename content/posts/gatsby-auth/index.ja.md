---
title: GatsbyJSで認証サイトを実装する
date: 2020-09-27
description: GatsbyJSで認証サイトを実装するチュートリアルをやった時のまとめです。
tags: ['フロントエンド', 'GatsbyJS']
---

[Making a Site with User Authentication \| Gatsby](https://www.gatsbyjs.com/tutorial/authentication-tutorial/) のチュートリアルを試した時の作業を備忘録としてまとめました。

全体の実装は [t-yng/examples/gatsby-auth](https://github.com/t-yng/examples/tree/master/gatsby-auth) を参照してください。

## 要件
* ログイン、ログアウトができる
* 非ログイン状態で要認証ページが表示できないこと

## プロジェクトの作成

```
$ gatsby new gatsby-auth gatsbyjs/gatsby-starter-hello-world
$ cd gatsby-auth
```

## ナビゲーションバーを実装
ナビゲーションバーのコンポーネントを作成する。

```typescript
// src/components/NavBar.tsx
import React from "react";
import { Link } from "gatsby";

export const NavBar = () => (
  <div
    style={{
      display: "flex",
      flex: "1",
      justifyContent: "space-between",
      borderBottom: "1px solid #666",
    }}
  >
    <span>gatsby-auth</span>
    <nav>
      <Link to="/">Home</Link>
    </nav>
  </div>
);
```

ページのレイアウトコンポーネントを実装して、NavBarを追加します。

```typescript
// src/components/Layout
import React from "react";
import { NavBar } from "./NavBar";

export const Layout = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);
```

ホーム画面をLayoutコンポーネントを使って、修正します。

```typescript
// src/pages/index.tsx
import React from "react";
import { Layout } from "../components/Layout";

const Home = () => (
  <Layout>
    <div>This is Home</div>
  </Layout>
);

export default Home;
```

## ユーザー認証の実装

最初にユーザーの型定義をモデルとして実装します。

```typescript
// src/models/user.ts
export type User = {
  name: string;
  password: string;
};
```

次にユーザー認証のロジックを実装します。

```typescript
// src/services/auth.ts
import { User } from '../models/user';

export const login = (username: string, password: string) => {
  if (username === 'taro' && password === 'password') {
    setUser({ name: username, password });
    return true;
  } else {
    return false;
  }
};

export const getUser = (): User | undefined => {
  const user = sessionStorage.getItem('user');
  return user != null ? JSON.parse(user) : undefined;
};

export const isLoggedIn = () => {
  const user = getUser();
  return user != null;
};

const setUser = (user: User) => {
  sessionStorage.setItem('user', JSON.stringify(user));
};
```

## クライアントサイドのルーティングを追加
GatsbyJSは `pages` ディレクトリ配下のファイルはビルド時に静的ページとして出力されます。しかし、認証が必要なサイトではユーザー毎にレンダリングする内容が異なるため、静的ページのビルドでは要件を満たせません。  
この場合は、アプリケーションページを用意して、ルーティング定義を書く事でクライアント側で動的にレンダリングをする事で解決することができます。詳しい説明は [Client\-only Routes & User Authentication \| Gatsby](https://www.gatsbyjs.com/docs/client-only-routes-and-user-authentication/) に書かれています。

最初にアプリケーションページを用意します。

```typescript
// src/pages/app.tsx
import React from 'react';
import { Layout } from '../components/Layout';
import { Router } from '@reach/router';
import { Login } from '../components/app/Login';

const App = () => (
  <Layout>
    <Router basepath="/app">
      <Login path="/login" />
      <Profile path="/app/profile" /> {/* ルート定義を追加 */}
    </Router>
  </Layout>
);

export default App;
```

ログインページはこんな感じで実装します。

```typescript
// src/components/app/Login.tsx
import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';
import { isLoggedIn, login } from '../../services/auth';

interface LoginProps extends RouteComponentProps {}

export const Login: FC<LoginProps> = () => {
  const [user, setUser] = useState({ username: '', password: '' });

  const handleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const success = login(user.username, user.password);
    if (success) {
      navigate('/app/profile');
    } else {
      alert('ログインに失敗しました');
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block' }}>ユーザー名</label>
        <input id="username" name="username" onChange={handleUpdate} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block' }}>パスワード</label>
        <input id="username" name="username" onChange={handleUpdate} />
      </div>
      <button
        type="submit"
        style={{ backgroundColor: '#2e43ff', color: 'white', border: 'none' }}
      >
        ログイン
      </button>
    </form>
  );
};
```

ログイン後のプロフィールページも実装しておきます。ユーザー情報の表示は後で実装するので、今はページだけ作っている状態です。

```typescript
// src/components/app/Profile.tsx
import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';

interface ProfileProps extends RouteComponentProps {}

export const Profile: FC<ProfileProps> = () => (
  <>
    <div>ユーザー名: ここに名前が表示される</div>
  </>
);
```


ナビゲーションバーにリンクを追加します。

```typescript
// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'gatsby';

export const NavBar = () => (
  <div
    style={{
      display: 'flex',
      flex: '1',
      justifyContent: 'space-between',
      borderBottom: '1px solid #666',
    }}
  >
    <span>gatsby-auth</span>
    <nav>
      <Link to="/">Home</Link>
      {` `}
      <Link to="/app/profile">Profile</Link> {/* プロフィールページへのリンクを追加 */}
      {` `}
      <Link to="/app/login">Login</Link> {/* ログインページへのリンクを追加 */}
    </nav>
  </div>
);
```

クライアントでルーティングするために、gatsby-node.jsで設定を追加します。この設定を追加しないと、`/app/login` などにアクセスした時に静的ページの取得としてルーティングされます。

```javascript
// gatsby-node.js
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/^\/app/)) {
    page.matchPath = '/app/*';
    createPage(page);
  }
};
```

## 認証状態によるページ遷移
今の実装だと認証状態に関わらず、プロフィールページにアクセスできる状態になっています。これをログイン状態でない場合はログイン画面にリダイレクトするよう変更します。

認証が必要なページへのアクセスを制御する `PrivateRoute` コンポーネントを実装します。

```typescript
// src/components/PrivateRoute.tsx
import React, { Component, ComponentType, FC } from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import { isLoggedIn } from '../services/auth';

interface PrivateRouteProps extends RouteComponentProps {
  component: ComponentType;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({
  component: Component,
  ...others
}) => {
  if (!isLoggedIn()) {
    navigate('/app/login');
    return null;
  }

  return <Component {...others} />;
};
```

プロフィールへのルート定義を変更します。

```typescript
// src/pages/app.tsx
import React from 'react';
import { Router } from '@reach/router';
import { Layout } from '../components/Layout';
import { Login } from '../components/app/Login';
import { Profile } from '../components/app/Profile';
import { PrivateRoute } from '../components/PrivateRoute';

const App = () => (
  <Layout>
    <Router>
      <Login path="/app/login" />
      <PrivateRoute path="/app/profile" component={Profile} /> {/* プロフィールへのルート定義を修正 */}
    </Router>
  </Layout>
);

export default App;
```

## ログアウト機能の実装
ログアウト処理を実装します。

```typescript
// src/services/auth.ts
export const logout = () => {
  sessionStorage.removeItem('user');
};
```

ナビゲーションバーのリンクにログアウトを追加する。

```typescript
// src/components/NavBar.tsx
import React from 'react';
import { Link, navigate } from 'gatsby';
import { isLoggedIn, logout } from '../services/auth';

export const NavBar = () => {
  const handleClickLogout = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    logout();
    navigate('/app/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        flex: '1',
        justifyContent: 'space-between',
        borderBottom: '1px solid #666',
      }}
    >
      <span>gatsby-auth</span>
      <nav>
        <Link to="/">Home</Link>
        {` `}
        <Link to="/app/profile">Profile</Link>
        {` `}
        {isLoggedIn() ? (
          <a href="/" onClick={handleClickLogout}>
            Logout
          </a>
        ) : (
          <Link to="/app/login">Login</Link>
        )}
      </nav>
    </div>
  );
};
```

## プロフィール情報の表示
プライベートなページへユーザー情報を渡すように変更する。

```typescript
// src/components/PrivateRoute.tsx
import React, { ComponentType, FC } from 'react';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import { getUser, isLoggedIn } from '../services/auth';
import { User } from '../models/user';

export interface PrivateRouteComponentProps {
  user?: User;
};

interface PrivateRouteProps extends RouteComponentProps {
  component: ComponentType<PrivateRouteComponentProps>;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({
  component: Component,
  ...others
}) => {
  if (!isLoggedIn()) {
    navigate('/app/login');
    return null;
  }

  const user = getUser();

  return <Component {...others} user={user} />;
};
```

プロフィールページにユーザー情報を表示する。

```typescript
// src/components/app/Profile.tsx
import React, { FC } from 'react';
import { PrivateRouteComponentProps } from '../PrivateRoute';

interface ProfileProps extends PrivateRouteComponentProps {}

export const Profile: FC<ProfileProps> = ({ user }) => (
  <>
    <div>ユーザー名: {user.name}</div>
  </>
);
```
