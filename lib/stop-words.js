// https://github.com/fxsjy/jieba/blob/67fa2e36e72f69d9134b8a1037b83fbb070b9775/extra_dict/stop_words.txt
module.exports = [
  'the',
  'of',
  'is',
  'and',
  'to',
  'in',
  'that',
  'we',
  'for',
  'an',
  'are',
  'by',
  'be',
  'as',
  'on',
  'with',
  'can',
  'if',
  'from',
  'which',
  'you',
  'it',
  'this',
  'then',
  'at',
  'have',
  'all',
  'not',
  'one',
  'has',
  'or',
  'that',
  '一个',
  '没有',
  '我们',
  '你们',
  '妳们',
  '他们',
  '她们',
  '是否',
  '一個',
  '沒有',
  '我們',
  '你們',
  '妳們',
  '他們',
  '她們',
  '是否',
  // custom start
  '首先',
  '其次',
  '总结',
  '总的来说',
  '其中',
  '不得不',
  '这',
  '那',
  '哪',
  '这些',
  '那些',
  '哪些',
  '这个',
  '那个',
  '哪个',
  '这是',
  '那是',
  '哪是',
  '这种',
  '那种',
  '哪种',
  '相当',
  '特别',
  '例如',
  '比如',
  '而且',
  '并且',
  '对于',
  '大概',
  '虽然',
  '即使',
  '但是',
  '可是',
  '只是',
  '不多',
  '不少',
  '看到',
  '因为',
  '由于',
  '所以',
  '因为',
  '因而'
].reduce((acc, cur) => {
  acc[cur] = true
  return acc
}, {})
