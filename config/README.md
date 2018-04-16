create the following files with at least these attributes

> db.config.json

```json
{
    "user": "USERNAME",
    "database": "DATABASE",
    "password": "PASSWORD",
    "host": "HOST_ADDRESS",
    "port": 1234,
    "max": 10,
    "idleTimeoutMillis": 100000
}
```

> global.config.json

```json
{
    "port": 3000
}
```

> html-minify.config.json

```json
{
    "useShortDoctype": true,
    "sortClassName": true,
    "sortAttributes": true,
    "removeTagWhitespace": true,
    "removeStyleLinkTypeAttributes": true,
    "removeScriptTypeAttributes": true,
    "removeRedundantAttributes": true,
    "removeComments": true,
    "removeAttributeQuotes": true,
    "quoteCharacter": "'",
    "preserveLineBreaks": true,
    "minifyURLs": true,
    "minifyJS": {
        "ecma": 6,
        "compress": {
            "passes": 2
        },
        "safari10": true
    },
    "minifyCSS": true,
    "decodeEntities": true,
    "collapseWhitespace": true,
    "conservativeCollapse": true,
    "collapseInlineTagWhitespace": true,
    "removeOptionalTags": false
}
```

> includes.config.json

```json
["lib/auth", "lib/location", "lib/xhr"]
```

> jwt.config.json

```json
{
    "secret": "123456789",
    "refreshSecret": "123456789"
}
```
