import type { NodeType } from './types'
import { NODE_TYPES } from './types'

interface SidebarProps {
  onAddNode: (type: NodeType) => void
}

export default function Sidebar({ onAddNode }: SidebarProps) {
  return (
    <div
      style={{
        width: 200,
        borderRight: '1px solid #30363d',
        background: '#161b22',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Add node</div>
      {NODE_TYPES.map(({ type, label, color }) => (
        <button
          key={type}
          type="button"
          onClick={() => onAddNode(type)}
          style={{
            padding: '10px 12px',
            background: '#21262d',
            border: `1px solid ${color}`,
            borderRadius: 6,
            color: '#e6edf3',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: 13,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
