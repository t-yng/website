---
title: Reactでフォーカス中にのみ表示される要素をChromeのdevtoolsでデバッグする
date: 2023-03-03
description: フォーカス中にのみ表示されるDOM要素をChromeのdevtoolsでデバッグする方法について解説します
tags: ['フロントエンド']
---

Reactでフォーカス中にのみ表示されるポップアップをデバッグする時にハマったので解決法をまとめました。

## 直面した問題
次のようなinput要素にフォーカスが当たっている時だけ表示される、ポップアップのCSSをデバッグする状況を考えます。

<iframe width="100%" height="400px" src="https://stackblitz.com/edit/react-ts-gnwa6a?embed=1&file=App.tsx&view=preview"></iframe>

ポップアップが表示された状態でdevtoolsで対象のDOM要素をクリックすると、フォーカスが外れるためポップアップが消えてしまいます。

Reactでは状態に応じてDOM要素を描画しないことが多く、今回のケースでもポップアップのDOM要素がDOMツリーから消えてしまうためCSSを確認できなくなります。

## Enable a focused page を有効にする
More tools > Rendering > Enable a focused page を有効にすることで、この問題を解消できます。

この設定を有効にすることでページ全体がフォーカスされた状態を維持できるので、devtoolsをクリックしてもポップアップが消えずに残り続けてデバッグすることできます。

![devtoolsでDOMをクリックしてもポップアップが非表示ならない様子](emulate-focus-page.png)