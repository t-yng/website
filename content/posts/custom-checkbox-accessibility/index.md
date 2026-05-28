---
title: アクセシビリティを考慮してチェックボックスのデザインを変更する
date: 2022-12-11
description: アクセシビリティを考慮したカスタムなCheckboxを実装する方法です。
tags: ['フロントエンド', 'テスト']
---

## Google検索で見つかるサンプル実装の課題
Checkboxのデザインをカスタマイズするには、従来のCheckboxでは難しく自前でCheckboxを実装する必要があります。Googleで「チェックボックス デザイン 変更」と検索して上位に出てくる記事を見ると次のサンプルのように`input[type="checkbox"]`を`display:none`で非表示にしている実装が多くあります。

この実装では`<input>`要素にフォーカルを当てることができないため、Tabキーで選択してスペースでトグルするようなキーボード操作ができない状態になっています。
また、スクリーンリーダーがチェックボックスを認識できないので、スクリーンリーダーユーザーはチェックボックスの存在に気づくことすらできません。

<iframe src="https://stackblitz.com/edit/react-ts-2tdsqo?embed=1&file=src/BadCheckbox/style.css&initialpath=?bad" style="width: 100%; height: 400px;"></iframe>

## アクセシビリティを考慮してチェックボックスを実装
`display:none`だとフォーカスができなくなってしまうので、代わりに`opacity:0;`で`<input>`を非表示にします。
`<input>`は非表示のままのため、フォーカスが当たっている時のデザインを追加します。

この考慮を入れて上げるだけで、キーボード操作可能になり操作性が上がりスクリーンリーダーユーザーもチェックボックスの操作が可能になります。

```css
/* src/GoodCheckbox/style.css */

/* 元のチェックボックス（非表示） */
input[type='checkbox'] {
  opacity: 0;
  position: absolute;
}

/* フォーカスが当たっている時のデザインを追加 */
input[type='checkbox']:focus-visible + label::before {
  border-color: blue;
}
```

<iframe src="https://stackblitz.com/edit/react-ts-2tdsqo?embed=1&file=src/GoodCheckbox/style.css" style="width: 100%; height: 400px;"></iframe>

## デザイン実装をリファクタする（おまけ）
ここから先は好みの問題かもですが、CSSを利用したサンプル実装は疑似要素を使った実装になっており直感できないため、少し保守がしづらく感じます。疑似要素を使わずに直感的にデザイン指定できるようにリファクタをしてみます。

疑似要素を使わずにカスタムなチェックボックスを`<span>`タグで実装してCSSでデザインを指定することで、宣言的になり直感的に分かりやすくなりました。

チェックアイコンを`<svg>`タグで直接表示するように変更しています。この時の注意点としてチェックアイコンの画像は視覚的な情報なのでスクリーンリーダーユーザーにとっては唯のノイズになってしまいます。実際に`aria-hidden`を消してスクリーンリーダーに読み上げさせると、チェック済みの場合に「イメージ」という無駄な読み上げが発生します。そのため、忘れないように`<svg aria-hidden="true">`と設定してあげる必要があります。`@mui/icons-material`ではデフォルトで`aria-hidden="true"`となるので別途指定はしていません。

<iframe src="https://stackblitz.com/edit/react-ts-2tdsqo?embed=1&file=src/Checkbox/Checkbox.tsx&initialpath=?refactor" style="width: 100%; height: 400px;"></iframe>

```tsx
// src/Checkbox/Checkbox.tsx

import * as React from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import './style.css';

type CheckboxProps = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <label className="checkbox">
      <input type="checkbox" defaultChecked={checked} onChange={onChange} />
      <span className="custom-checkbox">
        {checked && <CheckRoundedIcon fontSize="small" />}
      </span>
      <span>ラベル</span>
    </label>
  );
};
```

```css
/* src/Checkbox/Checkbox.tsx */

.checkbox {
  display: inline-flex;
  cursor: pointer;
  gap: 8px;
}

.checkbox input[type='checkbox'] {
  opacity: 0;
  position: absolute;
}

.checkbox .custom-checkbox {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid lightgray;
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
}

.checkbox input[type='checkbox']:checked + .custom-checkbox {
  background-color: lightcoral;
}

.checkbox input[type='checkbox']:focus + .custom-checkbox {
  border-color: blue;
}
```
