---
title: Setting up code syntax highlighting in gatsby-starter-blog
date: 2020-02-04
description: How to set up code syntax highlighting in gatsby-starter-blog
tags: ['Frontend', 'GatsbyJS']
---

A blog created with [gatsbyjs/gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) has no syntax highlighting by default, which makes code very hard to read.
Let's add syntax highlighting with a plugin.

## Adding the plugin

`gatsby-starter-blog` already has [gatsby-remark-prismjs](https://gatsbyjs.org/packages/gatsby-remark-prismjs) installed as a plugin.
So you don't need to install a new plugin. You only need to update the CSS import settings to enable syntax highlighting.

```js
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,  // Already installed by default
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
```

### CSS import setting

Add the prismjs theme CSS import to `gatsby-browser.js`.
You can see the list of available default themes at [PrismJS/prism/themes](https://github.com/PrismJS/prism/tree/1d5047df37aacc900f8270b1c6215028f6988eb1/themes).

```js
import "prismjs/themes/prism-tomorrow.css"
```

## Using syntax highlighting

Add a language tag to code blocks to enable syntax highlighting.
The list of supported language tags is on the [prismjs](https://prismjs.com/#supported-languages) official page.

~~~js
```js
console.log('Hello syntax highlighting!')
```
~~~
