import { useEffect, useRef } from 'react'

function ChatComposer({
  question,
  value,
  error,
  isValid,
  isSubmitting,
  canGoBack,
  onBack,
  onChange,
  onSubmit,
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [question?.id])

  if (!question) return null

  const handleKeyDown = (event) => {
    const isTextarea = question.type === 'textarea'

    if (event.key === 'Enter' && !event.shiftKey && !isTextarea) {
      event.preventDefault()
      if (isValid && !isSubmitting) onSubmit()
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      if (isValid && !isSubmitting) onSubmit()
    }
  }

  return (
    <form
      className="composer"
      onSubmit={(e) => { e.preventDefault(); onSubmit() }}
      noValidate
    >
      <div className="composer-control">
        {question.type === 'textarea' ? (
          <textarea
            ref={inputRef}
            aria-label={question.prompt}
            aria-invalid={Boolean(error)}
            rows={3}
            placeholder={question.placeholder || 'Type your answer…'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <input
            ref={inputRef}
            aria-label={question.prompt}
            aria-invalid={Boolean(error)}
            type={question.type === 'number' ? 'number' : question.type === 'email' ? 'email' : question.type === 'url' ? 'url' : question.type === 'tel' ? 'tel' : 'text'}
            inputMode={question.type === 'number' ? 'numeric' : undefined}
            placeholder={question.placeholder || 'Type your answer…'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        <button
          className="send-btn"
          type="submit"
          disabled={!isValid || isSubmitting}
          aria-label="Send answer"
        >
          {isSubmitting ? <span className="spinner" aria-hidden="true" /> : '→'}
        </button>
      </div>
      <div className="composer-meta">
        <button
          className="text-btn"
          type="button"
          disabled={!canGoBack || isSubmitting}
          onClick={onBack}
          aria-label="Go back to previous question"
        >
          ← Back
        </button>
        <span aria-live="polite">
          {question.type === 'textarea' ? 'Ctrl+Enter to send' : 'Enter to send'}
        </span>
      </div>
      {error ? (
        <p className="field-error" role="alert" aria-live="assertive">{error}</p>
      ) : null}
    </form>
  )
}

export default ChatComposer
