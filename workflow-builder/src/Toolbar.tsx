interface ToolbarProps {
  onSave: () => void
  onLoad: () => void
  onRun: () => void
}

export default function Toolbar({ onSave, onLoad, onRun }: ToolbarProps) {
  return (
    <div
      style={{
        padding: '8px 12px',
        borderBottom: '1px solid #30363d',
        background: '#161b22',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        onClick={onSave}
        style={btnStyle}
      >
        Save
      </button>
      <button
        type="button"
        onClick={onLoad}
        style={btnStyle}
      >
        Load
      </button>
      <button
        type="button"
        onClick={onRun}
        style={{ ...btnStyle, background: '#238636', borderColor: '#238636' }}
      >
        Run
      </button>
      <span style={{ marginLeft: 8, fontSize: 12, color: '#8b949e' }}>
        Workflow Builder
      </span>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '6px 12px',
  background: '#21262d',
  border: '1px solid #30363d',
  borderRadius: 6,
  color: '#e6edf3',
  cursor: 'pointer',
  fontSize: 13,
}
