---
title: Macアドレスを偽装する
date: 2020-03-21
description: Macアドレスを偽装する
tags: ['セキュリティ']
---

とある会社の人と話していて、社内インフラの人がセキュリティ対策としてMacアドレスを見てアクセスを制限している。と聞いて、Macアドレスって簡単に偽装できるんじゃない？と思い調べてみました。

## 注意

この記事は攻撃方法を知ることでセキュリティを学ぶことを前提としています。  
決して外部の環境に対して悪意のある実行をしないようにしてください。

## spoof

調べたら macOS, Windows, Linux で利用可能な Macアドレスを偽装できるCLIツールがあった。

[feross/spoof: Easily spoof your MAC address in macOS, Windows, & Linux\!](https://github.com/feross/spoof)

### インストール

```
$ npm i -g spoof
```

### 使い方

#### Macアドレスの一覧を表示

```shell
$ spoof list
- Wi-Fi on device en0 with MAC address xx:xx:xx:xx:xx:xx
- ...
```

#### ランダムなMacアドレスを設定

```shell
# root権限が必要
$ sudo spoof randomize en0
$ spoof list
- Wi-Fi on device en0 with MAC address xx:xx:xx:xx:xx:xx currently set to 00:50:56:6F:42:0A
- ...
```

#### 任意のMacアドレスを設定

```shell
# root権限が必要
$ sudo spoof set 
$ sudo spoof list
```

#### Macアドレスをリセット

```shell
# root権限が必要
$ sodo spoof reset en0
```

## ツールを利用しない場合

ツール使わなくても普通にできるようでした。  
[macOS でターミナルを使って自分のMAC アドレスを変更する方法 \- yu8mada](https://yu8mada.com/2018/06/27/how-to-change-one-s-own-mac-address-using-terminal-on-macos/)   


#### Macアドレスの確認

```shell
$ networksetup -listallhardwareports

Hardware Port: Wi-Fi
Device: en0
Ethernet Address: xx:xx:xx:xx:xx:xx

...

$ ifconfig en0 | grep ether
	ether xx:xx:xx:xx:xx:xx
```

#### Macアドレスの設定

```shell
$ sudo ifconfig en0 ether 60:d2:48:2f:39:64
$ ifconfig en0 | grep ether
	ether 60:d2:48:2f:39:64
```

#### Macアドレスをリセット

リセットの事を考えると spoof を利用した方が早そう。

```shell
$ networksetup -getmacaddress Wi-Fi
Ethernet Address: xx:xx:xx:xx:xx:xx (Hardware Port: Wi-Fi)

$ sufo ifconfig en0 ether xx:xx:xx:xx:xx:xx
```

## まとめ

調べたらMacアドレスの偽装は凄い簡単にできました。  
単純なMacアドレスのによるアクセス制御はあまり意味が無かったです。