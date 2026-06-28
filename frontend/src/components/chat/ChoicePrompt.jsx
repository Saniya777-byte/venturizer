function ChoicePrompt({ choices, onChoose, disabled }) {
  return (
    <div className="choice-strip" role="group" aria-label="Choose an option">
      {choices.map((choice) => (
        <button
          key={choice.value}
          className="choice-chip"
          type="button"
          disabled={disabled}
          onClick={() => onChoose(choice)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}

export default ChoicePrompt
