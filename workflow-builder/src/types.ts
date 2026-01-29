export type NodeType = 'start' | 'http' | 'code' | 'if' | 'agent'

export interface StartData {
  label?: string
  inputAsText?: string
}

export interface HttpData {
  label?: string
  url?: string
  method?: string
  body?: string
}

export interface CodeData {
  label?: string
  code?: string
}

export interface IfData {
  label?: string
  expression?: string
}

export interface AgentData {
  label?: string
  instructions?: string
  model?: string
}

export type NodeData = StartData | HttpData | CodeData | IfData | AgentData

export const NODE_TYPES: { type: NodeType; label: string; color: string }[] = [
  { type: 'start', label: 'Start', color: '#3fb950' },
  { type: 'http', label: 'HTTP', color: '#58a6ff' },
  { type: 'code', label: 'Code', color: '#a371f7' },
  { type: 'if', label: 'If / Else', color: '#d29922' },
  { type: 'agent', label: 'Agent', color: '#ff7b72' },
]
