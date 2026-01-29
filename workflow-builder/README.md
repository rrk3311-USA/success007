# Workflow Builder UI

Visual canvas to build agent/workflow graphs (Agent Builder / n8n style). Add nodes, connect them, configure in the right panel, save/load to localStorage, and run (mock execution).

## Run locally

```bash
cd workflow-builder
npm install
npm run dev
```

Open **http://localhost:5174** in your browser.

## Usage

1. **Add nodes** – Click a node type in the left sidebar (Start, HTTP, Code, If/Else, Agent).
2. **Connect** – Drag from the bottom handle of one node to the top handle of another.
3. **Edit** – Select a node and change its properties in the right panel (label, URL, code, expression, instructions, etc.).
4. **Save / Load** – Toolbar saves the current graph to localStorage and loads it back.
5. **Run** – Executes the workflow from Start nodes in order and prints a log in the right panel (HTTP and Agent are mocked; Code and If use your config).

## Node types

| Type   | Role                    | Config                          |
|--------|-------------------------|---------------------------------|
| Start  | Entry point             | Label, input text               |
| HTTP   | Request (mocked)        | URL, method, body               |
| Code   | JS snippet              | Code with `$input`             |
| If/Else| Branch on expression    | Expression, e.g. `$input.value > 0` |
| Agent  | LLM step (mocked)       | Instructions, model             |

Build and run logic can be extended later (real HTTP, OpenAI, versioning, deploy).
