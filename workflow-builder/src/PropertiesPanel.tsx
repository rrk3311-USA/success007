import { useState, useEffect } from 'react'
import type { Node } from '@xyflow/react'
import type { NodeType } from './types'

interface PropertiesPanelProps {
  node: Node | null
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void
}

export default function PropertiesPanel({ node, onUpdate }: PropertiesPanelProps) {
  const [label, setLabel] = useState('')
  const [extra, setExtra] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!node) {
      setLabel('')
      setExtra({})
      return
    }
    setLabel((node.data?.label as string) ?? node.type ?? '')
    const type = node.type as NodeType
    if (type === 'http') {
      setExtra({
        url: (node.data?.url as string) ?? '',
        method: (node.data?.method as string) ?? 'GET',
        body: (node.data?.body as string) ?? '',
      })
    } else if (type === 'code') {
      setExtra({ code: (node.data?.code as string) ?? 'return $input;' })
    } else if (type === 'if') {
      setExtra({ expression: (node.data?.expression as string) ?? 'true' })
    } else if (type === 'agent') {
      setExtra({
        instructions: (node.data?.instructions as string) ?? '',
        model: (node.data?.model as string) ?? 'gpt-4o-mini',
      })
    } else {
      setExtra({})
    }
  }, [node])

  if (!node) {
    return (
      <div
        style={{
          padding: 16,
          color: '#8b949e',
          fontSize: 13,
        }}
      >
        Select a node to edit its properties.
      </div>
    )
  }

  const apply = (updates: Record<string, unknown>) => {
    onUpdate(node.id, { label, ...extra, ...updates })
  }

  const type = node.type as NodeType

  return (
    <div style={{ padding: 12, overflow: 'auto' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Properties</div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
          Label
        </label>
        <input
          value={label}
          onChange={(e) => {
            setLabel(e.target.value)
            apply({ label: e.target.value })
          }}
          style={inputStyle}
        />
      </div>
      {type === 'http' && (
        <>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
              URL
            </label>
            <input
              value={extra.url ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setExtra((x) => ({ ...x, url: v }))
                apply({ url: v })
              }}
              style={inputStyle}
              placeholder="https://api.example.com"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
              Method
            </label>
            <select
              value={extra.method ?? 'GET'}
              onChange={(e) => {
                const v = e.target.value
                setExtra((x) => ({ ...x, method: v }))
                apply({ method: v })
              }}
              style={inputStyle}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
              Body (JSON)
            </label>
            <textarea
              value={extra.body ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setExtra((x) => ({ ...x, body: v }))
                apply({ body: v })
              }}
              style={{ ...inputStyle, minHeight: 60 }}
              placeholder="{}"
            />
          </div>
        </>
      )}
      {type === 'code' && (
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
            Code (return modified $input)
          </label>
          <textarea
            value={extra.code ?? 'return $input;'}
            onChange={(e) => {
              const v = e.target.value
              setExtra((x) => ({ ...x, code: v }))
              apply({ code: v })
            }}
            style={{ ...inputStyle, minHeight: 120, fontFamily: 'ui-monospace, monospace' }}
          />
        </div>
      )}
      {type === 'if' && (
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
            Expression (e.g. $input.value {'>'} 0)
          </label>
          <input
            value={extra.expression ?? 'true'}
            onChange={(e) => {
              const v = e.target.value
              setExtra((x) => ({ ...x, expression: v }))
              apply({ expression: v })
            }}
            style={inputStyle}
          />
        </div>
      )}
      {type === 'agent' && (
        <>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
              Instructions
            </label>
            <textarea
              value={extra.instructions ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setExtra((x) => ({ ...x, instructions: v }))
                apply({ instructions: v })
              }}
              style={{ ...inputStyle, minHeight: 80 }}
              placeholder="You are a helpful assistant..."
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
              Model
            </label>
            <input
              value={extra.model ?? 'gpt-4o-mini'}
              onChange={(e) => {
                const v = e.target.value
                setExtra((x) => ({ ...x, model: v }))
                apply({ model: v })
              }}
              style={inputStyle}
            />
          </div>
        </>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 8,
  background: '#0d1117',
  border: '1px solid #30363d',
  borderRadius: 6,
  color: '#e6edf3',
  fontSize: 13,
}
