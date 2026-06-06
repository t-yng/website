---
title: コンポーネントの入力と出力を意識してユニットテストを書いてみよう
date: 2021-12-07
description: 初めてフロントエンドでコンポーネントのユニットテストを書く時に「何をテストするのか」が分からず、上手くテストが書けないという事があります。この記事ではコンポーネントの入力と出力を意識することでユニットテストで「何をテストするか」について、まとめています。
tags: ['React', 'フロントエンド', 'テスト']
---

この記事は [YAMAP エンジニア Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers) の7日目の記事です。

## はじめに
初めてフロントエンドでコンポーネントのユニットテストを書く時に「何をテストするのか」が分からず、上手くテストが書けないという事があります。

この記事ではコンポーネントの入力と出力を意識することでユニットテストで「何をテストするか」について、まとめています。

## 自動テストは何をテストするのか？
最初に一般的に自動テストでは何をテストするのかを明確にします。

自動テストでは**与えた入力に対して期待した出力が得られるか？** をテストします。基本的にはこれだけ意識しておけば大抵の自動テストは書くことができます。（暴論）

例えば次ような url が Googleのドメインかどうかを判定する関数のテストを考えてみます。

```typescript
const isGoogleDomain = (url: string): boolean => {
  return url.match(/^http[s]:\/\/google.com\//) != null;
}
```

この関数をテストしてくださいとお願いされたら、どのようなテストを書くでしょうか？  
大抵は最低限、次の2つのテストを考えるのではないでしょうか？
1. https://google.com/search?q=テスト の時に true を返すか
2. https://example.com の時に false を返すか

このテストケースの入力と出力をまとめると次のようになります。

|入力|出力|
|--|--|
|https://google.com/search?q=テスト|true|
|https://example.com|false|

## コンポーネントのテストが難しい理由
先ほど見たように、util 系の関数は入力と出力が分かりやすいので、比較的テストが書きやすい部類になると思います。それに比較してコンポーネントは意識しないと入力と出力が分かりにくいのではないでしょうか？

コンポーネントのテストが難しいと感じる理由は **テストの書き方が分からない** のではなく **入力と出力が分からない** ことが大きな原因となっていると考えています。

逆に言えばコンポーネントの入力と出力が把握できれば、コンポーネントのテストも util系の関数と同じように書くことができます。

## コンポーネントの入力と出力
ここからReactの関数コンポーネントを例に話を進めますが、基本的な考え方は Vue のコンポーネントでも同じです。
Reactの関数コンポーネントは名前の通りただの関数です。ただの関数ということは入力と出力が定義できるということです。

では、関数コンポーネントの出力とは何でしょうか？
それは、**HTMLのDOM構造** です。

それに対して入力は主に次の3種類です。
1. props
2. クリックなどのユーザーイベント
3. Reduxなどのグローバルストア

以上のことから、それぞれ**3種類の入力に対して正しくHTMLの構造が出力されるか**を確認することで、コンポーネントのテストを書くことができます。

## コンポーネントはテストを書かない違和感
このように入力と出力を意識して考えると、関数コンポーネントもutil系の関数も同じ関数です。

関数コンポーネントを実装する時には、〇〇なpropsの場合は△△なDOMを出力するといったように条件分岐や、開始日や終了日から滞在日数を計算してテキストを表示するといったような実装をすることがあります。

これらは明らかなロジックにも関わらず、util系の関数のロジックはテストを書くのにコンポーネントのロジックのテストは書かないのは明らかに違和感を感じてしまいます。

なので、コンポーネントのテストもutil関数と同じような感覚でテストを書いていって良いと思います。

## 入力と出力を考えてテストを書いてみる
### 入力と出力を考える
実際に次のカウンターコンポーネントの入力と出力を考えてみます。

次に進む前に試しに自分で入力とを出力を考えてみてください。

```tsx
const Counter = ({count}: {count: number}) => {
    const [countState, setCount] = useState(count);

    const handleClick = () => {
        setCount(count => count + 1);
    }

    return (
        <div>
            <span>{count}</span>
            <button onClick={handleClick}>カウントアップ</button>
        </div>
    );
}
```

入力と出力はこんな感じになります。

|入力|出力|
|--|--|
|count props|count値のテキスト|
|ボタンクリックイベント|現在のcountに+1された値のテキスト|

ここでは、span要素として出力されのるが重要ではなく、**カウントの値がテキストとして出力される**ことが期待している結果なので、出力はテキストという表現をしています。

### テストを書いてみる
入力とを出力を洗い出せたのでテストを書いてみます。

テストの記述には jest + testing-library を利用しますが、触ったことない方でも何をやっているかを把握できると思うので、こんな感じでテストを書くんだという雰囲気を掴む程度で大丈夫です。

最初に props の入力に対する出力のテストを書いてみます。
|入力|出力|
|--|--|
|count props|count値のテキスト|

期待する振る舞いが「props として渡したカウントの値がHTMLのテキストとして出力されるか」なので、入力としてpropsで渡した値(5)が出力としてDOM上にテキストとして表示されているかを確認すればテストを書くことができます。

```tsx
import { render } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
    it('propsで指定したカウント数を表示する',  () => {
        render(<Counter count={5} />);
        const count = screen.queryByText(5);
        expect(count).toBeInTheDocument();
    }
});
```

次にボタンクリックの入力に対してもテストを書いてみます。

|入力|出力|
|--|--|
|ボタンクリックイベント|現在のcountに+1された値のテキスト|

ユーザーイベントの場合もpropsの場合と考え方は同じです。

入力としてボタンクリックイベントを与えた時に、現在のカウントを+1した値がテキストとして出力されるかを確認すればテストを書くことができます。

