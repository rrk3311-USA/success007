import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { NodeType } from '../types'
import { cn } from '@/lib/utils'

const nodeStyles: Record<NodeType, string> = {
  start: 'border-emerald-500 bg-card',
  http: 'border-blue-500 bg-card',
  code: 'border-violet-500 bg-card',
  if: 'border-amber-500 bg-card',
  agent: 'border-rose-500 bg-card',
}

type WorkflowNodeData = { label?: string; type?: NodeType }

function WorkflowNode(props: NodeProps) {
  const { data = {}, type } = props
  const nodeType = (type as NodeType) || 'start'
  const label = (data as WorkflowNodeData).label ?? nodeType

  return (
    <div
      className={cn(
        'min-w-[120px] rounded-lg border-2 px-4 py-2.5 text-sm text-card-foreground',
        nodeStyles[nodeType] ?? 'border-border bg-card'
      )}
    >
      <Handle type="target" position={Position.Top} className="!-top-1" />
      <div className="mb-1 font-semibold">{label}</div>
      <div className="text-[11px] text-muted-foreground">{nodeType}</div>
      <Handle type="source" position={Position.Bottom} className="!-bottom-1" />
    </div>
  )
}

export default memo(WorkflowNode)
