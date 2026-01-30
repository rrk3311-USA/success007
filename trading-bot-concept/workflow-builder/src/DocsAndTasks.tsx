import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, ChevronRight } from 'lucide-react'

const taskList = [
  'Add a Start node (already on canvas)',
  'Click HTTP, Code, If/Else, or Agent in the left panel to add nodes',
  'Connect nodes: drag from bottom handle of one to top handle of another',
  'Select a node and edit its properties in the right panel',
  'Save your workflow (toolbar) to store in browser',
  'Load to restore. Run to execute the flow and see the log',
]

const tradingBotSteps = [
  'Install libs: pip install ccxt pycoingecko pandas apscheduler python-dotenv',
  'Get API keys: Bybit (API Management) for trading; CoinGecko is free. Use testnet first.',
  'Code structure: Set up CCXT/Bybit (defaultType: future), fetch top hourly gainers via CoinGecko.',
  'Indicators: Compute MACD (12/26/9) and RSI (14) with pandas on OHLCV from exchange.',
  'Entry: Bullish MACD crossover + RSI < 70 + symbol in top gainers (>5% 1h). One position at a time.',
  'Exit: Stop-loss -2%, or RSI > 70, or bearish MACD. Scan every 5 min with APScheduler.',
  'Optional: Train ML (e.g. scikit-learn) on historical data for better signals.',
  'Deploy: Run on VPS with screen/tmux or systemd; add logging and strict stops.',
  'Test: Use Bybit testnet (BYBIT_TESTNET=true); backtest with historical data before live.',
]

export default function DocsAndTasks() {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-border bg-muted/30">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-between px-3 py-2.5 text-left text-sm font-semibold"
        >
          Objective, task list & docs
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea className="max-h-[420px]">
          <div className="space-y-4 px-3 pb-3 pt-0 text-xs">
            <section>
              <h4 className="mb-1.5 font-semibold text-blue-400">Objective</h4>
              <p className="leading-relaxed text-muted-foreground">
                Build agent/workflow graphs visually: add nodes, connect them,
                configure inputs (URL, code, conditions, LLM instructions), then
                save, load, and run. Use this to design automations or agent
                flows (e.g. the crypto momentum trading bot) before deploying
                with n8n or Agent Builder.
              </p>
            </section>

            <section>
              <h4 className="mb-1.5 font-semibold text-amber-400">
                Steps to build the crypto momentum trading bot
              </h4>
              <p className="mb-2 leading-relaxed text-muted-foreground">
                Use these steps to implement the bot (see{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  trading-bot-concept/crypto-momentum-bot/
                </code>
                ).
              </p>
              <ol className="list-inside list-decimal space-y-0.5 text-foreground leading-relaxed">
                {tradingBotSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>

            <section>
              <h4 className="mb-1.5 font-semibold text-emerald-400">
                Task list (this builder)
              </h4>
              <ul className="list-inside list-disc space-y-0.5 text-foreground leading-relaxed">
                {taskList.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="mb-1.5 font-semibold text-violet-400">Node docs</h4>
              <dl className="space-y-1 text-muted-foreground leading-snug">
                <dt className="mt-1.5 font-medium text-foreground">Start</dt>
                <dd>Entry point. Exposes input to the next node.</dd>

                <dt className="mt-1.5 font-medium text-foreground">HTTP</dt>
                <dd>URL, method (GET/POST/…), body. Run uses a mock response.</dd>

                <dt className="mt-1.5 font-medium text-foreground">Code</dt>
                <dd>
                  JavaScript. Use <code className="rounded bg-muted px-1 font-mono">$input</code> for
                  previous output. Return the value for the next node.
                </dd>

                <dt className="mt-1.5 font-medium text-foreground">If/Else</dt>
                <dd>
                  Expression using <code className="rounded bg-muted px-1 font-mono">$input</code> (e.g.{' '}
                  <code className="rounded bg-muted px-1 font-mono">$input.value &gt; 0</code>).
                  Controls branching (future).
                </dd>

                <dt className="mt-1.5 font-medium text-foreground">Agent</dt>
                <dd>Instructions and model. Run uses a mocked LLM reply.</dd>

                <dt className="mt-1.5 font-medium text-foreground">Save / Load</dt>
                <dd>
                  Stored in this browser (localStorage). Load restores the last
                  saved graph.
                </dd>

                <dt className="mt-1.5 font-medium text-foreground">Run</dt>
                <dd>
                  Executes from Start in order. Output appears in the Run log
                  above.
                </dd>
              </dl>
            </section>
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}
