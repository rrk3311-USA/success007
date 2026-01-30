import WorkflowNode from './WorkflowNode'
import type { NodeType } from '../types'

export const nodeTypes: Record<NodeType, typeof WorkflowNode> = {
  start: WorkflowNode,
  http: WorkflowNode,
  code: WorkflowNode,
  if: WorkflowNode,
  agent: WorkflowNode,
}
