import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  ReactFlowProvider,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { nodeTypes } from './nodes'
import { NODE_TYPES, type NodeType } from './types'
import Sidebar from './Sidebar'
import PropertiesPanel from './PropertiesPanel'
import Toolbar from './Toolbar'
import DocsAndTasks from './DocsAndTasks'
import { runWorkflow } from './runner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 200, y: 80 },
    data: { label: 'Start' },
  },
]
const initialEdges: Edge[] = []

function FlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [runLog, setRunLog] = useState<string[]>([])
  const [nextOffset, setNextOffset] = useState({ x: 0, y: 80 })

  const onConnect = useCallback(
    (conn: Connection) => setEdges((e) => addEdge(conn, e)),
    [setEdges]
  )

  const onAddNode = useCallback(
    (type: NodeType) => {
      const id = `${type}-${Date.now()}`
      const label = NODE_TYPES.find((n) => n.type === type)?.label ?? type
      setNodes((nds) => [
        ...nds,
        {
          id,
          type,
          position: { x: nextOffset.x + 20, y: nextOffset.y },
          data: { label },
        },
      ])
      setNextOffset((prev) => ({ x: prev.x, y: prev.y + 100 }))
    },
    [setNodes, nextOffset]
  )

  const onNodeClick = useCallback((_e: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => setSelectedNode(null), [])

  const onUpdateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n))
      )
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...data } } : null))
      }
    },
    [setNodes, selectedNode]
  )

  const onSave = useCallback(() => {
    const workflow = { nodes, edges }
    localStorage.setItem('workflow-builder', JSON.stringify(workflow))
    setRunLog((log) => [...log, `Saved: ${nodes.length} nodes, ${edges.length} edges`])
  }, [nodes, edges])

  const onLoad = useCallback(() => {
    try {
      const raw = localStorage.getItem('workflow-builder')
      if (!raw) {
        setRunLog((log) => [...log, 'No saved workflow found'])
        return
      }
      const { nodes: n, edges: e } = JSON.parse(raw)
      setNodes(n)
      setEdges(e)
      setSelectedNode(null)
      setRunLog((log) => [...log, 'Loaded workflow'])
    } catch (err) {
      setRunLog((log) => [...log, `Load error: ${(err as Error).message}`])
    }
  }, [setNodes, setEdges])

  const onRun = useCallback(() => {
    setRunLog([])
    runWorkflow(nodes, edges, (msg) => setRunLog((log) => [...log, msg]))
  }, [nodes, edges])

  return (
    <div className="flex h-full min-h-0 flex-1">
      <Sidebar onAddNode={onAddNode} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Toolbar onSave={onSave} onLoad={onLoad} onRun={onRun} />
        <div className="flex min-h-0 flex-1">
          <div className="min-h-0 flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes as NodeTypes}
              fitView
              className="bg-background"
            >
              <Background color="var(--border)" gap={16} />
              <Controls />
              <Panel
                position="top-right"
                className="m-2 text-xs text-muted-foreground"
              >
                Click a node type in the left panel to add it. Connect nodes by
                dragging from one handle to another.
              </Panel>
            </ReactFlow>
          </div>
          <aside className="flex w-[320px] shrink-0 flex-col border-l border-border bg-card">
            <PropertiesPanel node={selectedNode} onUpdate={onUpdateNodeData} />
            <ScrollArea className="flex-1 border-t border-border p-2">
              <Card className="border-0 shadow-none">
                <CardHeader className="p-2 pb-0">
                  <h3 className="text-xs font-semibold">Run log</h3>
                </CardHeader>
                <CardContent className="p-2 font-mono text-xs">
                  {runLog.length === 0 ? (
                    <p className="text-muted-foreground">
                      Run a workflow to see output.
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {runLog.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
            <DocsAndTasks />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  )
}
