import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import './GoldDust.css'

type GoldDustVariant = 'hero' | 'ambient'

type GoldDustProps = {
  variant?: GoldDustVariant
}

type ParticleSpec = {
  left: number
  top: number
  size: number
  duration: number
  delay: number
  sway: number
  opacity: number
}

type SpeckSpec = ParticleSpec & {
  dx: number
  dy: number
}

type ShapeSpec = Omit<ParticleSpec, 'sway'> & {
  driftX: number
  driftY: number
}

type GlowSpec = {
  left: number
  top: number
  size: string
  moveX: number
  moveY: number
  duration: number
  delay: number
  opacity: number
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function buildParticles(count: number): ParticleSpec[] {
  return Array.from({ length: count }, () => ({
    left: rand(2, 98),
    top: rand(12, 92),
    size: rand(2, 5),
    duration: rand(9, 18),
    delay: -rand(0, 18),
    sway: rand(-34, 34),
    opacity: rand(0.35, 0.8),
  }))
}

function buildSpecks(count: number): SpeckSpec[] {
  return Array.from({ length: count }, () => ({
    left: rand(2, 98),
    top: rand(10, 94),
    size: rand(1.5, 3),
    duration: rand(7, 15),
    delay: -rand(0, 15),
    sway: 0,
    opacity: rand(0.5, 0.95),
    dx: rand(-70, 70),
    dy: rand(-70, 70),
  }))
}

function buildShapes(count: number): ShapeSpec[] {
  return Array.from({ length: count }, () => ({
    left: rand(3, 95),
    top: rand(15, 88),
    size: rand(9, 24),
    duration: rand(12, 22),
    delay: -rand(0, 20),
    sway: 0,
    opacity: rand(0.25, 0.5),
    driftX: rand(-44, 44),
    driftY: rand(-56, 20),
  }))
}

function buildGlows(count: number): GlowSpec[] {
  return Array.from({ length: count }, (_, index) => ({
    left: index % 2 === 0 ? rand(4, 30) : rand(62, 92),
    top: rand(8, 82),
    size: `${rand(30, 52)}vmax`,
    moveX: rand(-70, 70),
    moveY: rand(-60, 60),
    duration: rand(22, 34),
    delay: -rand(0, 30),
    opacity: rand(0.28, 0.5),
  }))
}

function GoldDust({ variant = 'hero' }: GoldDustProps) {
  const isHero = variant === 'hero'
  const scene = useMemo(
    () => ({
      glows: buildGlows(isHero ? 2 : 3),
      particles: buildParticles(isHero ? 14 : 10),
      specks: buildSpecks(isHero ? 7 : 5),
      shapes: buildShapes(isHero ? 4 : 3),
      showBeam: isHero,
    }),
    [isHero],
  )

  return (
    <div className={`gold-dust gold-dust--${variant}`} aria-hidden="true">
      {scene.glows.map((glow, index) => (
        <span
          key={`glow-${index}`}
          className="gold-dust__glow"
          style={
            {
              '--x': `${glow.left}%`,
              '--y': `${glow.top}%`,
              '--s': glow.size,
              '--mx': `${glow.moveX}px`,
              '--my': `${glow.moveY}px`,
              '--d': `${glow.duration}s`,
              '--dl': `${glow.delay}s`,
              '--o': glow.opacity,
            } as CSSProperties
          }
        />
      ))}
      {scene.particles.map((particle, index) => (
        <span
          key={`particle-${index}`}
          className="gold-dust__particle"
          style={
            {
              '--x': `${particle.left}%`,
              '--y': `${particle.top}%`,
              '--s': `${particle.size}px`,
              '--d': `${particle.duration}s`,
              '--dl': `${particle.delay}s`,
              '--sway': `${particle.sway}px`,
              '--o': particle.opacity,
            } as CSSProperties
          }
        />
      ))}
      {scene.specks.map((speck, index) => (
        <span
          key={`speck-${index}`}
          className="gold-dust__speck"
          style={
            {
              '--x': `${speck.left}%`,
              '--y': `${speck.top}%`,
              '--s': `${speck.size}px`,
              '--d': `${speck.duration}s`,
              '--dl': `${speck.delay}s`,
              '--dx': `${speck.dx}px`,
              '--dy': `${speck.dy}px`,
              '--o': speck.opacity,
            } as CSSProperties
          }
        />
      ))}
      {scene.shapes.map((shape, index) => (
        <span
          key={`shape-${index}`}
          className={`gold-dust__shape ${index % 2 === 0 ? 'gold-dust__shape--diamond' : 'gold-dust__shape--ring'}`}
          style={
            {
              '--x': `${shape.left}%`,
              '--y': `${shape.top}%`,
              '--s': `${shape.size}px`,
              '--d': `${shape.duration}s`,
              '--dl': `${shape.delay}s`,
              '--dx': `${shape.driftX}px`,
              '--dy': `${shape.driftY}px`,
              '--o': shape.opacity,
            } as CSSProperties
          }
        />
      ))}
      {scene.showBeam ? <span className="gold-dust__beam" /> : null}
    </div>
  )
}

export default GoldDust
