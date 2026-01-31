'use client'

// ⚠️ DISABLED - This page has been moved to non-deploy-experiments folder
// To re-enable, restore from: /non-deploy-experiments/extreme-app/page.js

export default function ExtremeShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[900px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">⚠️ Page Disabled</h1>
        <p className="text-gray-400 mb-2">This experimental page has been moved to:</p>
        <code className="text-cyan-400 text-sm">/non-deploy-experiments/extreme-app/</code>
        <p className="text-gray-500 text-xs mt-4">This prevents it from being deployed to production.</p>
      </div>
    </div>
  )
}
