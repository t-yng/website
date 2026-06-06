---
title: Alfred で Ctrl + N でカーソル移動ができない問題を解消
date: 2021-10-02
description: Alfred で Ctrl + N でパッケージ選択できない問題を解消
tags: ['その他']
---

## 問題
自分は普段 Emacs キーバインドを利用しているのですが、Alfred の検索結果でカーソル移動をするために Ctrl + N をタイプするとカーソル移動せずにパッケージが選択される問題に悩まされていました。

![ctrl+nでパッケージ選択される](alfred-ctrl-n-bad.gif)

## 解決策
Alfredの設定で Features > Actions > Show Actions で ctrl のチェックボックスを外せば問題は解消しました。

![Alfredの設定画面](alfred-settings.jpeg)
