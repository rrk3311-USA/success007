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
import { runWorkflow } from './runner'

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
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <Sidebar onAddNode={onAddNode} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Toolbar onSave={onSave} onLoad={onLoad} onRun={onRun} />
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1 }}>
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
              style={{ background: '#0d1117' }}
            >
              <Background color="#21262d" gap={16} />
              <Controls />
              <Panel position="top-right" style={{ margin: 8, fontSize: 12, color: '#8b949e' }}>
                Click a node type in the left panel to add it. Connect nodes by dragging from one
                handle to another.
              </Panel>
            </ReactFlow>
          </div>
          <div
            style={{
              width: 320,
              borderLeft: '1px solid #30363d',
              display: 'flex',
              flexDirection: 'column',
              background: '#161b22',
            }}
          >
            <PropertiesPanel
              node={selectedNode}
              onUpdate={onUpdateNodeData}
            />
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: 8,
                fontSize: 12,
                fontFamily: 'ui-monospace, monospace',
                borderTop: '1px solid #30363d',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Run log</div>
              {runLog.length === 0 ? (
                <div style={{ color: '#8b949e' }}>Run a workflow to see output.</div>
              ) : (
                runLog.map((line, i) => (
                  <div key={i} style={{ marginBottom: 2 }}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
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