```tsx
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
    it('propsで指定したカウント数を表示する',  () => {
        render(<Counter count={5} />);
        const count = screen.queryByText(5);
        expect(count).toBeIntTheDocument();
    }

    it('ボタンをクリックすることで表示するカウント数が増える',  () => {
        render(<Counter count={5} />);
        const button = screen.getByRole('button');
        userEvent.click(button);
        userEvent.click(button);
        const count = screen.queryByText(7);
        expect(count).toBeInTheDocument();
    }
});
```

## 具体的なコンポーネントのテストを考えてみる
サンプルのカウンターコンポーネントではピン来ないと思うので、もう少し具体的なコンポーネントとして通知内容に応じてリンクを表示する `NotificationLink` というコンポーネントのテストを考えてみます。

`NotificationLink` は props で `Notification` オブジェクトを受け取り、プロパティの値に従ってaタグを返す関数コンポーネントです。

仕様は次の通りです。
- `webLaunchUrl` が null or 空文字の場合は span要素でテキストを表示する
- `webLaunchUrl` が外部リンクの場合は、別タブで対象のリンクを開くa要素を表示する
- `webLaunchUrl` が内部リンクの場合は、相対パスをリンクとしたa要素を表示する

これらの情報を元に今までの例に習って、入力と出力を考えみましょう。

```tsx
export const NotificationLink = ({notification}: Notification) => {
    const webLaunchUrl = notification.webLaunchUrl;

    if(webLaunchUrl == null || webLaunchUrl === '') {
        return <span>{notification.text}</span>
    }

    if (isExternalLink(webLaunchUrl)) {
        return <a href={webLaunchUrl} target="_blank">{notification.text}</a>
    }

    const relativePath = getRelativePath(webLaunchUrl);
    return <a href={relativePath}>{notification.text}</a>   
}
```

入力と出力はこんな感じです。

|入力|出力|
|--|--|
|webLaunchUrl が null の notification|notification.textのテキスト(a要素でない)|
|webLaunchUrl が外部リンクの notification|別タブで外部リンクを開くa要素|
|webLaunchUrl が内部リンクの notification|相対パスがリンクとして指定されたa要素|

入力と出力が分かったので、これを元にテストを書いてみます。

```tsx
import { render } from '@testing-library/react';
import { NotificationLink } from './NotificationLink';

describe('NotificationLink', () => {
    it('webLaunchUrlがnullのときにテキストのみを表示する', () => {
        const notification = { webLaunchUrl: null, text: 'test' };
        render(<NotificationLink notification={notification} />;
        const text = screen.queryByText(notification.text);
        const link = screen.queryByRole('link');

        expect(text).toBeInTheDocument();
        expect(link).not.toBeInTheDocument();
    });

    it('webLaunchUrlが外部リンクの時に別タブのリンクを表示する', () => {
        const notification = { webLaunchUrl: 'https://example.com', text: 'test' };
        render(<NotificationLink notification={notification} />;
        const link = screen.queryByRole('link');

        expect(link).toHaveAttribute('href', notification.webLaunchUrl);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveTextContent(notification.text);
    });

    it('webLaunchUrlが内部リンクの時に相対パスでリンクを表示する', () => {
        const notification = { webLaunchUrl: 'https://t-yng.jp/tag/typescript', text: 'test' };
        render(<NotificationLink notification={notification} />;
        const link = screen.queryByRole('link');

        expect(link).toHaveAttribute('href', '/activities');
        expect(link).not.toHaveAttribute('target', '_blank');
        expect(link).toHaveTextContent(notification.text);
    });
})
```

## コンポーネントのテストを書くメリット
### 設計の良し悪しの基準になる
「テストが書きにくいコードは設計が良くない」というのはテストを書くときに頻繁に言われる話ですが、コンポーネントでもこの考えは当てはまります。

色々な責務を持っている複雑なコンポーネントに対してテストを書いてみようとすると、入力と出力が分かりにくくなり、様々なモックを利用する必要が出てくるので非常にテストを書くのが困難になります。

特にコンポーネントの設計は良し悪しが難しい部分があるので、テストを書くことでテストが書きやすい=設計が悪くない、と判断して自信を持って実装を進めることができるのは大きなメリットです。

### 安心してリファクタリングができる
一般的に自動テストが効力を発揮するのはリファクタリングをしたときです。つまり、既存コードを修正するタイミングです。

コードレビューをしていると、レビューの指摘を受けてコンポーネントをリファクタするのは日常茶飯事なので、この時にテストを書いておけば安心してコード修正することができます。

テストはリリース前のタイミングでも書いてあるだけで十分に恩恵を得ることができます。

### 検証コストの削減
先ほどの `NotificationLink` コンポーネントに渡される `notification` オブジェクトがAPIレスポンスとして取得される場合には、手動検証をするにはパターンごとにAPIのレスポンスをモックしてブラウザ操作をする必要があり非常に面倒です。準備なども含めると10~15分ほどかかる場合もあるかもしれません。

コンポーネントのテストを書けば入力をモックできるので、1回テストを書けばボタンをポチッと押すだけで、5秒で検証することができます。

このように、APIレスポンスによって表示を切り替えるようなパターンでは手動検証よりもテストを書いた方が圧倒的に検証コストを減らせるメリットがあります。

## まとめ
- コンポーネントのテストも入力と出力を明確にして、期待した出力が得られるかを確認するようにするとテストが書きやすくなる。
- コンポーネントの単体テストは検証コストの削減など十分にテストを書くメリットは多い

コンポーネントのテストは実際に書いてみないと分からないことが多いので、とりあえず簡単な1ケースだけからでも良いので書き始めてみましょう！
