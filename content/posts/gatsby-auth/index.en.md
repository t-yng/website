---
title: Building an authenticated site with GatsbyJS
date: 2020-09-27
description: Notes from following a tutorial on implementing authentication with GatsbyJS.
tags: ['Frontend', 'GatsbyJS']
---

These are my notes from working through the [Making a Site with User Authentication | Gatsby](https://www.gatsbyjs.com/tutorial/authentication-tutorial/) tutorial.

For the full implementation, see [t-yng/examples/gatsby-auth](https://github.com/t-yng/examples/tree/master/gatsby-auth).

## Requirements

* Users can log in and log out
* Protected pages cannot be viewed when not logged in

## Create the project

```
$ gatsby new gatsby-auth gatsbyjs/gatsby-starter-hello-world
$ cd gatsby-auth
```

## Implement the navigation bar

Create the navigation bar component.

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

Implement the page layout component and add the NavBar.

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

Update the home page to use the Layout component.

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

## Implement user authentication

First, define the User type as a model.

```typescript
// src/models/user.ts
export type User = {
  name: string;
  password: string;
};
```

Then implement the authentication logic.

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

## Add client-side routing

In GatsbyJS, files under the `pages` directory are output as static pages at build time. However, authenticated sites need to render different content per user, so static page builds cannot meet this requirement.
The solution is to create an app page and define client-side routes for dynamic rendering. See [Client-only Routes & User Authentication | Gatsby](https://www.gatsbyjs.com/docs/client-only-routes-and-user-authentication/) for details.

First, create the app page.

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
      <Profile path="/app/profile" /> {/* Add route definition */}
    </Router>
  </Layout>
);

export default App;
```

Implement the login page like this.

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
      alert('Login failed');
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block' }}>Username</label>
        <input id="username" name="username" onChange={handleUpdate} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block' }}>Password</label>
        <input id="password" name="password" type="password" onChange={handleUpdate} />
      </div>
      <button
        type="submit"
        style={{ backgroundColor: '#2e43ff', color: 'white', border: 'none' }}
      >
        Login
      </button>
    </form>
  );
};
```

Also implement the profile page shown after login. User info display will be added later.

```typescript
// src/components/app/Profile.tsx
import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';

interface ProfileProps extends RouteComponentProps {}

export const Profile: FC<ProfileProps> = () => (
  <>
    <div>Username: name will be shown here</div>
  </>
);
```

Add links to the navigation bar.

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
      <Link to="/app/profile">Profile</Link> {/* Add link to profile page */}
      {` `}
      <Link to="/app/login">Login</Link> {/* Add link to login page */}
    </nav>
  </div>
);
```

Add configuration in `gatsby-node.js` for client-side routing. Without this, accessing `/app/login` would be treated as a static page request.

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

## Page redirect based on auth state

Right now, anyone can access the profile page regardless of login state. Let's change it to redirect to the login page when not logged in.

Implement a `PrivateRoute` component to control access to protected pages.

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

Update the profile route definition.

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
      <PrivateRoute path="/app/profile" component={Profile} /> {/* Update profile route */}
    </Router>
  </Layout>
);

export default App;
```

## Implement logout

Implement the logout logic.

```typescript
// src/services/auth.ts
export const logout = () => {
  sessionStorage.removeItem('user');
};
```

Add a logout link to the navigation bar.

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

## Display profile information

Update to pass user information to private pages.

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

Display user information on the profile page.

```typescript
// src/components/app/Profile.tsx
import React, { FC } from 'react';
import { PrivateRouteComponentProps } from '../PrivateRoute';

interface ProfileProps extends PrivateRouteComponentProps {}

export const Profile: FC<ProfileProps> = ({ user }) => (
  <>
    <div>Username: {user.name}</div>
  </>
);
```
