---
title: Spoofing a MAC address
date: 2020-03-21
description: How to spoof a MAC address
tags: ['Security']
---

When talking to someone at a company, I heard that their internal infrastructure team checks MAC addresses to restrict network access as a security measure. I thought, "Can't you easily spoof a MAC address?" So I looked into it.

## Warning

This article is written for learning about security by understanding attack methods.
Please never use this against external systems with bad intentions.

## spoof

I found a CLI tool called `spoof` that can spoof MAC addresses on macOS, Windows, and Linux.

[feross/spoof: Easily spoof your MAC address in macOS, Windows, & Linux!](https://github.com/feross/spoof)

### Installation

```
$ npm i -g spoof
```

### Usage

#### Show list of MAC addresses

```shell
$ spoof list
- Wi-Fi on device en0 with MAC address xx:xx:xx:xx:xx:xx
- ...
```

#### Set a random MAC address

```shell
# Root permission is required
$ sudo spoof randomize en0
$ spoof list
- Wi-Fi on device en0 with MAC address xx:xx:xx:xx:xx:xx currently set to 00:50:56:6F:42:0A
- ...
```

#### Set a specific MAC address

```shell
# Root permission is required
$ sudo spoof set 
$ sudo spoof list
```

#### Reset MAC address

```shell
# Root permission is required
$ sudo spoof reset en0
```

## Without the tool

It turns out you can do it without the tool too.
[How to change your MAC address using Terminal on macOS - yu8mada](https://yu8mada.com/2018/06/27/how-to-change-one-s-own-mac-address-using-terminal-on-macos/)

#### Check MAC address

```shell
$ networksetup -listallhardwareports

Hardware Port: Wi-Fi
Device: en0
Ethernet Address: xx:xx:xx:xx:xx:xx

...

$ ifconfig en0 | grep ether
	ether xx:xx:xx:xx:xx:xx
```

#### Set MAC address

```shell
$ sudo ifconfig en0 ether 60:d2:48:2f:39:64
$ ifconfig en0 | grep ether
	ether 60:d2:48:2f:39:64
```

#### Reset MAC address

Using `spoof` is faster when you need to reset.

```shell
$ networksetup -getmacaddress Wi-Fi
Ethernet Address: xx:xx:xx:xx:xx:xx (Hardware Port: Wi-Fi)

$ sudo ifconfig en0 ether xx:xx:xx:xx:xx:xx
```

## Summary

Spoofing a MAC address turned out to be very easy.
Simple access control based on MAC addresses does not provide much security.
