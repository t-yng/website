---
title: GoogleのProfessional Cloud Developer認定試験に合格するまでの学習の振り返り
date: 2023-01-08
description: GoogleのProfessional Cloud Developer認定試験に合格するためにやったことの振り返りです
tags: ['その他', 'CGP']
---

先日、Googleが実施しているProfessional Cloud Developerの認定資格に合格しました。🎉
自分が認定試験に合格するまでに行った学習の振り返りです。

## Professional Cloud Developer(PCD)とは？
[Professional Cloud Developer](https://cloud.google.com/certification/cloud-developer?hl=ja)はGoogleが推奨するツール（主にGCP）とベストプラクティスを使用して、スケーラブルで可用性の高いアプリケーションを構築する知識に基づいた認定資格です。

出題内容としては次のスキルについて評価がされます。
- スケーラビリティ、可用性、信頼性に優れたクラウドネイティブ アプリケーションの設計
- アプリケーションのビルドとテスト
- アプリケーションのデプロイ
- Google Cloud サービスの統合
- デプロイされたアプリケーションの統合

## 受験の経緯
会社でG.I.GプログラムというGoogle Cloudの技術スキルを習得するためのエンジニア向けのプログラムに参加させて頂けることになりました。このプログラムの修了過程の一環としてGoogle Cloud認定資格の取得があります。

前からCGPをちゃんと勉強してみたいと思っていたので、折角の機会に認定試験を資格を受験してみようとなりました。

## 筆者の開発経験
### 実装・設計の経験
- サーバーサイドの開発経験: 2.5年
- フロントエンドの開発経験: 3年

### インフラ経験
- Next.jsを本番運用するためにTerraform + AWS Fargate でインフラ構築及び運用の経験あり
  - 既に土台があったので、それを真似して知っている人に相談しながら構築
- Node.js + Lambda でAPIの構築経験あり
- AWSの基本的なサービスは知っている状態
- GCPはコンソールの見方も分からず苦手意識がありGCP怖い状態

## 学習方法
### 学習時間と期間
学習時間: 約60時間
学習期間: 2ヶ月

合計の学習時間は約60時間でしたが、Courseraのコースを修了するにあたりハンズオンを完了させる必要があり1/4はその時間に費やしていた気がするので、単純な座学の時間だけだと約45時間でした。

### Coursera
G.I.Gプログラム参加者に提供されているCouseraのPCD受験者向けの学習コースを5つ受講・修了しました。実施内容は動画視聴によるGCPに関する学習とQwiklabsでのハンズオンです。

動画を視聴しているだけど頭に入ってこなかったので、学習動画を視聴しながら重要だなと思った点をメモ帳にメモ書きしながら、分からない単語やサービス名をドキュメントや他の人のブログ記事などを読んで理解するようにしていました。このやり方は動画視聴しているだけの時と比較して学習の質が上がったと実感できました。

[Professional Cloud Developer認定試験の学習メモ書き](/post/gcp-memo)でメモ書きの内容を書いているので、興味ある方は確認してみてください。

具体的には次のコースを受講しました。一般向けにも公開もされているので、G.I.Gプログラム参加者以外でも受講は可能だと思います。
- [Google Cloud Fundamentals: Core Infrastructure 日本語版](https://www.coursera.org/learn/gcp-fundamentals-jp)
- [Application Deployment, Debug, Performance 日本語版](https://www.coursera.org/learn/app-deployment-debugging-performance-jp)
- [Securing and Integrating Components of your Application 日本語版
](https://www.coursera.org/learn/securing-integrating-components-app-jp)
- [Getting Started with Application Development 日本語版](https://www.coursera.org/learn/getting-started-app-development-jp)
- [Getting Started with Google Kubernetes Engine 日本語版](https://www.coursera.org/learn/google-kubernetes-engine-jp)


### 模擬試験
Courseraコースを一通り受講し終えた後に[公式の模擬試験](https://docs.google.com/forms/d/e/1FAIpQLSc_67KaPnNwQrLZ7kuhw-aubz7gMAwY6DQwRJYcW0qlG-iajA/viewform?hl=ja)を解いてから、知らないサービス名などの単語を全て調べて理解することをしていました。その後、何も見ずに解答の説明ができるように繰り返し解いていました。

## 難易度と雑感
選択式の試験だったのでGCPのサービスだけ把握すれば、システム構築に関する問題は経験則の勘で答えられるだろうと思っていましたが、実際にそんな感じで解答できました。

設計を含めたサーバーサイドの開発経験がある程度あれば、比較的難しくないのかな？という印象でした。特に業務でGCPを利用している方であれば、模擬試験を受けて試験の傾向と雰囲気だけ把握して少し勉強するだけでも合格できると思います。
