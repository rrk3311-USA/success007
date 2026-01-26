'use client'

import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">Life Jet</h1>
      <p className="text-slate-400 mb-12 text-center">Choose one</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        <Link
          href="/minimal.html"
          className="flex-1 block px-8 py-6 rounded-xl bg-slate-800 border-2 border-slate-600 hover:border-blue-500 hover:bg-slate-700 text-white font-semibold text-center transition-colors"
        >
          <span className="block text-2xl mb-2">⚡</span>
          Minimal
        </Link>
        <Link
          href="/home"
          className="flex-1 block px-8 py-6 rounded-xl bg-slate-800 border-2 border-slate-600 hover:border-amber-500 hover:bg-slate-700 text-white font-semibold text-center transition-colors"
        >
          <span className="block text-2xl mb-2">🏠</span>
          Main Home
        </Link>
        <Link
          href="/vision-board"
          className="flex-1 block px-8 py-6 rounded-xl bg-slate-800 border-2 border-slate-600 hover:border-cyan-400 hover:bg-slate-700 text-white font-semibold text-center transition-colors"
        >
          <span className="block text-2xl mb-2">👁</span>
          Vision Board
        </Link>
        <Link
          href="/extreme"
          className="flex-1 block px-8 py-6 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 hover:border-purple-400 text-white font-semibold text-center transition-all hover:scale-105 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
        >
          <span className="block text-2xl mb-2">🚀</span>
          Extreme
          <div className="text-xs text-purple-300 mt-1">Shaders • Particles • 3D</div>
        </Link>
      </div>
    </div>
  )
}
