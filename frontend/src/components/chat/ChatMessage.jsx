import TypingIndicator from './TypingIndicator'

function ChatMessage({ message }) {
  const isBot = message.sender === 'bot'

  return (
    <article
      className={`message-row ${isBot ? 'bot-message' : 'user-message'}`}
      aria-label={isBot ? 'Assistant message' : 'Your message'}
    >
      {isBot ? (
        <span className="avatar bot-avatar" aria-hidden="true">V</span>
      ) : null}
      <div className="message-bubble">
        {message.isTyping ? <TypingIndicator /> : <p>{message.text}</p>}
      </div>
      {!isBot ? (
        <span className="avatar user-avatar" aria-hidden="true">U</span>
      ) : null}
    </article>
  )
}

export default ChatMessage
