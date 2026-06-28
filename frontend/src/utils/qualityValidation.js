const keyboardPatterns = ['asdf', 'qwer', 'zxcv', 'hjkl', 'lkj', 'sdf', 'dfg', 'jkl']
const fakeWords = new Set([
  'asdf',
  'asdfasdf',
  'qwerty',
  'qwertyqwerty',
  'test',
  'testing',
  'dummy',
  'fake',
  'none',
  'n/a',
  'na',
])

const normalize = (value) => String(value || '').trim().toLowerCase()

const hasRepeatedCharacters = (value) => /(.)\1{4,}/i.test(value)

const hasLowVariety = (value) => {
  const letters = normalize(value).replace(/[^a-z]/g, '')
  if (letters.length < 6) return false

  return new Set(letters).size <= Math.max(2, Math.floor(letters.length * 0.25))
}

const hasKeyboardPattern = (value) => {
  const compact = normalize(value).replace(/[^a-z]/g, '')

  return keyboardPatterns.some((pattern) => compact.includes(pattern))
}

const hasRepeatedWords = (value) => {
  const words = normalize(value).split(/\s+/).filter(Boolean)
  if (words.length < 3) return false

  return words.some((word, index) => index > 0 && word === words[index - 1])
}

const hasFakeWord = (value) => {
  const compact = normalize(value).replace(/[^a-z/]/g, '')
  const words = normalize(value).split(/\s+/)

  return fakeWords.has(compact) || words.some((word) => fakeWords.has(word))
}

const hasEnoughWords = (value, minWords) =>
  normalize(value)
    .split(/\s+/)
    .filter((word) => /[a-z0-9]/i.test(word)).length >= minWords

export const looksMeaningful = (value, options = {}) => {
  const text = normalize(value)
  if (!text) return false
  if (hasRepeatedCharacters(text)) return false
  if (hasKeyboardPattern(text)) return false
  if (hasFakeWord(text)) return false
  if (hasRepeatedWords(text)) return false
  if (hasLowVariety(text)) return false
  if (options.minWords && !hasEnoughWords(text, options.minWords)) return false

  return true
}

export const looksLikeName = (value) => {
  const text = String(value || '').trim()
  if (!/^[a-zA-Z][a-zA-Z'.-]*(\s+[a-zA-Z][a-zA-Z'.-]*)+$/.test(text)) return false

  return looksMeaningful(text, { minWords: 2 })
}

export const looksLikeEntityName = (value) => {
  const text = String(value || '').trim()
  if (!/^[a-zA-Z0-9][a-zA-Z0-9&.,' -]{1,158}$/.test(text)) return false

  return looksMeaningful(text)
}
