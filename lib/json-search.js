const { Search, ExactWordIndexStrategy } = require('js-search')
const { tokenize: jiebaTokenize } = require('jieba-wasm')
const { htmlUnescape } = require('escape-goat')
const STOP_WORDS = require('./stop-words')

const defaultConfig = {
  path: 'search.json',
  field: 'post',
  minKeyLen: 2,
  indexStrategy: 'prefix',
  enableIndex: true
}

// key is sanitized
const contentTokenPos = new Map()
// eslint-disable-next-line no-unused-vars
const lowerCaseSanitizer = text => (text ? text.toLocaleLowerCase().trim() : '')
function createSearch(config) {
  const search = new Search('url')
  if (config.indexStrategy !== 'prefix') {
    search.indexStrategy = new ExactWordIndexStrategy()
  }
  search.tokenizer = {
    tokenize(text) {
      const tokens = jiebaTokenize(text, 'search', true).filter(w => {
        return w.word.length > 1 && !STOP_WORDS[w.word]
      })
      let start = text.length - 1
      let end = 0
      return tokens.map(tok => {
        if (tok.start < start || tok.end > end) {
          if (tok.start < start) start = tok.start
          if (tok.end > end) end = tok.end
          contentTokenPos.set(text, { start, end })
        }
        return tok.word
      })
    }
  }
  search.addIndex('title')
  search.addIndex('content')
  search.addIndex('tags')
  return search
}

// Based on https://github.com/SukkaW/hexo-theme-suka/blob/1d457ac9fbad421d2e6b9853ae1cb3dfc5cadf05/includes/generator/search.js
// And it is GPL license
module.exports = function(locals) {
  const urlFor = this.extend.helper.get('url_for').bind(this)
  const config = { ...defaultConfig, ...this.config.search }
  const search = createSearch(config)
  const { stripHTML } = require('hexo-util')
  const searchfield = config.field

  const parse = item => {
    const _item = {}
    if (item.title) _item.title = item.title
    if (item.date) _item.date = item.date
    if (item.path) _item.url = urlFor(item.path)
    if (item.tags && item.tags.length > 0) {
      _item.tags = []
      item.tags.forEach(tag => {
        _item.tags.push(tag.name)
      })
    }
    if (item.categories && item.categories.length > 0) {
      _item.categories = []
      item.categories.forEach(cate => {
        _item.categories.push(cate.name)
      })
    }
    if (item._content) {
      _item.content = stripHTML(
        item.content.trim().replace(/<pre(.*?)<\/pre>/gs, '')
      )
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(
          new RegExp(
            '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
            'g'
          ),
          ''
        )
      _item.content = htmlUnescape(_item.content) // handle & ; escape
    }
    return _item
  }

  let posts
  let pages

  if (searchfield) {
    if (searchfield === 'post') {
      posts = locals.posts.sort('-date')
    } else if (searchfield === 'page') {
      pages = locals.pages
    } else {
      posts = locals.posts.sort('-date')
      pages = locals.pages
    }
  } else {
    posts = locals.posts.sort('-date')
  }

  let totalLen = 0
  if (posts) {
    posts.each(post => {
      search.addDocument(parse(post))
    })
    totalLen += posts.count()
  }
  if (pages) {
    pages.each(page => {
      search.addDocument(parse(page))
    })
    totalLen += pages.count()
  }

  const data = minifyData(search._searchIndex._tokenMap, totalLen, config)
  if (!config.enableIndex) {
    delete data.map
  }
  return {
    path: config.path,
    data: JSON.stringify(data)
  }
}

function minifyData(tokenMap, totalLen, config) {
  let id = 0
  const docs = []
  const docIdMap = new Map()
  const result = Object.keys(tokenMap).reduce((acc, k) => {
    const numDocumentsWithToken = tokenMap[k].$numDocumentOccurrences
    const uidMap = tokenMap[k].$uidMap
    const urlKeys = Object.entries(uidMap)
      .map(([uk, uv]) => {
        uv.url = uk
        if (!docIdMap.has(uv.$document.url)) {
          docs.push(uv.$document)
          docIdMap.set(uv.$document.url, id)
          id++
        }

        const idf = 1 + Math.log(totalLen / (1 + numDocumentsWithToken))

        return [docIdMap.get(uk), uv.$numTokenOccurrences * idf]
      })
      .sort((a, b) => {
        return b[1] - a[1]
      })
    acc[k] = urlKeys.map(item => item[0])
    return acc
  }, {})

  return {
    docs: docs.map(i => {
      i.date = i.date.format('YYYY-MM-DDTHH:mm:ss')
      return i
    }),
    map: Object.keys(result)
      .filter(k => k.length >= config.minKeyLen && !/^\d+$/.test(k))
      .reduce((acc, cur) => {
        acc[cur] = result[cur]
        return acc
      }, {})
  }
}
