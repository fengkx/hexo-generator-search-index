# hexo-generator-search-index

[![NPM version](https://badgen.net/npm/v/hexo-generator-search-index)](https://npmjs.com/package/hexo-generator-search-index)

Use [js-search](https://github.com/bvaughn/js-search) to generate index  
Use [jieba-wasm](https://github.com/fengkx/jieba-wasm) to tokenize chinese

It generates an object which key is the query and value is an array of document (post / page) index sorted as `roguhly idftf desc`.

**You should not use this, It is just an experiment.**
With index generated it almost doubled the size of search.json. So it maybe loads slower. Use `indexOf` to search keywords is fast enough in most cases

## Install

```bash
npm i hexo-generator-search-index
```

## Usage

1. Put this in your site `_config.yml`

```yaml
search:
  path: search.json
  field: post # post or page (whether generate result for non post page)
  minKeyLen: 2 # min key len in search index
  indexStrategy: prefix # prefix otherwise use exact word index strategy
  enableIndex: true # whether put index in the output
```

## Demos

You can find demo ouput in demos folder.

do search

```js
let query // user input search query
fetch('/saerch.json')
  .then(res => res.json())
  .then(data => {
    const result = data.m[query].map(idx => data.docs[idx])
    console.log(result)
  })
```
