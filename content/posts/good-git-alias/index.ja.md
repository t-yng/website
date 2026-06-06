---
title: 開発効率を劇的に改善しているgitエイリアスと設定
date: 2021-12-28
description: この記事は YAMAP エンジニア Advent Calendar 2021 の23日目の記事です。自分は普段ターミナルでgitの操作をしているのですが、開発とレビューを並行して多くのブランチを切り替えたりするなど地味にgitの操作に時間を要する事が多く、効率化を求めて色々とgitエイリアスを設定したら良い感じになったのでまとめてみました。
tags: ['git']
---

この記事は [YAMAP エンジニア Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers) の23日目の記事です。

自分は普段ターミナルでgitの操作をしているのですが、開発とレビューを並行して多くのブランチを切り替えたりするなど地味にgitの操作に時間を要する事が多く、効率化を求めて色々とgitエイリアスを設定したら良い感じになったのでまとめてみました。

## git switch-pr

### 課題
自分がPRレビューをするためにブランチを切り替える時は「GitHub上でブランチ名をコピーしてターミナルに貼り付けて...」という作業をよくやっていました。
1日に3,4件かそれ以上のPRレビューをしていると、この作業が地味にストレスとして感じていました。

### 改善

![switch-prコマンドの実行の様子](swpr.gif)

`git switch-pr` はリモートリポジトリのプルリクの一覧からブランチ移動をするためのエイリアスです。

ブランチ名をコピペする手間が減りPRレビューが非常に快適になりました！

プルリクの一覧は [GitHub CLI](https://github.com/cli/cli) で取得をしています。

自分が管理しやすいように `switch-pr` としてエイリアスを作成してから、その短縮形として別に `swpr` を設定するという設定をしています。

```shell
// ~/.gitconfig
[alias]
  switch-pr = !gh pr list | awk '{print $(NF-1)}' | peco | xargs git switch
  swpr = switch-pr
```

## git history

### 課題
feature ブランチで開発を進めながらPRレビューをしていると、1日に3,4個のブランチを移動することもあります。
複数のブランチを行き来する時に、わざわざブランチ名を思い出しながらブランチを切り替えるのは非常に面倒でした。
特にチケットとPRを紐づけるためにブランチ名にチケット番号などを記載していると、余計に入力が大変になります。

### 改善

![historyコマンドの実行の様子](history.gif)

`git history` は過去に移動したブランチ一覧からブランチを選択して移動ができるエイリアスです。

`peco` を使って一覧からブランチを選択可能にしているので、ブランチ名を覚えていなくてもスムーズに移動ができるようになりました。

```shell
// ~/.gitconfig
[alias]
  history = !git --no-pager reflog | awk '$3 == \"checkout:\" && /moving from/ {print $8}' | awk '!a[$0]++' | head | peco | xargs git checkout
```

## push.default current
### 課題
作業後に初めてブランチをプッシュする時は `git push origin feat/123-feature1` というような形式でプッシュをしていました。
これは上流ブランチの紐付けが存在しないためです。

### 改善
`git push` の引数を省略した場合の挙動は `push.default` で設定することができ `push.default current` を設定することで、作業中のブランチと同名のリモートブランチに対してpushしてくれるようになります。

この設定をすることで、初めてのプッシュでも `git push` だけでプッシュができるようになります。

```shell
$ g config --global push.default current

~/.gitconfig
[push]
	default = current
```

## git create-pr

### 課題
GitHub上でプルリクエスト(PR)を作成する場合に、初回プッシュをした場合はターミナル上にPR作成のURLを表示してくれます。
しかし、2回目以降の場合はこのURLが表示されずGitHub上からPR作成を進める必要があります。
正直、1回目のURLクリックだけでも面倒だと思っていたので、GitHub上で数クリックの操作が発生するのは非常に手間でした。

### 改善

![create-prコマンドの実行の様子](create-pr.gif)

`git create-pr` は現在の作業ブランチのプルリクエストを作成するGitHubのページをブラウザで表示するエイリアスです。
ターミナル上でコマンド一つでPR作成の準備が整うので非常に快適になりました。

仕組みとしては GitHub CLI のコマンドをエイリアスで登録しているだけなので、複雑なことは何もしていません。

```shell
~/.gitconfig
[alias]
  create-pr = !gh pr create --web
```

## git open-pr

### 課題
コードレビュー時にローカルでコードを確認したり、レビューで指摘をもらった箇所の修正後に、改めてGitHub上のPRを表示したい時にいちいちブラウザでページ移動するのが面倒なことがあったりします。

### 改善

![open-prコマンドの実行の様子](open-pr.gif)

`git open-pr` は現在の作業ブランチのPRをブラウザで表示するエイリアスです。

これも GitHub CLI のコマンドをエイリアスで登録しているだけです。

```shell
~/.gitconfig
[alias]
  create-pr = !gh pr view --web
```
