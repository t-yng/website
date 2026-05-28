---
title: バグ修正から始めるフロントエンドのTDD入門
date: 2021-12-22
description: この記事は YAMAP エンジニア Advent Calendar 2021 の22日目の記事です。現在、輪読会で「テスト駆動開発」（TDD）を読み進めています。本を読んで色々と知識が入ってきているので、業務でアウトプットしてみたいなと思い、バグ修正からTDDを初めてみたら良かったので紹介します。
tags: ['フロントエンド', 'テスト']
---

この記事は [YAMAP エンジニア Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers) の22日目の記事です。

## はじめに
現在、輪読会で [テスト駆動開発](https://www.amazon.co.jp/dp/B077D2L69C/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1)（TDD）を読み進めています。  
本を読んで色々と知識が入ってきているので、業務でアウトプットしてみたいなと思い、バグ修正からTDDを初めてみたら良かったので紹介します。

## なぜバグ修正から始めるのか？
TDDをする上で一番難しいなと感じるのが、**実装前に何のテストを書けば良いか分からない**という部分です。  
今までテストを書いた経験が少ないと、対象となるコードが無い状態からテストを書き始めるのはイメージがしづらく中々テストを書くことができません。

その点、バグ修正の場合は既にコードが存在しており、バグを再現するテストを書けば良く何をテストするかも明確になっているので、非常にテストコードが書きやすいという利点があります。

そのため、バグ修正は比較的スムーズにTDDのフローを回しやすく手軽にTDDを体験することができます。

## TDDでバグ修正に挑戦する
### 概要
ユーザーのアバター画像とユーザー名を表示する `UserBio` コンポーネントについて考えてみます。

このコンポーネントはアバター画像について考慮が漏れておりリンク切れのバグが発生する可能性があります。
- バグ: アバター画像が未設定の場合にリンク切れで画像が表示される  
- 期待する動作: アバター画像が未設定の場合はサムネイル画像を表示する

```tsx
// src/components/UserBio.tsx
import { FC } from 'react';

type Props = {
  user: {
    name: string;
    avatar?: string;
  }
}

export const UserBio: FC<Props> = ({ user }) => {
  return (
    <div>
      <img src={user.avatar} />
      <span>{user.name}</span>
    </div>
  )
}
```

### バグを再現するテストコードを書く
コードのバグを修正したい気持ちをぐっ！と抑えて、先にテストコードを書いていきます。

どんなテストコードを書けば良いでしょうか？  
今回の目的はバグ修正のため**バグを再現する**テストコードを書けば良いので、何をテストするかは非常に明確です。

本来であれば、テストが全く書かれいない場合はアバター画像を表示するテストも先に書いておいた方が良いですが説明の都合で割愛しています。

```typescript
// src/components/UserBio.spec.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { UserBio } from "./UserBio";

describe("UserBio", () => {
  it("アバター画像が未設定のときにサムネイル画像を表示する", () => {
    render(<UserBio user={{ name: "テスト太郎" }} />);

    const expected = "https://example.com/images/avatar";
    expect(screen.getByRole("img")).toHaveAttribute("src", expected);
  });
});
```

テストを実行してみます。  
正常にテストが失敗してくれたので、これでバグを再現するテストコードが実装できました。

```shell
$ yarn jest src/components/UserBio.spec.tsx

 FAIL  src/components/UserBio.spec.tsx
  UserBio
    ✕ アバター画像が未設定のときにサムネイル画像を表示する (85 ms)

  ● UserBio › アバター画像が未設定のときにサムネイル画像を表示する

    expect(element).toHaveAttribute("src", "https://example.com/images/avatar") // element.getAttribute("src") === "https://example.com/images/avatar"

    Expected the element to have attribute:
      src="https://example.com/images/avatar"
    Received:
      null
```

### バグ修正対応
バグを再現するテストができたので、後は楽しくバグ修正のコードを書くだけです。

```tsx
const AVATAR_THUMBNAIL = 'https://example.com/images/avatar';

export const UserBio: FC<Props> = ({ user }) => {
  return (
    <div>
      <img src={user.avatar ?? AVATAR_THUMBNAIL} />
      <span>{user.name}</span>
    </div>
  );
}
```

バグ修正ができたので、改めてテストを実行してみます。  
無事にテストが通りバグが修正されたのを確認できました！ ⸜(｡˃ ᵕ ˂ )⸝

```shell
$ yarn jest src/components/UserBio.spec.tsx

 PASS  src/components/UserBio.spec.tsx
  UserBio
    ✓ アバター画像が未設定のときにサムネイル画像を表示する (61 ms)
```

### ブラウザ不要の検証
今回のバグ修正ではコードを変更してバグが修正されたことを確認する過程全くブラウザを利用しませんでした。  
PR作成前に念の為のブラウザ確認はしますが、検証でブラウザ操作をするのはその1度だけに抑えることができます。

フロントエンドをTDDで開発するメリットの一つとしてこの検証の簡略化があります。  
フロントエンドで検証を進めるために何度もコードとブラウザを行き来してブラウザ操作をする事が多いですが、この実装途中におけるブラウザ操作が地味に面倒で開発コストとして発生します。

TDDでテストを先に書いて検証を自動化することで、この検証コストを減らして開発効率を上げられるメリットがあります。

## さいごに
今回は非常に簡単なバグ修正を例にフロントエンドでのTDDについて紹介しました。

TDDやテストを書くには、どんな簡単なモノでも良いので**たくさんテストを書いて経験を得る**ことが何より大事だと思います。  

TDDで開発をしてみたいけどなかなか初めの一歩が踏み出せない場合は、今回のケースのようなすごく簡単な修正からテストを書き始めてみましょう。
