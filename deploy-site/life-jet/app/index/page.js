'use client'

import Link from 'next/link'

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Life OS Dashboard</h1>
          <p className="text-xl text-slate-600">Choose a version to explore</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/minimal.html" className="block">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Minimal</h2>
              <p className="text-slate-600 mb-4">Craigslist-style. Fastest, simplest code.</p>
              <div className="text-sm text-slate-500">HTML + Pico.css + Vanilla JS</div>
            </div>
          </Link>

          <Link href="/modern" className="block">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Modern</h2>
              <p className="text-slate-600 mb-4">Feature-rich. React + Tailwind.</p>
              <div className="text-sm text-slate-500">Next.js + React + Tailwind</div>
            </div>
          </Link>

          <Link href="/vision-board-full" className="block">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Vision Board</h2>
              <p className="text-slate-600 mb-4">Image-heavy, visual inspiration style.</p>
              <div className="text-sm text-slate-500">React + styled-jsx + Images</div>
            </div>
          </Link>

          <Link href="/compare" className="block">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Compare</h2>
              <p className="text-slate-600 mb-4">See code differences & learnings.</p>
              <div className="text-sm text-slate-500">Architecture comparison</div>
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-2">📚 Learning Focus:</h3>
          <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
            <li>Same data model (JSON) drives both versions</li>
            <li>Compare DOM manipulation vs React patterns</li>
            <li>See how styling approaches differ</li>
            <li>Understand when to use each approach</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
