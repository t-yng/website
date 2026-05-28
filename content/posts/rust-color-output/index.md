---
title: Rustで標準出力に色を付ける
date: 2020-06-13
description: Rustで標準出力に色を付ける
tags: ['Rust']
---

Rustで標準出力に色を付けるだけなら、次のように書けば可能です。ただ、コードにこのまま書くのは保守性の面でも避けたいです。

```rust
fn main() {
    let output = "Hello, World";
    println!("\x1b[38;5;1m{}\x1b[m ", output);
}
```

## mackwic/colored
[mackwic/colored](https://github.com/mackwic/colored) はターミナルの標準出力の色付けが簡単にできるクレートです。  
これを利用すれば、簡単に実装ができます。

#### インストール

```toml
[dependencies]
colored = "1.9" # バージョンは随時更新してください
```

#### 使い方

```rust
use colored::*;

fn main() {
    let output = "Hello, World";
    println!("{}", output.red());
    println!("{}", output.blue().bold());
}
```
