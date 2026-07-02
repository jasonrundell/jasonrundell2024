'use client'

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { styled } from '@pigment-css/react'
import { Skills as SkillsDef } from '@/typeDefinitions/app'
import Tokens from '@/lib/tokens'

/* ── Category palette ── */

const CATEGORY_PALETTE: Record<string, string> = {
  AI: '#e9be62',
  'Front end': '#9ece6a',
  'Content Management Systems': '#7aa2f7',
  'Cloud Computing and DevOps Tools': '#bb9af7',
  'Test, Build and Lint': '#f7768e',
  Data: '#ff9e64',
  'Performance & Monitoring': '#73daca',
  'Back end': '#2ac3de',
  Versioning: '#c0caf5',
}

function categoryColor(cat: string): string {
  return CATEGORY_PALETTE[cat] ?? '#b8c5d6'
}

/* ── Animation constants ── */

const AUTO_SPEED = 0.002
const DRAG_FACTOR = 0.004

/* ── 3D math ── */

interface Vec3 {
  x: number
  y: number
  z: number
}

function fibonacciSphere(n: number): Vec3[] {
  if (n <= 0) return []
  if (n === 1) return [{ x: 0, y: 0, z: 0 }]
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    return { x: Math.cos(t) * r, y, z: Math.sin(t) * r }
  })
}

function rotateYX(p: Vec3, ax: number, ay: number): Vec3 {
  const cy = Math.cos(ay),
    sy = Math.sin(ay)
  const x1 = p.x * cy - p.z * sy
  const z1 = p.x * sy + p.z * cy
  const cx = Math.cos(ax),
    sx = Math.sin(ax)
  return { x: x1, y: p.y * cx - z1 * sx, z: p.y * sx + z1 * cx }
}

/* ── Token shortcuts ── */

const spacingXs = `${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit}`
const spacingSm = `${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit}`
const spacingMd = `${Tokens.sizes.spacing.medium.value}${Tokens.sizes.spacing.medium.unit}`
const padXs = `${Tokens.sizes.padding.xsmall.value}${Tokens.sizes.padding.xsmall.unit}`
const padSm = `${Tokens.sizes.padding.small.value}${Tokens.sizes.padding.small.unit}`
const borderRad = `${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit}`

/* ── Styled components ── */

const StyledWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${spacingMd};
  width: 100%;
`

const StyledSearchBar = styled('div')`
  display: flex;
  align-items: center;
  gap: ${spacingXs};
  padding: ${padXs} ${padSm};
  background: ${Tokens.colors.surfaceDeepest.var};
  border: 1px solid ${Tokens.colors.surfaceBase.var};
  border-radius: ${borderRad};
  font-family: ${Tokens.fonts.monospace.family};

  &::before {
    content: '>';
    color: ${Tokens.colors.roleSuccess.var};
    font-weight: 600;
    flex-shrink: 0;
  }
`

const StyledSearchInput = styled('input')`
  background: transparent;
  border: none;
  outline: none;
  color: ${Tokens.colors.roleBody.var};
  font-family: inherit;
  font-size: ${Tokens.fontSizes.base.value}${Tokens.fontSizes.base.unit};
  width: 100%;

  &::placeholder {
    color: ${Tokens.colors.textSecondary.var};
    opacity: 0.6;
  }
`

const StyledCount = styled('span')`
  flex-shrink: 0;
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  color: ${Tokens.colors.roleInfo.var};
  white-space: nowrap;
`

const StyledCloud = styled('div')`
  position: relative;
  width: 100%;
  height: 340px;
  cursor: grab;
  touch-action: none;
  overflow: hidden;
  border-radius: ${borderRad};
  border: 1px solid ${Tokens.colors.surfaceBase.var};
  background: radial-gradient(
    circle at center,
    ${Tokens.colors.surfaceDeepest.var} 0%,
    transparent 65%
  );

  &:active {
    cursor: grabbing;
  }

  @media (min-width: 768px) {
    height: 460px;
  }

  @media (min-width: 1024px) {
    height: 520px;
  }
`

const StyledTag = styled('span')`
  position: absolute;
  top: 50%;
  left: 50%;
  white-space: nowrap;
  border: 1px solid;
  border-radius: 9999px;
  padding: 0.2rem 0.65rem;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: 0.85rem;
  cursor: default;
  user-select: none;
  opacity: 0;
  will-change: transform, opacity;
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 0 14px currentColor;
  }
