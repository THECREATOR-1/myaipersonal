import { useEffect, useRef } from 'react'

type HyperspeedProps = { isAIResponding: boolean }
type Streak = { angle: number; radius: number; length: number; width: number; opacity: number }

/** Decorative canvas. Its only speed input is the shared AI response state. */
export default function Hyperspeed({ isAIResponding }: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetSpeed = useRef(0.32)
  useEffect(() => { targetSpeed.current = isAIResponding ? 2.25 : 0.32 }, [isAIResponding])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frame = 0
    let width = 0
    let height = 0
    let speed = 0.32
    const streaks: Streak[] = []
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      streaks.length = 0
      const count = Math.min(130, Math.floor(width * height / 9500))
      for (let i = 0; i < count; i++) streaks.push({ angle: Math.random() * Math.PI * 2, radius: Math.random() * Math.max(width, height) * 0.72, length: 12 + Math.random() * 36, width: 0.4 + Math.random() * 1, opacity: 0.12 + Math.random() * 0.4 })
    }
    const draw = () => {
      frame = requestAnimationFrame(draw)
      speed += (targetSpeed.current - speed) * 0.025
      context.clearRect(0, 0, width, height)
      const cx = width * 0.5
      const cy = height * 0.49
      for (const line of streaks) {
        const prior = line.radius
        line.radius += (1.15 + line.radius / 220) * speed
        if (line.radius > Math.max(width, height) * 0.85) line.radius = Math.random() * 30
        const x1 = cx + Math.cos(line.angle) * prior
        const y1 = cy + Math.sin(line.angle) * prior
        const x2 = cx + Math.cos(line.angle) * line.radius
        const y2 = cy + Math.sin(line.angle) * line.radius
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.strokeStyle = `rgba(205, ${line.opacity > 0.38 ? 205 : 130}, ${line.opacity > 0.38 ? 205 : 130}, ${line.opacity * Math.min(1, line.radius / 90)})`
        context.lineWidth = line.width
        context.stroke()
      }
    }
    resize()
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="hyperspeed" aria-hidden="true" />
}
