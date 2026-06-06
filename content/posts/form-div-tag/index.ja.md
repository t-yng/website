---
title: フォーム実装にformタグを使うかdivタグを使うか
date: 2020-04-21
description: フォーム実装にformタグを使うかdivタグを使うか
tags: ['フロントエンド']
---

前に Ajax でフォームの送信をする時に form と div どちらを使うのが良いのか？という質問をされました。質問の意図としては、form タグで実装した場合は送信イベントを止めるために `preventDefault()` を呼ぶ必要があり、この処理を毎回呼ぶのが面倒なので挙動が変わらないなら div タグ の方が良いのでないか？という話でした。

結論だけ先に書いておくと **form タグを使おう** です。

div タグでの実装例

```html
<script>
    const button = document.getElementById('send');
    button.addEventListener('click', () => {
        // inputの値を取得してデータバリデーションとかする
        fetch(...);
    });
</script>

<div id="form">
    <input type="text" id="name" />
    <div>
        <button id="send">send</button>
    </div>
</div>
```

form タグでの実装例

```html
<script>
    const form = document.getElementById('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // inputの値を取得してデータバリデーションとかする
        fetch(...);
    });
</script>

<form id="form">
    <input type="text" id="name" />
    <div>
        <button type="submit" id="send">send</button>
    </div>
</form>
```

## form タグと div タグの違い

form タグで実装した場合は以下の挙動がブラウザのデフォルトとして動作します。

1. キーボードの Enter を押してリクエストの送信ができる
2. type="password" を含むフォームの送信が成功したら、ブラウザのパスワード保存を自動で確認してくれる

div タグで実装した場合はこれらを自前で実装する工数が発生します。

1. Enter キーのイベントを監視してコールバックを登録する。
2. ブラウザのパスワード保存の確認は API 経由で出来るのか不明

特に 2 つめのパスワード保存については、簡単に調べた感じだと API が提供されていないので、対応ができない可能性が高い気がします。  
このようにブラウザのデフォルトの挙動を考えると、フォームを div タグ で実装するメリットはあまりなく、特別な理由が無ければ素直に form タグ で実装しておいた方が良いです。
