---
title: NetlifyからVercelに移行した
date: 2021-05-26
description: 技術ブログのホスティングをNetlifyからVercelに移行しました
tags: ['Netlify', 'Vercel', 'Next.js']
---

この技術ブログはNetflifyでホスティングをしていますが、前からNetlifyは無料枠だとCDNのエッジサーバーが日本国内にはなくレイテンシーが発生して、遅いという話が気になっていました。

- [Netlifyが日本からだと遅い \- id:anatooのブログ](https://blog.anatoo.jp/2020-08-03)
- [NetlifyからVercelへの移行を検討した話](https://www.suzu6.net/posts/268-blog-server/) 

## 速度検証
同じブログをVercelにもホスティングして、参考記事と同じようにNetlifyとVercelで1.3MBの画像の応答速度を比較してみます。  
※ 検証時間は水曜日の12:00頃に検証しています。

Netlifyは、応答速度: 629ms/req ,転送速度: 2.07MB/sec という結果でした。正直、この数字だけを見ても早いのか遅いのかよく分かっていません。

```
# Netlifyの応答速度（1.3MBの画像をリクエスト）
$ ab -n 10 -c 1 -k https://t-yng.jp/images/posts/nextjs-perf-improvement/bundle-analyzer-result.png

This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking t-yng.jp (be patient).....done


Server Software:        Netlify
Server Hostname:        t-yng.jp
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-AES256-GCM-SHA384,256,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        t-yng.jp

Document Path:          /images/posts/nextjs-perf-improvement/bundle-analyzer-result.png
Document Length:        1337519 bytes

Concurrency Level:      1
Time taken for tests:   6.294 seconds
Complete requests:      10
Failed requests:        0
Keep-Alive requests:    10
Total transferred:      13378950 bytes
HTML transferred:       13375190 bytes
Requests per second:    1.59 [#/sec] (mean)
Time per request:       629.442 [ms] (mean)
Time per request:       629.442 [ms] (mean, across all concurrent requests)
Transfer rate:          2075.71 [Kbytes/sec] received

（省略）
```

Vercelの場合は、応答速度: 172ms/req, 転送速度: 7.5MB/sec となり、Netlifyの約4倍も高速という結果になりました。  
ここまで素直に違いが出ると思わなかったので、驚きました。

```
$ ab -n 10 -c 1 -k https://blog-eta-beryl.vercel.app/images/posts/nextjs-perf-improvement/bundle-analyzer-result.png

This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking blog-eta-beryl.vercel.app (be patient).....done


Server Software:        Vercel
Server Hostname:        blog-eta-beryl.vercel.app
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES256-GCM-SHA384,2048,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        blog-eta-beryl.vercel.app

Document Path:          /images/posts/nextjs-perf-improvement/bundle-analyzer-result.png
Document Length:        1337519 bytes

Concurrency Level:      1
Time taken for tests:   1.721 seconds
Complete requests:      10
Failed requests:        0
Keep-Alive requests:    10
Total transferred:      13380710 bytes
HTML transferred:       13375190 bytes
Requests per second:    5.81 [#/sec] (mean)
Time per request:       172.050 [ms] (mean)
Time per request:       172.050 [ms] (mean, across all concurrent requests)
Transfer rate:          7594.93 [Kbytes/sec] received

（省略）
 ```

## なぜNetlifyは遅いのか？
最初にも書いたとおり、CDNのエッジサーバーが日本国内になくシンガポールなどの国外のサーバーを経由して配信されるため、その分だけ通信のレイテンシーが発生しているのが原因です。

Netlifyにホスティングしているドメインに対して通信経路を表示してみたら、シンガポールっぽいサーバーにアクセスをしていました。

```zsh
$ traceroute t-yng.jp

traceroute: Warning: t-yng.jp has multiple addresses; using 104.248.158.121
traceroute to t-yng.jp (104.248.158.121), 64 hops max, 52 byte packets
 1  192.168.0.1 (192.168.0.1)  2.072 ms  1.227 ms  1.110 ms
 2  192.168.24.1 (192.168.24.1)  1.391 ms  1.580 ms  1.406 ms
 3  153.153.253.241 (153.153.253.241)  6.315 ms  7.216 ms  7.145 ms
 4  153.153.253.133 (153.153.253.133)  5.132 ms  4.885 ms  5.025 ms
 5  118.23.46.65 (118.23.46.65)  7.509 ms  12.750 ms  8.127 ms
 6  180.8.119.137 (180.8.119.137)  8.569 ms  6.889 ms  5.825 ms
 7  153.149.219.49 (153.149.219.49)  14.854 ms  15.650 ms  20.806 ms
 8  153.149.219.146 (153.149.219.146)  22.481 ms  21.862 ms  27.243 ms
 9  ae-12.r02.osakjp02.jp.bb.gin.ntt.net (61.200.80.9)  15.422 ms  18.149 ms  23.293 ms
10  ae-3.r25.osakjp02.jp.bb.gin.ntt.net (129.250.2.129)  17.947 ms
    ae-2.r25.osakjp02.jp.bb.gin.ntt.net (129.250.7.32)  18.441 ms  19.506 ms
11  ae-9.r22.sngpsi07.sg.bb.gin.ntt.net (129.250.2.66)  84.407 ms  90.269 ms  88.346 ms
12  ae-0.a00.sngpsi07.sg.bb.gin.ntt.net (129.250.2.74)  85.529 ms  87.029 ms
    ae-0.a01.sngpsi07.sg.bb.gin.ntt.net (129.250.2.122)  91.914 ms
13  ae-0.digital-ocean.sngpsi07.sg.bb.gin.ntt.net (116.51.17.166)  86.345 ms
    ae-1.digital-ocean.sngpsi07.sg.bb.gin.ntt.net (116.51.17.194)  86.923 ms  88.386 ms
14  138.197.245.9 (138.197.245.9)  90.475 ms * *
```

## Vercelへの移行
### Netlifyとのインテグレーションを解除
最初にNetlifyへの自動デプロイを停止するため、Githubリポジトリのインテグレーションを削除しました。  
自分のGithubリポジトリに移動して、Settings > Integrations > Netlify を選択して削除を実行する。

### Vercelへデプロイ
Next.jsで実装しているので[Next.jsの公式ドキュメント](https://nextjs.org/docs/deployment#vercel-recommended)を参考にして進める。  
基本的にはVercelのページ上でポチポチしてGithubリポジトリをVercelのプロジェクトとしてインポートするだけです。

### Netlifyのカスタムドメインの登録解除
独自ドメインの向き先を Netlify => Vercel に変更する。  
Netlifyではカスタムドメインを設定する為に、ドメイン管理会社側のネームサーバーを変更する必要があった。変更していたネームサーバーをデフォルトのドメイン管理会社のネームサーバーに戻す作業を実施する。  

### Vercelにカスタムドメインを登録
その後、Vercelでプロジェクトを選択して Settings > Domains からカスタムドメインを追加する。  
カスタムドメインの追加後にDNSレコードの設定情報が表示されるので、ドメイン管理会社側にDNSレコードを登録する。

![カスタムドメインの設定画像](vercel-domains-settings.png)

以上で Netlify => Vercel の移行は完了です。

ページ読み込み時の画像表示を含めたページ読み込みの速度が体感として非常に早くなりました！

**Netlify でのページ読み込み**

![Netlifyでのページ読み込み](netlify.gif)

**Vercel でのページ読み込み**

![Vercelでのページ読み込み](vercel.gif)