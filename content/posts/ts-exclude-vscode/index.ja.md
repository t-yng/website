---
title: excludeに含めたTSファイルがVSCodeで型チェックされる原因
date: 2024-02-15
description: TSConfigにはコンパイル対象のファイルを設定するオプションとして、`include`と`exclude`が存在します。このオプションで特定のファイルを対象外にしたにも関わらずVSCodeで対象のファイルを開くと型エラーが発生する場合があります。
tags: ['TypeScript']
---

TSConfigにはコンパイル対象のファイルを設定するオプションとして、`include`と`exclude`が存在します。
このオプションで特定のファイルを対象外にしたにも関わらずVSCodeで対象のファイルを開くと型エラーが発生する場合があります。

例えば、次の例では`exclude`オプションでテストファイル(*.spec.ts)を除外しているにも関わらず、VSCodeでテストファイルを開くとパスエイリアスの解決で型エラーが発生します。

コンパイル対象外としているので、テストファイルは型チェックの対象とならずに型エラーも発生しないイメージを持っており、この挙動にずっと疑問を持っていました。

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@test/*": ["test/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "src/**/*.spec.ts"]
}
```

```ts
// src/utils/math.spec.ts
import { it } from 'vitest';
// Error: Cannot find module '@/utils/math' or its corresponding type declarations.
import { add } from '@/utils/math';
```

## プロジェクトコンテキストの確立
VSCodeはtsconfig.jsonを使用してプロジェクトのコンテキストを確立します。ファイルが`include`オプションによって指定されたパスに含まれていない場合や`exclude`オプションで指定されている場合、そのファイルはプロジェクトの一部と見なされず、プロジェクトのスコープ外として扱われます。

## スコープ外のファイルの扱い
スコープ外のファイルは、プロジェクト設定（tsconfig.jsonで定義された設定）の影響を受けません。
これは、プロジェクト設定のコンパイルオプション、モジュール解決戦略、型定義ファイルの参照などが適用されないことを意味します。

VSCodeのTypeScript言語サービスはこれらのファイルに対して、グローバル設定またはデフォルト設定を使用して解析を行います。
その結果、プロジェクトの設定ではなくデフォルト設定などで型チェックが実施されるためパスエイリアスなどが解決できずに型エラーが発生します。

## まとめ
`@ts-ignore`などを明示的に指定しない限りは、VSCodeは開いているTypeScriptファイルを何かしらの設定で解析してくれます。この時どの設定でコードを解析するかが、プロジェクトのtsconfig.jsonで決まります。

対象のファイルが`exclude`に含まれる場合は、プロジェクトのスコープ外となりプロジェクトのtsconfig.jsonの設定が適用されずに、デフォルトの設定やグローバル設定で解析が行われます。

プロジェクトのコンパイル対象に含めない=VSCodeでの型チェックの対象外 という事ではないことに注意が必要です。

## 参考
[Should VSCode report errors for TS files that are excluded from compilation?](https://stackoverflow.com/questions/52265758/should-vscode-report-errors-for-ts-files-that-are-excluded-from-compilation)
