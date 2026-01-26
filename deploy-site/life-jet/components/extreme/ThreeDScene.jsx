'use client'

import { useEffect, useRef } from 'react'

export default function ThreeDScene() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    // Check if Three.js is available (we'll load it dynamically)
    if (typeof window === 'undefined') return

    const loadThree = async () => {
      try {
        // Try to use Three.js if available
        // For now, we'll create a CSS 3D fallback
        if (!window.THREE) {
          // Fallback to CSS 3D transforms
          createCSS3DScene()
          return
        }

        const THREE = window.THREE

        // Create scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0a1628)

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.offsetWidth / containerRef.current.offsetHeight,
          0.1,
          1000
        )
        camera.position.z = 5

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight)
        containerRef.current.appendChild(renderer.domElement)

        // Create geometry
        const geometry = new THREE.BoxGeometry(2, 2, 2)
        const material = new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          metalness: 0.7,
          roughness: 0.3,
        })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)
        const pointLight = new THREE.PointLight(0x8b5cf6, 1)
        pointLight.position.set(5, 5, 5)
        scene.add(pointLight)

        sceneRef.current = scene
        cameraRef.current = camera
        rendererRef.current = renderer
        meshRef.current = cube

        // Animation loop
        const animate = () => {
          if (cube) {
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
          }
          renderer.render(scene, camera)
          animationFrameRef.current = requestAnimationFrame(animate)
        }
        animate()

        // Handle resize
        const handleResize = () => {
          camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          if (renderer) {
            renderer.dispose()
          }
        }
      } catch (error) {
        console.warn('Three.js not available, using CSS 3D fallback:', error)
        createCSS3DScene()
      }
    }

    const createCSS3DScene = () => {
      // CSS 3D fallback
      const scene = document.createElement('div')
      scene.className = 'absolute inset-0 flex items-center justify-center'
      scene.style.perspective = '1000px'
      scene.style.perspectiveOrigin = '50% 50%'

      const cube = document.createElement('div')
      cube.className = 'relative w-32 h-32'
      cube.style.transformStyle = 'preserve-3d'
      cube.style.animation = 'rotate3d 10s infinite linear'

      const faces = [
        { transform: 'rotateY(0deg) translateZ(64px)', bg: 'from-purple-500 to-pink-500' },
        { transform: 'rotateY(90deg) translateZ(64px)', bg: 'from-cyan-500 to-blue-500' },
        { transform: 'rotateY(180deg) translateZ(64px)', bg: 'from-emerald-500 to-teal-500' },
        { transform: 'rotateY(-90deg) translateZ(64px)', bg: 'from-amber-500 to-orange-500' },
        { transform: 'rotateX(90deg) translateZ(64px)', bg: 'from-rose-500 to-red-500' },
        { transform: 'rotateX(-90deg) translateZ(64px)', bg: 'from-indigo-500 to-purple-500' },
      ]

      faces.forEach((face) => {
        const faceEl = document.createElement('div')
        faceEl.className = `absolute inset-0 bg-gradient-to-br ${face.bg} rounded-lg border border-white/20 backdrop-blur-sm`
        faceEl.style.transform = face.transform
        faceEl.style.backfaceVisibility = 'hidden'
        cube.appendChild(faceEl)
      })

      scene.appendChild(cube)
      if (containerRef.current) {
        containerRef.current.appendChild(scene)
      }

      // Add keyframes
      const style = document.createElement('style')
      style.textContent = `
        @keyframes rotate3d {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `
      document.head.appendChild(style)

      return () => {
        if (style.parentNode) {
          style.parentNode.removeChild(style)
        }
      }
    }

    loadThree()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    />
  )
}
