import type { NodeType } from './types'
import { NODE_TYPES } from './types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onAddNode: (type: NodeType) => void
}

const NODE_COLORS: Record<string, string> = {
  start: 'border-emerald-500/70 hover:bg-emerald-500/10',
  http: 'border-blue-500/70 hover:bg-blue-500/10',
  code: 'border-violet-500/70 hover:bg-violet-500/10',
  if: 'border-amber-500/70 hover:bg-amber-500/10',
  agent: 'border-rose-500/70 hover:bg-rose-500/10',
}

export default function Sidebar({ onAddNode }: SidebarProps) {
  return (
    <aside className="flex w-[200px] shrink-0 flex-col gap-1.5 border-r border-border bg-card p-3">
      <h2 className="mb-1 text-sm font-semibold text-foreground">Add node</h2>
      {NODE_TYPES.map(({ type, label }) => (
        <Button
          key={type}
          type="button"
          variant="outline"
          className={cn(
            'h-auto justify-start py-2.5 text-left text-sm font-normal',
            NODE_COLORS[type] ?? 'border-border hover:bg-accent'
          )}
          onClick={() => onAddNode(type)}
        >
          {label}
        </Button>
      ))}
    </aside>
  )
}
