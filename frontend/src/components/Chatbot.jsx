import { useEffect, useMemo, useRef, useState } from 'react'
import { createLead, validateAnswer } from '../api/client'
import { founderFlow, founderQuestions } from '../data/founderQuestions'
import { investorFlow, investorQuestions } from '../data/investorQuestions'
import { validateQuestionAnswer } from '../utils/chatValidation'
import { getApiErrorMessage } from '../utils/lead'
import ChatComposer from './chat/ChatComposer'
import ChatMessage from './chat/ChatMessage'
import ChoicePrompt from './chat/ChoicePrompt'
import TypingIndicator from './chat/TypingIndicator'

const STORAGE_KEY = 'venturizer.conversation.v2'
const CONTACT_FIELDS = new Set(['fullName', 'email', 'phone', 'linkedIn'])

const AI_VALIDATED_FIELDS = new Set([
  'background',
  'problem',
  'startupDescription',
  'customer',
  'traction',
  'validationEvidence',
  'useOfFunds',
  'investmentThesis',
  'sectors',
  'currentPortfolio',
  'supportModel',
  'additionalInfo',
])

const flows = {
  FOUNDER: { meta: founderFlow, questions: founderQuestions },
  INVESTOR: { meta: investorFlow, questions: investorQuestions },
}

const roleChoices = [
  { label: 'Founder', value: 'FOUNDER' },
  { label: 'Investor', value: 'INVESTOR' },
]

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    sender: 'bot',
    text: "Hi! I'm Venturizer's AI qualification assistant. I'll guide you through a short conversation to understand whether Venturizer is the right fit for you.",
  },
  {
    id: 'who-are-you',
    sender: 'bot',
    text: 'First — who are you?',
  },
]

const getVisibleQuestions = (questions, answers) =>
  questions.filter((q) => !q.skipIf?.(answers))

const buildPayload = (type, questions, answers) => {
  const profile = {}

  questions.forEach((q) => {
    if (!CONTACT_FIELDS.has(q.id) && q.id !== 'additionalInfo') {
      profile[q.id] = q.type === 'number' ? Number(answers[q.id] || 0) : answers[q.id]
    }
  })

  return {
    fullName: answers.fullName,
    email: answers.email,
    phone: answers.phone,
    linkedIn: answers.linkedIn || undefined,
    type,
    [type === 'FOUNDER' ? 'founder' : 'investor']: profile,
    answers: questions.map((q) => ({
      questionId: q.id,
      question: q.prompt,
      answer: String(answers[q.id] ?? ''),
    })),
  }
}

const loadSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved?.phase || !Array.isArray(saved.messages)) return null
    return saved
  } catch {
    return null
  }
}

const mkMsg = (sender, text, extra = {}) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  sender,
  text,
  ...extra,
})

