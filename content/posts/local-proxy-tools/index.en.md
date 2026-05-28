---
title: Comparing local proxy tools
date: 2021-06-30
description: A quick comparison of four local proxy tools.
tags: ['Security']
---

I compared four local proxy tools for playing with security testing.

## Goal

Modify parts of JSON API responses from a specific service.

Note: I tested this against the development environment of a service I am developing myself.

## Tools compared

All tools were compared using their free versions. If a tool has a trial period for the paid version, I wrote my impressions based on the paid features during the trial.

My evaluation is based on how the tools felt when trying the "modify API responses" use case, so personal preference plays a big role.

- [Fiddler Everywhere](https://www.telerik.com/fiddler/fiddler-everywhere)
- [Burp Suite](https://portswigger.net/burp/communitydownload)
- [Charles](https://www.charlesproxy.com/)
- [mitmproxy](https://mitmproxy.org/)

## Fiddler (Fiddler Everywhere)

Fiddler was originally a Windows-only tool, but around 2020 Fiddler Everywhere was released as a new version supporting macOS and Linux. There was a trial period of about 2 months for the PRO (paid) version.

PRO version price: $12/month (or $10/month with annual plan)

### Pros

- Clean, easy-to-read UI
  - Response types are easy to see at a glance
  - Rules for rewriting responses can be set intuitively (PRO version)
- Requests can be filtered
  - Can filter by keyword and header value
- No hassle for SSL certificate installation or proxy settings
  - It just worked before I noticed

### Cons

- Free version limits available actions in rules
  - Response rewriting is not available in the free version (PRO version only)
  - With the paid version, all rule actions are unlocked and it's easy to use
- Sign-in required
  - Google authentication is available so no need to create a separate account

## Burp Suite

The paid version seems to have many features for security testing.
It looks like you can do SQL injection testing too (I didn't try this, so I'm not sure).

### Pros

- Can automatically rewrite responses
  - Supports substring matching for replacements
- When rewriting a response, you can see both the original and modified response bodies
- Lots of Japanese documentation available
- Flexible filtering by status code, response type, etc.

### Cons

- UI is hard to read
  - This might be a matter of preference
  - I personally dislike the look of Java GUI apps, which may be influencing my opinion
- Free version doesn't have keyword filtering
  - Available in the paid version
- Paid version is quite expensive at $399/year
  - Too expensive for personal or casual development use
- You need to manually configure proxy settings in your PC's network settings
- SSL certificate installation is a bit involved
  - Open a specific URL in Safari to download the certificate
  - Add the certificate to Keychain
  - Set the certificate to always be trusted

## Charles

The free version force-quits every 30 minutes.

### Pros

- Clean, easy-to-read UI
  - Requests are grouped by domain, making it easy to find requests by domain
- Response rewriting rules are easy to add
- Affordable price
  - $50/license
  - Updates only available for the major version at the time of purchase
  - New major version licenses available at 40% off the regular price

### Cons

- Filtering is weak
  - Can only filter by keyword
- Japanese input shows garbled text in settings fields while typing (though the final input is correct, so Japanese can still be used)

## mitmproxy

An open-source local proxy tool. A major feature compared to the others is that it can be used from the CLI.

Can be installed with Homebrew:

```json
$ brew install mitmproxy
```

To use the Web Interface in a browser, run this command and go to http://localhost:8081:

```sh
$ mitmweb
```

To capture HTTPS traffic, register `~/.mitmproxy/mitmproxy-ca-cert.cer` as a trusted certificate in Keychain.

### Pros

- Free
- Can write scripts in Python, making it easy to extend

### Cons

- Since it is primarily a CUI tool, there is a lot to learn and the learning cost is high
  - There is a web interface, but the UI is simple and not very user-friendly
  - Once you learn it, all operations can be done in the CUI, which might suit some people very well
- Response rewriting syntax has some quirks
  - Add to modify_body in a format like `/~s/xxxx/yyyy`
  - `~s` is a mitmproxy [filter expression](https://docs.mitmproxy.org/stable/concepts-filters/) that targets responses only

## Conclusion

| Tool | Impression |
|--|--|
| Fiddler Everywhere | My favorite UI. Worth considering if you can accept about $100/year. |
| Burp Suite | Too expensive. I wouldn't use it unless I really needed it. |
| Charles | Best overall balance. Seems extensible too. If you want a simple proxy tool, this is the best choice. Can be used for free if you can tolerate the 30-minute limit. |
| mitmproxy | Once you learn it, you can do most simple things. If you want a completely free tool, use this. The extensibility is attractive. |
