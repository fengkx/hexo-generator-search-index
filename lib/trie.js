export class Trie {
  constructor() {
    this.root = {
      data: null,
      $: {},
      end: false
    }
  }

  insert(word, data) {
    let cur = this.root
    for (const c of word) {
      if (!cur.$[c]) {
        cur.$[c] = {
          val: null,
          $: {},
          isEnd: false
        }
      }
      cur = cur.$[c]
    }
    cur.data = data
    cur.end = true
  }

  search(word) {
    let cur = this.root
    for (const c of word) {
      if (!cur.$[c]) {
        return false
      }
      cur = cur.$[c]
    }
    if (cur.end) {
      return cur.data
    }
    return undefined
  }

  startsWith(prefix) {
    let cur = this.root
    for (const c of prefix) {
      if (!cur.$[c]) {
        return undefined
      }
      cur = cur.$[c]
    }
    return true
  }
}
