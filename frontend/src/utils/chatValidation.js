import { looksLikeEntityName, looksLikeName, looksMeaningful } from './qualityValidation'

const meaningfulRules = {
  fullName: {
    test: looksLikeName,
    message: 'Enter your first and last name.',
  },
  companyName: {
    test: looksLikeEntityName,
    message: 'Enter a real company name.',
  },
  firmName: {
    test: looksLikeEntityName,
    message: 'Enter a real firm name.',
  },
  role: {
    test: looksMeaningful,
    message: 'Enter a real role.',
  },
  roleAtFirm: {
    test: looksMeaningful,
    message: 'Enter a real role.',
  },
}

export const validateQuestionAnswer = (question, value) => {
  const rules = question.validation || {}
  const textValue = String(value ?? '').trim()

  if (rules.required && !textValue) return 'This field is required.'
  if (!textValue) return ''

  // Override minLength based on Priority 3 rules:
  // Text fields -> minimum 2 characters.
  // Textareas -> minimum 10 characters.
  let minLength = rules.minLength
  if (question.type === 'textarea') {
    minLength = 10
  } else if (
    question.type === 'text' ||
    question.type === 'email' ||
    question.type === 'tel' ||
    question.type === 'url'
  ) {
    minLength = 2
  }

  if (minLength && textValue.length < minLength) {
    return `Please enter at least ${minLength} characters.`
  }

  // Remove maxLength restrictions completely per Priority 3.

  if (rules.min !== undefined && Number(textValue) < rules.min) {
    return `Value must be at least ${rules.min}.`
  }
  if (rules.max !== undefined && Number(textValue) > rules.max) {
    return `Value must be ${rules.max} or less.`
  }
  if (rules.pattern === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)) {
    return 'Enter a valid email address.'
  }
  if (rules.pattern === 'phone' && !/^[0-9+\-\s()]{7,20}$/.test(textValue)) {
    return 'Enter a valid phone number.'
  }
  if (rules.pattern === 'url') {
    try {
      new URL(textValue)
    } catch {
      return 'Enter a valid URL.'
    }
  }

  const qualityRule = meaningfulRules[question.id]
  if (qualityRule && !qualityRule.test(textValue)) {
    return qualityRule.message
  }

  return ''
}
