import { useState, useEffect } from 'react'
import type { Node } from '@xyflow/react'
import type { NodeType } from './types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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
      <div className="p-4 text-sm text-muted-foreground">
        Select a node to edit its properties.
      </div>
    )
  }

  const apply = (updates: Record<string, unknown>) => {
    onUpdate(node.id, { label, ...extra, ...updates })
  }

  const type = node.type as NodeType

  return (
    <ScrollArea className="flex-1">
      <Card className="border-0 shadow-none">
        <CardHeader className="p-3 pb-0">
          <h3 className="text-sm font-semibold">Properties</h3>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-2">
          <div className="space-y-2">
            <Label htmlFor="prop-label">Label</Label>
            <Input
              id="prop-label"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value)
                apply({ label: e.target.value })
              }}
            />
          </div>
          {type === 'http' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="prop-url">URL</Label>
                <Input
                  id="prop-url"
                  value={extra.url ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setExtra((x) => ({ ...x, url: v }))
                    apply({ url: v })
                  }}
                  placeholder="https://api.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prop-method">Method</Label>
                <select
                  id="prop-method"
                  value={extra.method ?? 'GET'}
                  onChange={(e) => {
                    const v = e.target.value
                    setExtra((x) => ({ ...x, method: v }))
                    apply({ method: v })
                  }}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prop-body">Body (JSON)</Label>
                <Textarea
                  id="prop-body"
                  value={extra.body ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setExtra((x) => ({ ...x, body: v }))
                    apply({ body: v })
                  }}
                  className="min-h-[60px]"
                  placeholder="{}"
                />
              </div>
            </>
          )}
          {type === 'code' && (
            <div className="space-y-2">
              <Label htmlFor="prop-code">Code (return modified $input)</Label>
              <Textarea
                id="prop-code"
                value={extra.code ?? 'return $input;'}
                onChange={(e) => {
                  const v = e.target.value
                  setExtra((x) => ({ ...x, code: v }))
                  apply({ code: v })
                }}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          )}
          {type === 'if' && (
            <div className="space-y-2">
              <Label htmlFor="prop-expr">
                Expression (e.g. $input.value &gt; 0)
              </Label>
              <Input
                id="prop-expr"
                value={extra.expression ?? 'true'}
                onChange={(e) => {
                  const v = e.target.value
                  setExtra((x) => ({ ...x, expression: v }))
                  apply({ expression: v })
                }}
              />
            </div>
          )}
          {type === 'agent' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="prop-instructions">Instructions</Label>
                <Textarea
                  id="prop-instructions"
                  value={extra.instructions ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setExtra((x) => ({ ...x, instructions: v }))
                    apply({ instructions: v })
                  }}
                  className="min-h-[80px]"
                  placeholder="You are a helpful assistant..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prop-model">Model</Label>
                <Input
                  id="prop-model"
                  value={extra.model ?? 'gpt-4o-mini'}
                  onChange={(e) => {
                    const v = e.target.value
                    setExtra((x) => ({ ...x, model: v }))
                    apply({ model: v })
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </ScrollArea>
  )
}
