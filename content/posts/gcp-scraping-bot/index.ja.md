---
title: Google Cloud でWebスクレイピングして結果を通知するBotを作成
date: 2022-09-27
description: 会社でG.I.Gプログラムに参加する機会を得たので、勉強がてら定期的にWebスクレイピングして結果をSlackに通知するBotをGoogle Cloudで構築してみました。
tags: ['Google Cloud']
---

会社でG.I.Gプログラムに参加する機会を得たので、勉強がてら定期的にWebスクレイピングして結果をSlackに通知するBotをGoogle Cloudで構築してみました。

## 全体構成
Cloud Functionsでスクレイピングを実行してSlackに結果を通知するHTTP関数を用意して、Cloud Scheduler で定期的にCloud FunctionsにHTTPリクエストを送信するジョブを実行することでBotを構築します。

![構成図](archecture.png)

## スクレイピングを実装
まずはローカルでスクレイピングを実行するコードを実装します。
HTMLの取得と解析には[axios](https://axios-http.com/)と[cheerio](https://cheerio.js.org/)を利用します。

```javascript
const cheerio = require('cheerio');
const axios = require('axios');

const scrape = async () => {
  const res = await axios.get(
    'https://xxxx/xxxx'
  );
  const $ = cheerio.load(res.data);

  // (省略)

  return 'スクレピングの結果';
};

const main = async () => {
  const result = await scrape();
  console.log(result);
}

main();
```

## Slackへの通知を実装
続いてスクレイピング結果をSlackへ通知する部分を実装します。
Slackへのメッセージ送信には[Incoming Webhook](https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-%E3%81%A7%E3%81%AE-Incoming-Webhook-%E3%81%AE%E5%88%A9%E7%94%A8)でWebhook URLを発行してPOSTリクエストを送信します。

```javascript
const notifyToSlack = (message) => {
  return axios.post(
    "https://hooks.slack.com/services/xxxxx/xxxxxx/xxxxx",
    {
      text: message,
    }
  );
}

const main = async () => {
  const result = await scrape();
  notifyToSlack(result);
}

main();
```

## Google Cloud CLIのインストール
Google Cloudの構築を始める前にターミナルで操作するためにCLIツールをインストールしておきます。
ここではHomebrewでインストールをしていますが、インストール方法は何でも大丈夫です。

```shell
$ brew install --cask google-cloud-sdk
```

`gcloud` コマンドでGoogle Cloudを操作するために認証が必要なためログインをしておきます。

```shell
$ gcloud auth login
```

## プロジェクトの作成
Google Cloud サービスを構築するためのプロジェクトをGoogle Cloudで作成しておきます。

## Cloud FunctionsのHTTPハンドラ関数を実装
Google Cloudでアプリケーションを構築してきます。
Cloud Functionsの詳細なガイドについては[公式のガイド](https://cloud.googles.ltd/functions/docs/how-to?hl=ja)を参照してください。

Cloud Functionsで関数を実行するには、[Functions Framework for Node.js](https://github.com/GoogleCloudPlatform/functions-framework-nodejs)でHTTPリクエストのハンドラ関数を登録する必要があります。

最初に`@google-cloud/functions-framework`をインストールします。

```shell
$ yarn add @google-cloud/functions-framework
```

続いてスクレイピングと通知の処理をHTTPハンドラ関数として登録します。

```javascript
const functions = require("@google-cloud/functions-framework");
const cheerio = require("cheerio");

functions.http("checkReservation", async (_req, res) => {
  const result = await scrape();
  await notifyToSlack(result);
  res.send("ok");
});

// (省略)
```

デプロイ前にローカルでテスト用のサーバーを起動して関数が実行されるか確認してみましょう。

```json
{
  "scripts": {
    "start": "functions-framework --target=checkReservation"
  }
}
```

```shell
$ yarn start
Serving function...
Function: checkReservation
Signature type: http
URL: http://localhost:8080/
```

HTTPリクエストを送信してSlackへメッセージが送信されるのを確認できれば成功です。

```shell
# 別タブ等で実行
$ curl http://localhost:8080/checkReservation
ok
```

## Cloud Functionsへデプロイ
詳細は公式ガイドの[Cloud Functions の関数をデプロイする](https://cloud.googles.ltd/functions/docs/deploy?hl=ja)で確認できます。

関数をデプロイするには`gcloud functions deploy`コマンドを実行します。

```shell
$ gcloud functions deploy YOUR_FUNCTION_NAME \
[--gen2] \
--region=YOUR_REGION \
--runtime=YOUR_RUNTIME \
--source=YOUR_SOURCE_LOCATION \
--entry-point=YOUR_CODE_ENTRYPOINT \
TRIGGER_FLAGS
```

今回はHTTPリクエストでトリガーしたいので次のようにデプロイコマンドを作成しました。
- `--gen2`は第2世代のCloud Functionsにデプロイすることを指定しています。
- `--trigger-http`はHTTPリクエストで関数をトリガーするために指定します。
- `--allow-unauthenticated`は認証なしで関数を呼び出し可能にするために指定します。Cloud Functionsはデフォルトで[関数の呼び出しに認証が必要](https://cloud.googles.ltd/functions/docs/calling/http?hl=ja)になっているので、このフラグを指定しています。

```shell
$ gcloud functions deploy reservation-notify \
  --gen2 
  --region=asia-northeast1 \
  --runtime=nodejs16 \
  --source=. \
  --entry-point=checkReservation \
  --trigger-http \
  --allow-unauthenticated \
  --project=reservation-notify
```

このコマンドをnpmスクリプトとして登録してデプロイを実行します。

```json
{
  "scripts": {
    "deploy": "gcloud functions deploy reservation-notify --gen2 --region=asia-northeast1 --runtime=nodejs16 --source=. --entry-point=checkReservation --trigger-http --allow-unauthenticated --project=reservation-notify"
  }
}
```

```shell
$ yarn deploy
...
uri: https://reservation-vacancy-notify-xxxxxx.run.app
```

デプロイが成功したら発行されたURLが確認できるので、HTTPリクエストを送信してみます。
Slackにメッセージが送信されたら成功です。

```shell
$ curl https://reservation-vacancy-notify-xxxxxx.run.app
ok
```

## Cloud Schedulerで定期実行
`gcloud scheduler jobs create http`コマンドでHTTPリクエストのジョブを作成できます。
定期実行のスケジュールはcrontabの書式で設定し、タイムゾーンを指定する場合は[List of tz database time zones
](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)にあるタイムゾーンを指定できます。

今回は先程のCloud Functionsへ5分おきにHTTPリクエストを送信するジョブを作成してみます。

5分ほど待ってSlackにメッセージが飛んでくるのを確認できたら成功です。

```shell
$ gcloud scheduler jobs create http check-reservation \
  --schedule="*/5 * * * *" \
  --time-zone=Asia/Tokyo \
  --location=asia-northeast1 \
  --uri="https://reservation-vacancy-notify-rkqokacy7q-an.a.run.app" \
  --http-method=GET \
  --project="reservation-notify" \
```