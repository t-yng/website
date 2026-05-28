---
title: expressで全てのログにリクエストIDを出力する
date: 2020-02-22
description: expressで全てのログにリクエストIDを出力する
tags: ['Node.js']
---

Node.jsでは処理が非同期のため出力されるログもリクエスト単位で固まって表示されない事があります。  
そこで、ログにリクエストIDをメタ情報として追記する事で、どのリクエストで発生したログか追跡しやすくなります。

今回は express で実装されたサーバーで全てのログにリクエストIDを付与する方法をまとめます。

## 実装

[t-yng/express-requestid-log](https://github.com/t-yng/express-requestid-log)

```javascript
require('zone.js');
const express = require('express');
const uuidv4 = require('uuid/v4');
const winston = require('winston');
const logger = require('./utils/logger');
const app = express();

/**
 * リクエスト毎にリクエストIDを発行してZoneの生成する
 */
const attachRequestId = (req, res, next) => {
    Zone.current.fork({
        name: 'request',
        properties: {
            requestId: uuidv4()
        }
    })
    .run(next);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.prettyPrint(),
    defaultMeta: {
        get requestId() {
            return Zone.current.get('requestId');
        }
    },
    transports: [
        new winston.transports.Console(),
    ]
});

app.use(attachReqestId);

app.get('/', (req, res) => {
    logger.info('request log', {
        path: req.path
    });
    res.send('hello world');
});

app.listen(3000, () => console.log('listening port 3000'));
```

## zone.js

1つ目のポイントは [zone.js](https://github.com/angular/angular/tree/master/packages/zone.js)です。

全てのログにリクエストIDを付与したいので、ロガーモジュールで共通処理としてリクエストIDを参照する必要があります。
発行したリクエストIDをexpressのreqオブジェクトに紐づけると、ロガーモジュールからreqオブジェクトを参照する必要が出てきますが、
ロガーはexpressのコンテキストからは独立したモジュールのため、reqモジュールを参照するのが困難です。

Globalオブジェクトに持つ事も考えましたが、Node.jsはシングルスレッドのため非同期でリクエスト毎にリクエストIDが上書きされる問題が発生します。

そこで、zone.jsを利用してリクエスト単位で値をグローバルに管理して、ロガーモジュールから参照可能にしています。

## get構文

2つ目のポイントは、Objectの[get構文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/get)です。

ログ出力にwinstonを利用しており、`defaultMeta`に値を設定することで全てのログに共通のメタ情報として値を出力してくれます。
しかし、リクエストIDは動的な値なため、実行タイミングで値が変わってしまいます。そこで、get構文とすることで`defaultMeta.requestId`に参照が発生したタイミングで動的に値が取得できるようにしています。

## まとめ

zone.jsの存在やget構文の使い方を理解できたのは良かったです。  
調べても意外にやり方があまり出てこなかったので、他の人がどうしているのかは非常に気になりました。  
インフラレイヤーでログ出力をしていて、アプリケーションレイヤーではリクエストIDを付与してログを出力しておらず、今回の対応は必要ないパターンが多いんですかね？