---
title: Adding color to standard output in Rust
date: 2020-06-13
description: How to add color to standard output in Rust.
tags: ['Rust']
---

To add color to standard output in Rust, you can write it like this. However, writing escape codes directly in the code is not ideal for maintainability.

```rust
fn main() {
    let output = "Hello, World";
    println!("\x1b[38;5;1m{}\x1b[m ", output);
}
```

## mackwic/colored

[mackwic/colored](https://github.com/mackwic/colored) is a crate that makes it easy to add color to terminal standard output.
Using this crate makes the implementation simple.

#### Installation

```toml
[dependencies]
colored = "1.9" # Update the version as needed
```

#### Usage

```rust
use colored::*;

fn main() {
    let output = "Hello, World";
    println!("{}", output.red());
    println!("{}", output.blue().bold());
}
```
