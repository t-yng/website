---
title: HTTP response headers for web security
date: 2020-04-08
description: HTTP response headers you should know about when thinking about security in frontend development.
tags: ['Frontend', 'Security']
---

Here is a summary of HTTP response headers that are important to consider for security in frontend development.

## X-Powered-By

### Description

An HTTP header that includes information about the framework and version used on the server side.

```
Example:
X-Powered-By: Next.js
```

### Vulnerability

Since this header includes information about the framework and version used on the server, it can give attackers useful information to help exploit other vulnerabilities.

### How to fix

Configure the server to not send the X-Powered-By header.

## X-Runtime

### Description

An HTTP header that includes the server response time.

```
Example:
X-Runtime: 0.094235
```

### Vulnerability

This header can be used in timing attacks.

### Timing attacks

A timing attack is a technique that analyzes a service by measuring differences in server response times.
For example, suppose a login process is implemented like this:

```typescript
const login = (user_name, password) => {
    const user = User.get(user_name);
    if (user == null) return res.send(400);

    // If the username exists, password checking runs, making the response a bit slower
    const mached = user.matchPassword(password);
    if (matched) res.send(200);
    else res.send(400);
}
```

If the username is registered, password checking runs, making the response slightly longer. An attacker can send requests with random usernames and compare the X-Runtime values to find out which usernames are registered.

```
# Unregistered username
X-Runtime: 0.3949

# Registered username
X-Runtime: 0.6421
```

Reference: [X-Runtime Header Timing Attacks - Virtue Security](https://www.virtuesecurity.com/kb/x-runtime-header-timing-attacks/)

### How to fix

Configure the server to not send the X-Runtime header.

## Cache-Control

### Description

An HTTP header that controls cache lifetime and storage.
When set as an HTTP response header, it controls how the browser caches the server response.

```
Example: Cache an image for one day
Cache-Control: max-age=86400
```

### Vulnerability

If no Cache-Control is set, browsers will cache server responses by default when possible.
If the response includes sensitive information like a user's password, and an attacker can somehow access the user's physical machine, they could steal that information from the browser cache.

### How to fix

Set appropriate Cache-Control values based on the type of data.
For example, if the response includes data that should not be stored on the user's device, use `no-store` to prevent caching.

```
Cache-Control: no-store
```

## X-Frame-Options

### Description

[X-Frame-Options - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

This header prevents the browser from displaying your web page inside an `<iframe>` or `<object>`, ensuring your page cannot be embedded in other sites.

### Vulnerability

Without this header, the page could be used in a clickjacking attack.

### Clickjacking

Clickjacking is an attack where the attacker places a transparent iframe over a normal web page, tricking users into clicking on something they didn't intend to.

For example, suppose a user is using a service with these characteristics:

```
1. Login information is managed with cookies
2. The same-site attribute is set to 'none'
3. Clicking the delete button on the account page deletes the account without confirmation
```

In this case, the attacker embeds the account page of the target service in a transparent iframe placed over their own page. If the user is logged in, the account page is shown transparently on top. By placing a clickable button at the position that overlaps with the delete button, the attacker can trick the user into clicking it and deleting their account.

### How to fix

Use `X-Frame-Options: DENY` to prevent the page from being embedded in iframes.

## Content-Security-Policy (CSP)

### Description

[Content Security Policy (CSP) - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

CSP can prevent inline scripts from running and reduce attacks like XSS.

For example, including this in the HTTP response header prevents inline scripts from running even if there is a vulnerability in a bulletin board service that lets users embed arbitrary strings without sanitization:

```
# Block loading files from external domains and running inline scripts
Content-Security-Policy: default-src 'self'
```

In Internet Explorer, only the CSP `sandbox` directive is available. IE9 and below do not support CSP at all, so you need to use the X-XSS-Protection header described below.

For detailed settings, see the MDN link above.

### Vulnerability

If user input is displayed on screen without sanitization (like in a bulletin board), it may be vulnerable to XSS attacks.

### Note

If you block scripts from external domains, you cannot load libraries from CDNs.
So you need to configure CSP properly based on the needs of your service.

For example, the following allows loading scripts only from your own domain and a specific CDN:

```
Content-Security-Policy: default-src 'self' cdnjs.cloudflare.com
```

### How to fix

Set the Content-Security-Policy header appropriately.

*Note: Even with CSP, you should still sanitize user input where it is displayed on screen.*

## X-XSS-Protection

### Description

When the browser detects an XSS attack, it automatically stops loading the page.

If CSP is already set strictly, this header is technically not needed.
However, it is useful when users access with older browsers that do not support CSP (IE9 and below).

## Strict-Transport-Security

### Description

[Strict-Transport-Security - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)

When included in the HTTP response header when a user accesses a page over HTTPS, this header tells the browser to use HTTPS instead of HTTP for future requests.

Note: Strict-Transport-Security is ignored if the user accesses via HTTP for the first time, so it is not effective if the user has never accessed the site over HTTPS. The setting becomes active once the user accesses via HTTPS and the SSL certificate is verified.

```
# Keep the HTTPS setting valid for one year (the expiry is renewed on each access)
Strict-Transport-Security: max-age=31536000;
```

### Vulnerability

Suppose you regularly use a banking site that allows HTTP access.
If you connect to free WiFi at a cafe and use that banking site over HTTP, an attacker could intercept your HTTP requests and steal your bank account or login information.

### How to fix

Set the Strict-Transport-Security header.

In the example above, if the banking site has set Strict-Transport-Security and you have previously accessed it via HTTPS even once, then even if you accidentally access it via HTTP, the browser will automatically connect via HTTPS, preventing the attack.
