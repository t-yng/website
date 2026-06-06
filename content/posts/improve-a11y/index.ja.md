---
title: 個人ブログのアクセシビリティー・チェックと改善を実践してみた
date: 2022-12-17
description: freeeさんが公開しているアクセシビリティー・チェックリストを活用して個人のブログのアクセシビリティーをチェックして改善をしてみました。
tags: ['フロントエンド', 'アクセシビリティ']
---

この記事は[アクセシビリティ Advent Calendar 2022 - Adventar](https://adventar.org/calendars/7377)の17日目の記事です。

最近、業務でアクセシビリティの本を輪読会で読みアクセシビリティ怖いが無くなりました。学んだ知識を定着させるためにアウトプットをしたいなと思ったので、このブログのアクセシビリティを改善してみます。

## アクセシビリティをチェック
最初は現状を知るためにfreeeさんが公開してくださっている、[アクセシビリティー・チェック・リスト](https://a11y-guidelines.freee.co.jp/checks/index.html) の「プロダクト:Web」のチェック項目をこのブログで確認してみました。

NGになったチェック項目の例としては以下の項目がありました。
- スクリーンリーダーでリンク・テキストの意図が明確でない
  - 例: ページネーションの「<」「>」が適切に読み上げられない
- titleがページの目的を示していない
  - 例: 特定のタグの記事一覧のページ
- ボタンやリンクになっている画像が十分な大きさになっていない
  - 例: GitHubへのリンクアイコンが20x20px

全ての確認結果は公開している[チェック項目の確認結果](https://docs.google.com/spreadsheets/d/1Dqt5a1pR5uZmq3D7UilTUCz0QthAFu--LCnBT4IrYi0/edit#gid=676282354)を見てもらえば確認できるようになっており、NGからOKになった項目は青背景にして表示しています。

アクセシビリティーチェックをやってみて、専門的な知識が乏しくOKにして良いか悩むチェック項目も多々ありチェックをするだけでも難しいなと感じました。例えば、「グレイスケール表示にした時にリンク箇所を判別できる」という項目で、何を持ってリンク箇所を判別可能なのか？という疑問がありました。[達成基準1.4.1の失敗例](https://waic.jp/docs/WCAG21/Techniques/failures/F73)を読んだりして自分なりに解釈をしてチェックを何とか進めていました。

## アクセシビリティを改善

全体の修正コードは[改善のプルリクエスト](https://github.com/t-yng/blog/pull/427)で確認できます。

### リンクの意図を明確にする
#### ページネーション
ページネーションの「<」「>」がスクリーンリーダーで読み上げても何を意図しているのかさっぱり分からなかったので、ラベルを追加しました。

```tsx
export const NextPage: FC<NextPageProps> = ({ page }) => (  
    <Link href={`/page/${page}`} decoration={false} aria-label="次のページへ">
        <PageItem>{'>'}</PageItem>
    </Link>
);
```

#### タグ
記事に付いてるタグをスクリーンリーダーで読み上げた時に「リンク、フロントエンド」と読まれてタグである事が分かりませんでした。

![タグのデザイン](tag.png)

今回は「タグ、<ラベル名>」とラベルを追加して、タグである事が分かるように改善しました。
「フロントエンドの記事一覧」などのリンク先の説明をするか悩みましたが、記事がタグ付けされていることを情報として伝えたいと思ったので、このようにしてみました。

ここの対応をしながら、タグであることの情報は完全に視覚的なデザインに頼っているんだなと実感しました。

```tsx
export const Tag: FC<TagProps> = ({ name }) => (
    <Link
        href={createTagLink(name)}
        decoration={false}
        aria-label={`タグ、${name}`} // 追加
    >
        <div className={style.tag}>{name}</div>
    </Link>
);
```

#### タグの一覧
サイドバーのタグ一覧のリンクも「リンク、フロントエンド(22)」と読み上げられ分かりにくい状態でした。

![サイドバーのタグ](sidebar-tag.png)

リンクで「フロントエンドの記事一覧、22件」というラベルを追加して、遷移先のページの内容が把握できるように改善をしました。

```tsx
<Link
    key={tag.name}
    decoration={false}
    href={createTagLink(tag.name)}
    aria-label={`${tag.name}の記事一覧、${tag.count}件`} // 追加
>{`${tag.name} (${tag.count})`}</Link>
```

### ページのタイトルを適切に設定する
特定のタグの記事一覧ページやページネーションNページ目のページのタイトルが「みどりのさるのエンジニア」となっており、ページの目的とタイトル一致していない状態でした。

また、このブログはNext.jsで実装されておりページ遷移がクライアント側で発生します。タグのリンクをクリックしてもスクリーンリーダーがページのタイトルを読み上げずスクリーンリーダーユーザーはページ遷移した事に気づけない状態になっていました。

Next.jsには[Route Announcements](https://nextjs.org/docs/accessibility#route-announcements)と呼ばれる仕組みがあり、`next/link`でページ遷移した時に`document.title`を確認して変更があった時にスクリーンリーダーに通知をしてくれます。そのため、ページごとにユニークなタイトルを設定すれば、自動でページ遷移の読み上げにも対応してくれるようになります。

### ページ見出しを追加
ページに見出しがない状態でスクリーンリーダーで読み上げた時に、突然記事の情報が読まれており文脈的に何の情報か分かりにくいと感じたので、ページ見出しを追加しました。

![見出し追加前](before-add-page-heading.png)

![見出し追加後](after-add-page-heading.png)

### 記事一覧の投稿日時の表示位置を変更
記事一覧の表示で投稿日時がタイトルよりも上に来ていましたが、スクリーンリーダーで読ませてみると日付が読まれた後にタイトルが読まれる流れになっており、少し投稿日時であることが分かりにくいなと感じました。

情報の優先度を考えると記事のタイトルが一番重要になってくるので、タイトル、日付の順番に並び替えを行いました。

![日付の移動前](before-move-date.png)

![日付の移動後](after-move-date.png)

### アイコンサイズを変更
チェックリストに従って、GitHubへのリンクアイコンのサイズを24x24pxに変更しました。

### ページ遷移でフォーカスをリセット
SPAではページ遷移をした時にウィンドウの再読見込みが発生しないため、サイドバーのタグリンクを選択してタグの記事一覧にページ遷移してもフォーカスはリンクの位置に残っている状態になってしまいます。

[今からでも遅くない！誰も教えてくれなかった React とアクセシビリティーの世界](https://zenn.dev/neet/articles/8b4d8d42fb2a5e#%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E3%82%B5%E3%82%A4%E3%83%89%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)の記事でも同様の問題について言及されていました。リンク先の記事では`main`要素にフォーカスを当てるサンプルが紹介されていましたが、同じようにやるとブラウザバックした時にスクロールの挙動が怪しくなったりしたので、`body`にフォーカスを当てるように修正をしました。

`_document.tsx`で`body`要素に`tabIndex={-1}`を指定してJSでフォーカス可能な状態にして、`_app.tsx`にルーターの遷移イベントに応じて`body`にフォーカスする実装を追加しています。

```tsx
// pages/_app.tsx
const router = useRouter();

const handleRouteChange = () => {
    const body = document.querySelector('body');
    body?.focus();
};

useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
    };
}, [router.events]);

// pages/_document.tsx
<body tabIndex={-1}>
```

## eslint-plugin-jsx-a11yでコードを自動チェックする
freeeさんのチェックリストには「コード:Web」のシートもありますが、目視でコードを確認していくのは大変そうだったので、[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)を導入してコードの自動チェックを実施しました。

eslint-plugin-jsx-a11yのパッケージをインストールします。

```shell
$ yarn add -D eslint-plugin-jsx-a11y
```

次に`.eslintrc`に設定を追加します。ルール設定はプラグインの推奨設定を利用します。

```json
{
  "plugins": ["jsx-a11y"],
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

eslintを実行すると、1件だけ`img`要素に`alt`が無いというエラーが見つかりました。

```shell
$ yarn eslint --ext tsx ./src
/Users/t-yng/workspace/blog/src/components/common/Sidebar/SidebarProfile.tsx
  28:25  error  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text

✖ 1 problem (1 error, 0 warnings)
```

コードを確認してみると`aria-hidden="true"`が付いているので、alt属性を付けておらずエラーになっていました。

`aria-hidden="true"`を設定していればスクリーンリーダーからは無視されるので、alt属性を付ける必要は無さそうな気がします。これに関しての[issue](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/803)が上がっていましたが、aria-*をサポートしていないがalt属性をサポートしているブラウザで開いた時のことも考慮する目的でエラー扱いにしているようでした。

```tsx
<img
    className={style.icon}
    src={profile.github.icon}
    aria-hidden="true"
/>
```

alt属性の有無のチェックをOFFにするのも良くないので、今回は素直にalt属性を追加しました。

```tsx
<img
    className={style.icon}
    src={profile.github.icon}
    aria-hidden="true"
    alt="GitHubのロゴ"
/>
```

## さいごに
とてもシンプルな個人ブログでも色々と改善が必要な部分が見つかり、WCAGを読む機会もできて非常に勉強になりました。実際にスクリーンリーダーを使って操作を確認して、修正前後で比べると納得する形で改善ができたので良かったです！

ARIAランドマークやコンストラスト比など改善できていない部分もあるので、引き続き改善をしていきます。
٩( 'ω' )و