function Chatbot() {
  const saved = useMemo(loadSaved, [])

  const [phase, setPhase] = useState(saved?.phase || 'type')
  const [type, setType] = useState(saved?.type || '')
  const [answers, setAnswers] = useState(saved?.answers || {})
  const [step, setStep] = useState(saved?.step || 0)
  const [messages, setMessages] = useState(saved?.messages || INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [submittedLead, setSubmittedLead] = useState(saved?.submittedLead || null)

  const scrollRef = useRef(null)
  const timerRef = useRef(null)

  const flow = type ? flows[type] : null
  const visibleQuestions = useMemo(
    () => (flow ? getVisibleQuestions(flow.questions, answers) : []),
    [answers, flow]
  )
  const currentQuestion =
    phase === 'questions' ? visibleQuestions[Math.min(step, visibleQuestions.length - 1)] : null
  const currentError = currentQuestion ? validateQuestionAnswer(currentQuestion, draft) : ''
  const canSend = Boolean(currentQuestion && draft.trim() && !currentError && !isValidating)
  const progress = visibleQuestions.length
    ? Math.round((step / visibleQuestions.length) * 100)
    : 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isBotTyping, error, isValidating])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ phase, type, answers, step, messages, submittedLead })
    )
  }, [answers, messages, phase, step, submittedLead, type])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const append = (sender, text, extra) =>
    setMessages((prev) => [...prev, mkMsg(sender, text, extra)])

  const botReply = (text, after) => {
    clearTimeout(timerRef.current)
    setIsBotTyping(true)
    timerRef.current = setTimeout(() => {
      setIsBotTyping(false)
      append('bot', text)
      after?.()
    }, 600)
  }

  const askQuestion = (q) => {
    setDraft('')
    setError('')
    botReply(q.prompt)
  }

  const chooseType = (choice) => {
    const firstQ = flows[choice.value].questions[0]
    append('user', choice.label)
    setType(choice.value)
    setAnswers({})
    setStep(0)
    setPhase('questions')
    botReply(
      `Great! I'll tailor questions for ${choice.value === 'FOUNDER' ? 'founders' : 'investors'}.`,
      () => askQuestion(firstQ)
    )
  }

  const chooseAnswer = (choice) => submitAnswer(choice.value, choice.label)

  const submitLead = async (nextAnswers, questions) => {
    setIsSubmitting(true)
    setError('')

    try {
      const lead = await createLead(buildPayload(type, questions, nextAnswers))
      setSubmittedLead(lead)
      setPhase('success')
      botReply(
        `All done! Your qualification score is ${lead.score}/100 — status: ${lead.status}. The Venturizer team will review your submission and be in touch.`
      )
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitAnswer = async (value = draft, displayValue = value) => {
    if (!currentQuestion || isSubmitting || isValidating) return

    const validationError = validateQuestionAnswer(currentQuestion, value)
    if (validationError) { setError(validationError); return }

    if (AI_VALIDATED_FIELDS.has(currentQuestion.id)) {
      setIsValidating(true)
      try {
        const result = await validateAnswer(currentQuestion.id, String(value))
        if (!result.meaningful) {
          setError('Please enter a meaningful answer.')
          setIsValidating(false)
          return
        }
      } catch {
        // AI unavailable — proceed without blocking
      } finally {
        setIsValidating(false)
      }
    }

    const nextAnswers = { ...answers, [currentQuestion.id]: value }
    const nextQuestions = getVisibleQuestions(flow.questions, nextAnswers)
    const nextStep = step + 1

    append('user', String(displayValue))
    setAnswers(nextAnswers)
    setDraft('')
    setError('')

    if (nextStep >= nextQuestions.length) {
      await submitLead(nextAnswers, nextQuestions)
      return
    }

    setStep(nextStep)
    askQuestion(nextQuestions[nextStep])
  }

  const goBack = () => {
    if (phase !== 'questions' || step === 0 || isSubmitting) return
    const prev = step - 1
    const prevQ = visibleQuestions[prev]
    setStep(prev)
    setDraft(String(answers[prevQ.id] || ''))
    setError('')
    append('bot', `Let's revisit: ${prevQ.prompt}`)
  }

  const restart = () => {
    clearTimeout(timerRef.current)
    localStorage.removeItem(STORAGE_KEY)
    setPhase('type')
    setType('')
    setAnswers({})
    setStep(0)
    setMessages(INITIAL_MESSAGES)
    setDraft('')
    setError('')
    setIsBotTyping(false)
    setIsSubmitting(false)
    setIsValidating(false)
    setSubmittedLead(null)
  }

  const completionTime = flow?.meta?.estimatedTime || '5–7 min'
  const title = type ? flow.meta.title : 'Founder or Investor'
  const isBusy = isSubmitting || isBotTyping || isValidating

  return (
    <section className="chat-shell" aria-label="Venturizer AI qualification">
      <aside className="chat-sidebar" aria-label="Conversation progress">
        <div>
          <p className="eyebrow">AI Qualification</p>
          <h1>Venturizer</h1>
          <p>{completionTime} · {title}</p>
        </div>

        <div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={phase === 'success' ? 100 : progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress"
          >
            <div
              className="progress-track-fill"
              style={{ width: `${phase === 'success' ? 100 : progress}%` }}
            />
          </div>
        </div>

        <div className="q-counter">
          <strong>
            {phase === 'success'
              ? visibleQuestions.length
              : Math.min(step + 1, visibleQuestions.length || 1)}
          </strong>
          <span>{visibleQuestions.length ? `of ${visibleQuestions.length} questions` : 'questions pending'}</span>
        </div>

        <button className="secondary-btn" type="button" onClick={restart}>
          ↺ Restart
        </button>
      </aside>

      <div className="chat-window">
        <div
          className="message-list"
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isBotTyping ? (
            <div className="typing-row">
              <span className="avatar bot-avatar" aria-hidden="true">V</span>
              <TypingIndicator />
            </div>
          ) : null}
          {isValidating ? (
            <div className="submit-state" role="status">
              <span className="spinner" aria-hidden="true" />
              Checking your answer…
            </div>
          ) : null}
          {isSubmitting ? (
            <div className="submit-state" role="status">
              <span className="spinner" aria-hidden="true" />
              Reviewing your answers…
            </div>
          ) : null}
        </div>

        <div className="chat-bottom">
          {phase === 'type' ? (
            <ChoicePrompt choices={roleChoices} disabled={isBotTyping} onChoose={chooseType} />
          ) : null}

          {phase === 'questions' && currentQuestion?.type === 'choice' ? (
            <ChoicePrompt
              choices={currentQuestion.options}
              disabled={isBusy}
              onChoose={chooseAnswer}
            />
          ) : null}

          {phase === 'questions' && currentQuestion?.type !== 'choice' ? (
            <ChatComposer
              question={currentQuestion}
              value={draft}
              error={error}
              isValid={canSend}
              isSubmitting={isBusy}
              canGoBack={step > 0}
              onBack={goBack}
              onChange={(v) => { setDraft(v); setError('') }}
              onSubmit={() => submitAnswer()}
            />
          ) : null}

          {phase === 'success' ? (
            <div className="success-panel" role="status">
              <span className="success-mark" aria-hidden="true">✓</span>
              <div>
                <strong>Submission complete</strong>
                <p>Your conversation has been saved. The Venturizer team will follow up.</p>
              </div>
              <button className="primary-btn" type="button" onClick={restart}>
                Start another
              </button>
            </div>
          ) : null}

          {error && currentQuestion?.type === 'choice' ? (
            <p className="field-error" role="alert">{error}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Chatbot
