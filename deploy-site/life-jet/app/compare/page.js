'use client'

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Life OS Dashboard - Version Comparison</h1>
          <p className="text-lg text-slate-600">Compare different implementation approaches</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Minimal Version */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Minimal Version</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Fastest
              </span>
            </div>
            <p className="text-slate-600 mb-6">
              <strong>Craigslist-style</strong> - Plain HTML + Pico.css. Minimal code, maximum speed.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Tech Stack:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Plain HTML5</li>
                  <li>Pico.css (classless CSS framework)</li>
                  <li>Vanilla JavaScript</li>
                  <li>localStorage for persistence</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Code Stats:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>~200 lines of HTML</li>
                  <li>~150 lines of JavaScript</li>
                  <li>~100 lines of CSS (mostly Pico.css)</li>
                  <li><strong>Total: ~450 lines</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>✅ Domain filtering</li>
                  <li>✅ Status & Priority filters</li>
                  <li>✅ Search functionality</li>
                  <li>✅ Progress bars</li>
                  <li>✅ Weekly action checkboxes</li>
                  <li>✅ KPI calculations</li>
                  <li>✅ localStorage persistence</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How It&apos;s Built:</h3>
                <p className="text-slate-600 text-sm">
                  <strong>Database-first approach:</strong> Goals stored as JSON array with structured fields. 
                  Single HTML file loads data, filters in-memory, renders cards. Pico.css provides clean 
                  defaults. No build step, no dependencies (except CDN CSS). Perfect for learning the 
                  data model without framework complexity.
                </p>
              </div>
            </div>

            <a
              href="/minimal.html"
              target="_blank"
              className="block w-full text-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              View Minimal Version →
            </a>
          </div>

          {/* Modern Version */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Modern Version</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Feature-Rich
              </span>
            </div>
            <p className="text-slate-600 mb-6">
              <strong>React + Tailwind</strong> - Component-based, modern UI, expandable architecture.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Tech Stack:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Next.js 14 (React framework)</li>
                  <li>Tailwind CSS (utility-first styling)</li>
                  <li>React Hooks (useState, useEffect)</li>
                  <li>localStorage for persistence</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Code Stats:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>~300 lines of React/JSX</li>
                  <li>Zero custom CSS (all Tailwind)</li>
                  <li>Component-based architecture</li>
                  <li><strong>Total: ~300 lines</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>✅ All minimal features</li>
                  <li>✅ Expandable goal cards</li>
                  <li>✅ Smooth animations</li>
                  <li>✅ Responsive grid layout</li>
                  <li>✅ Modern gradient backgrounds</li>
                  <li>✅ Better visual hierarchy</li>
                  <li>✅ Ready for CRUD operations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How It&apos;s Built:</h3>
                <p className="text-slate-600 text-sm">
                  <strong>Component architecture:</strong> Single page component with React hooks. 
                  Same JSON data model, but React handles state management and re-renders. Tailwind 
                  provides utility classes for styling (no CSS files). Easy to extend with forms, 
                  modals, and more complex interactions. Perfect for learning React patterns.
                </p>
              </div>
            </div>

            <a
              href="/modern"
              className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Modern Version →
            </a>
          </div>

          {/* Vision Board Full Version */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Vision Board Full</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Visual
              </span>
            </div>
            <p className="text-slate-600 mb-6">
              <strong>Image-heavy vision board</strong> - Pinterest-style cards with photos, gradients, and visual inspiration.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Tech Stack:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Next.js 14 + React</li>
                  <li>styled-jsx (custom CSS)</li>
                  <li>Unsplash images</li>
                  <li>Same goals-data.json</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>✅ Large image cards</li>
                  <li>✅ Domain-based color themes</li>
                  <li>✅ Animated gradient background</li>
                  <li>✅ Visual progress indicators</li>
                  <li>✅ Expandable details</li>
                  <li>✅ Same CRUD functionality</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How It&apos;s Built:</h3>
                <p className="text-slate-600 text-sm">
                  <strong>Visual-first approach:</strong> Each goal gets a beautiful image card with domain-themed gradients. 
                  Same data model, but presented as an inspiration board. Perfect for visual learners who want to see their 
                  goals as aspirational images rather than database records.
                </p>
              </div>
            </div>

            <a
              href="/vision-board-full"
              className="block w-full text-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              View Vision Board →
            </a>
          </div>
        </div>

        {/* Architecture Comparison */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Architecture Comparison</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Minimal (HTML + JS)</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-slate-700">Data Flow:</strong>
                  <p className="text-slate-600 mt-1">
                    JSON → fetch() → filter → innerHTML render. Direct DOM manipulation.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-700">State Management:</strong>
                  <p className="text-slate-600 mt-1">
                    Global variables (goals, filteredGoals). Manual re-renders.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-700">Styling:</strong>
                  <p className="text-slate-600 mt-1">
                    Pico.css provides base styles. Minimal custom CSS for layout.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-700">Best For:</strong>
                  <p className="text-slate-600 mt-1">
                    Learning data structures, understanding DOM manipulation, fastest load times.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Modern (React + Tailwind)</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-slate-700">Data Flow:</strong>
                  <p className="text-slate-600 mt-1">
                    JSON → useState → filter → JSX render. Declarative updates.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-700">State Management:</strong>
                  <p className="text-slate-600 mt-1">
                    React hooks (useState, useEffect). Automatic re-renders on state change.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-700">Styling:</strong>
                  <p className="text-slate-600 mt-1">
                    Tailwind utility classes. No CSS files. Consistent design system.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-700">Best For:</strong>
                  <p className="text-slate-600 mt-1">
                    Learning React patterns, building scalable UIs, modern development workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Learnings */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Learnings</h2>
          <div className="space-y-3 text-slate-700">
            <p>
              <strong>1. Database-First Design:</strong> Both versions use the same JSON structure. 
              This forces you to think about data fields, filters, and relationships before styling.
            </p>
            <p>
              <strong>2. Code Differences:</strong> Minimal version shows raw DOM manipulation. 
              Modern version shows React&apos;s declarative approach. Same functionality, different patterns.
            </p>
            <p>
              <strong>3. Styling Approaches:</strong> Pico.css (minimal) vs Tailwind (modern) - 
              both eliminate custom CSS, but Tailwind gives more control.
            </p>
            <p>
              <strong>4. Performance:</strong> Minimal loads instantly. Modern has React overhead 
              but enables complex interactions. Choose based on needs.
            </p>
            <p>
              <strong>5. Extensibility:</strong> Minimal is harder to extend. Modern&apos;s component 
              structure makes adding features (forms, modals, animations) straightforward.
            </p>
          </div>
        </div>

        {/* Data Model */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Shared Data Model</h2>
          <p className="text-slate-600 mb-4">
            Both versions use the same JSON structure. This is the &quot;database&quot; that drives everything:
          </p>
          <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "id": "goal_001",
  "title": "Hit 12% conversion...",
  "domain": "Brand",
  "status": "In Progress",
  "priority": "High",
  "targetDate": "2026-06-30",
  "metricName": "Conversion Rate",
  "metricTarget": 12,
  "metricCurrent": 7.4,
  "tags": ["SuccessChemistry", "CRO"],
  "nextAction": "Ship new hero...",
  "notes": "Track by channel...",
  "lastUpdated": "2026-01-25",
  "completedThisWeek": false
}`}
          </pre>
          <p className="text-slate-600 mt-4 text-sm">
            This structure enables: filtering by domain/status/priority, progress calculations, 
            search across fields, and KPI calculations. The UI is just a view of this data.
          </p>
        </div>
      </div>
    </div>
  )
}
