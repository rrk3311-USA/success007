import type { Node, Edge } from '@xyflow/react'
import type { NodeType } from './types'

/**
 * Simple workflow runner: topological order from Start, then run each node
 * with previous output as $input. Logs to callback. No real HTTP/LLM yet.
 */
export function runWorkflow(
  nodes: Node[],
  edges: Edge[],
  log: (msg: string) => void
) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const outEdges = new Map<string, { target: string; sourceHandle?: string }[]>()
  const inEdges = new Map<string, string[]>()
  for (const e of edges) {
    if (!e.source || !e.target) continue
    if (!outEdges.has(e.source)) outEdges.set(e.source, [])
    outEdges.get(e.source)!.push({
      target: e.target,
      sourceHandle: e.sourceHandle ?? undefined,
    })
    if (!inEdges.has(e.target)) inEdges.set(e.target, [])
    inEdges.get(e.target)!.push(e.source)
  }

  const startNodes = nodes.filter((n) => n.type === 'start')
  if (startNodes.length === 0) {
    log('No Start node found.')
    return
  }

  // BFS from all start nodes to get execution order
  const order: string[] = []
  const seen = new Set<string>()
  const queue = startNodes.map((n) => n.id)
  for (const id of queue) seen.add(id)
  let i = 0
  while (i < queue.length) {
    const id = queue[i++]
    order.push(id)
    for (const { target } of outEdges.get(id) ?? []) {
      if (seen.has(target)) continue
      seen.add(target)
      queue.push(target)
    }
  }

  log(`Execution order: ${order.join(' → ')}`)

  const outputs = new Map<string, unknown>()
  outputs.set('__start', { input_as_text: 'Hello', timestamp: Date.now() })

  for (const nodeId of order) {
    const node = nodeMap.get(nodeId)
    if (!node) continue
    const type = node.type as NodeType
    const data = node.data ?? {}
    const inputs = (inEdges.get(nodeId) ?? [])
      .map((src) => outputs.get(src))
      .filter(Boolean)
    const input = inputs.length > 0 ? inputs[inputs.length - 1] : outputs.get('__start')

    try {
      if (type === 'start') {
        const out = { ...(input as object), input_as_text: (data as { inputAsText?: string }).inputAsText ?? 'user input' }
        outputs.set(nodeId, out)
        log(`[${nodeId}] Start → ${JSON.stringify(out).slice(0, 80)}...`)
      } else if (type === 'http') {
        const url = (data as { url?: string }).url || ''
        const method = (data as { method?: string }).method || 'GET'
        const body = (data as { body?: string }).body || '{}'
        const out = { status: 200, url, method, body: body.slice(0, 100), mocked: true }
        outputs.set(nodeId, out)
        log(`[${nodeId}] HTTP ${method} ${url} → (mocked)`)
      } else if (type === 'code') {
        const code = (data as { code?: string }).code || 'return $input;'
        const fn = new Function('$input', code)
        const out = fn(input)
        outputs.set(nodeId, out)
        log(`[${nodeId}] Code → ${JSON.stringify(out).slice(0, 80)}...`)
      } else if (type === 'if') {
        const expr = (data as { expression?: string }).expression || 'true'
        const fn = new Function('$input', `return !!(${expr});`)
        const result = fn(input)
        outputs.set(nodeId, { condition: result, $input: input })
        log(`[${nodeId}] If ${expr} → ${result}`)
      } else if (type === 'agent') {
        const instructions = (data as { instructions?: string }).instructions || ''
        const model = (data as { model?: string }).model || 'gpt-4o-mini'
        const out = { role: 'assistant', content: `[Mock LLM ${model}] ${instructions.slice(0, 50)}...`, mocked: true }
        outputs.set(nodeId, out)
        log(`[${nodeId}] Agent (${model}) → mocked reply`)
      } else {
        outputs.set(nodeId, input)
        log(`[${nodeId}] pass-through`)
      }
    } catch (err) {
      log(`[${nodeId}] Error: ${(err as Error).message}`)
      outputs.set(nodeId, { error: (err as Error).message })
    }
  }

  log('Run complete.')
}
