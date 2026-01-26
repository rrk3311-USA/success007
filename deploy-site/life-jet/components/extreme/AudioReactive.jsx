'use client'

import { useEffect, useRef, useState } from 'react'

export default function AudioReactive() {
  const canvasRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSource, setAudioSource] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize Web Audio API
    const initAudio = async () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 256

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        analyserRef.current = analyser
        dataArrayRef.current = dataArray

        // Create oscillator for demo (in real app, use microphone or audio file)
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(analyser)
        analyser.connect(audioContext.destination)

        oscillator.frequency.value = 440
        gainNode.gain.value = 0.1

        oscillator.start()
        setAudioSource({ oscillator, gainNode })
        audioContextRef.current = audioContext
        setIsPlaying(true)
      } catch (error) {
        console.warn('Audio not available:', error)
      }
    }

    initAudio()

    // Animation loop
    const animate = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current)

        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

        const barWidth = (canvas.width / dpr) / dataArrayRef.current.length * 2
        let x = 0

        // Draw frequency bars
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const barHeight = (dataArrayRef.current[i] / 255) * (canvas.height / dpr) * 0.8

          const gradient = ctx.createLinearGradient(0, canvas.height / dpr, 0, canvas.height / dpr - barHeight)
          gradient.addColorStop(0, `hsl(${i * 2}, 70%, 50%)`)
          gradient.addColorStop(1, `hsl(${i * 2 + 60}, 70%, 70%)`)

          ctx.fillStyle = gradient
          ctx.fillRect(x, canvas.height / dpr - barHeight, barWidth - 1, barHeight)

          x += barWidth
        }

        // Draw circular visualization
        const centerX = canvas.width / dpr / 2
        const centerY = canvas.height / dpr / 2
        const radius = Math.min(centerX, centerY) * 0.6

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsl(${dataArrayRef.current[10] * 2}, 70%, 60%)`
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw reactive particles
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2
          const freqIndex = Math.floor((i / 20) * dataArrayRef.current.length)
          const amplitude = dataArrayRef.current[freqIndex] / 255

          const x = centerX + Math.cos(angle) * radius * (1 + amplitude * 0.5)
          const y = centerY + Math.sin(angle) * radius * (1 + amplitude * 0.5)

          ctx.beginPath()
          ctx.arc(x, y, 5 + amplitude * 10, 0, Math.PI * 2)
          ctx.fillStyle = `hsl(${freqIndex * 2}, 70%, 60%)`
          ctx.fill()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioSource?.oscillator) {
        audioSource.oscillator.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl">
          <div className="text-center">
            <p className="text-white mb-4">Audio visualization</p>
            <p className="text-gray-400 text-sm">Using Web Audio API for real-time frequency analysis</p>
          </div>
        </div>
      )}
    </div>
  )
}
