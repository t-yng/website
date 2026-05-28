---
title: Output a request ID in all logs with Express
date: 2020-02-22
description: How to output a request ID in all logs with Express
tags: ['Node.js']
---

In Node.js, processing is asynchronous, so log messages do not always appear grouped by request.
By adding a request ID as metadata to each log, it becomes easier to trace which request caused each log.

This article explains how to add a request ID to all logs in an Express server.

## Implementation

[t-yng/express-requestid-log](https://github.com/t-yng/express-requestid-log)

```javascript
require('zone.js');
const express = require('express');
const uuidv4 = require('uuid/v4');
const winston = require('winston');
const logger = require('./utils/logger');
const app = express();

/**
 * Create a Zone with a new request ID for each request
 */
const attachRequestId = (req, res, next) => {
    Zone.current.fork({
        name: 'request',
        properties: {
            requestId: uuidv4()
        }
    })
    .run(next);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.prettyPrint(),
    defaultMeta: {
        get requestId() {
            return Zone.current.get('requestId');
        }
    },
    transports: [
        new winston.transports.Console(),
    ]
});

app.use(attachReqestId);

app.get('/', (req, res) => {
    logger.info('request log', {
        path: req.path
    });
    res.send('hello world');
});

app.listen(3000, () => console.log('listening port 3000'));
```

## zone.js

The first key point is [zone.js](https://github.com/angular/angular/tree/master/packages/zone.js).

Since we want to add a request ID to all logs, the logger module needs to read the request ID as a common operation.
If we attach the request ID to Express's `req` object, the logger module would need to reference `req`. But the logger is a module independent of the Express context, so accessing `req` is difficult.

We could store it in the global object, but since Node.js is single-threaded, the request ID would be overwritten by other async requests.

So we use zone.js to manage the value globally per request, making it accessible from the logger module.

## get syntax

The second key point is the [get syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) for objects.

We use winston for logging. Setting a value in `defaultMeta` outputs it as common metadata in all logs.
However, the request ID is a dynamic value that changes at runtime. By using the `get` syntax, the value is fetched dynamically each time `defaultMeta.requestId` is accessed.

## Summary

It was good to learn about zone.js and how to use the `get` syntax.
When I searched for solutions, there were not many results, so I wondered how others handle this.
Maybe in many cases, request IDs are added at the infrastructure layer, not the application layer, so this approach is not needed?
