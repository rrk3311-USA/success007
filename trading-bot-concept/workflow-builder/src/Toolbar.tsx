import { Button } from '@/components/ui/button'

interface ToolbarProps {
  onSave: () => void
  onLoad: () => void
  onRun: () => void
}

export default function Toolbar({ onSave, onLoad, onRun }: ToolbarProps) {
  return (
    <header className="flex items-center gap-2 border-b border-border bg-card px-3 py-2">
      <Button type="button" variant="outline" size="sm" onClick={onSave}>
        Save
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onLoad}>
        Load
      </Button>
      <Button type="button" size="sm" onClick={onRun}>
        Run
      </Button>
      <span className="ml-2 text-sm text-muted-foreground">
        Workflow Builder
      </span>
    </header>
  )
}
