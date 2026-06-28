function TypingIndicator() {
  return (
    <div className="typing-bubble" aria-label="Assistant is typing" role="status">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  )
}

export default TypingIndicator
