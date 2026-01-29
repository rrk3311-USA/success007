import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { NodeType } from '../types'

const colors: Record<NodeType, string> = {
  start: '#3fb950',
  http: '#58a6ff',
  code: '#a371f7',
  if: '#d29922',
  agent: '#ff7b72',
}

type WorkflowNodeData = { label?: string; type?: NodeType }

function WorkflowNode(props: NodeProps) {
  const { data = {}, type } = props
  const nodeType = (type as NodeType) || 'start'
  const color = colors[nodeType] ?? '#8b949e'
  const label = (data as WorkflowNodeData).label ?? nodeType

  return (
    <div
      style={{
        padding: '10px 16px',
        minWidth: 120,
        background: '#161b22',
        border: `2px solid ${color}`,
        borderRadius: 8,
        color: '#e6edf3',
        fontSize: 13,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ top: -5 }} />
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#8b949e' }}>{nodeType}</div>
      <Handle type="source" position={Position.Bottom} style={{ bottom: -5 }} />
    </div>
  )
}

export default memo(WorkflowNode)
