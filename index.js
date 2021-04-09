/* global hexo */
hexo.extend.generator.register('search-index', require('./lib/json-search.js'))
