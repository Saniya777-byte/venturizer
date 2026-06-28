function StateBlock({ title, message, action }) {
  return (
    <div className="state-block" role="status">
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
      {action ? <div className="state-action">{action}</div> : null}
    </div>
  )
}

export default StateBlock