`

const StyledLegend = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacingXs} ${spacingSm};
`

const StyledLegendBtn = styled('button')`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  color: ${Tokens.colors.roleBody.var};
  opacity: 0.7;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }
`

const StyledDot = styled('span')`
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
`

/* ── Component ── */

export default function Skills({ skills }: SkillsDef) {
  const cloudRef = useRef<HTMLDivElement>(null)
  const tagEls = useRef<(HTMLSpanElement | null)[]>([])
  const rot = useRef({ x: -0.2, y: 0 })
  const dragging = useRef(false)
  const lastPtr = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const sphereR = useRef(160)

  const [query, setQuery] = useState('')

  const unitPts = useMemo(() => fibonacciSphere(skills.length), [skills.length])

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return new Set(
      skills
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        )
        .map((s) => s.id)
    )
  }, [query, skills])

  useEffect(() => {
    skills.forEach((s, i) => {
      const el = tagEls.current[i]
      if (!el) return
      el.dataset.matched =
        matchIds === null || matchIds.has(s.id) ? 'yes' : 'no'
    })
  }, [matchIds, skills])

  useEffect(() => {
    const el = cloudRef.current
    if (!el) return
    const sync = () => {
      const { width, height } = el.getBoundingClientRect()
      sphereR.current = Math.max(
        90,
        Math.min(240, Math.min(width, height) * 0.38)
      )
    }
    sync()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    function tick() {
      if (!dragging.current && !reduced) {
        rot.current.y += AUTO_SPEED
      }
      const r = sphereR.current
      for (let i = 0; i < unitPts.length; i++) {
        const el = tagEls.current[i]
        if (!el) continue
        const p = {
          x: unitPts[i].x * r,
          y: unitPts[i].y * r,
          z: unitPts[i].z * r,
        }
        const { x, y, z } = rotateYX(p, rot.current.x, rot.current.y)
        const depth = (z + r) / (2 * r)
        const match = el.dataset.matched !== 'no'
        const op = match ? 0.2 + depth * 0.8 : 0.06
        const sc = 0.6 + depth * 0.4
        el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0px) scale(${sc})`
        el.style.opacity = String(op)
        el.style.zIndex = String(Math.round(depth * 100))
      }
      frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [unitPts])

  const onDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    lastPtr.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }, [])

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    rot.current.y += (e.clientX - lastPtr.current.x) * DRAG_FACTOR
    rot.current.x = Math.max(
      -1,
      Math.min(1, rot.current.x + (e.clientY - lastPtr.current.y) * DRAG_FACTOR)
    )
    lastPtr.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onUp = useCallback(() => {
    dragging.current = false
  }, [])

  const categories = useMemo(() => {
    const seen = new Set<string>()
    return skills.reduce<string[]>((acc, s) => {
      if (!seen.has(s.category)) {
        seen.add(s.category)
        acc.push(s.category)
      }
      return acc
    }, [])
  }, [skills])

  return (
    <StyledWrapper>
      <StyledSearchBar>
        <StyledSearchInput
          type="search"
          placeholder="search skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search skills"
        />
        {matchIds !== null && (
          <StyledCount>
            {matchIds.size} / {skills.length}
          </StyledCount>
        )}
      </StyledSearchBar>

      <StyledCloud
        ref={cloudRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        role="list"
        aria-label="Skills cloud"
      >
        {skills.map((skill, i) => {
          const color = categoryColor(skill.category)
          return (
            <StyledTag
              key={skill.id}
              ref={(el) => {
                tagEls.current[i] = el
              }}
              role="listitem"
              title={skill.category}
              style={{ borderColor: `${color}66`, color }}
            >
              {skill.name}
            </StyledTag>
          )
        })}
      </StyledCloud>

      <StyledLegend aria-label="Skill categories">
        {categories.map((cat) => (
          <StyledLegendBtn
            key={cat}
            type="button"
            onClick={() => setQuery(cat)}
            aria-label={`Filter by ${cat}`}
          >
            <StyledDot style={{ background: categoryColor(cat) }} />
            {cat}
          </StyledLegendBtn>
        ))}
      </StyledLegend>
    </StyledWrapper>
  )
}
