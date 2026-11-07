'use client'

import { useEffect } from 'react'

/**
 * Grade de pontos que só existe onde está a luz (segue o dedo/mouse) e o brilho
 * que acompanha o ponteiro dentro dos elementos .spot — o mesmo efeito do site.
 */
export function LightField() {
  useEffect(() => {
    const root = document.documentElement
    const field = document.querySelector<HTMLElement>('.light-field')

    const onMove = (e: PointerEvent) => {
      if (field) {
        field.style.setProperty('--mx', `${e.clientX}px`)
        field.style.setProperty('--my', `${e.clientY}px`)
      }
      const spot = (e.target as HTMLElement | null)?.closest<HTMLElement>('.spot')
      if (spot) {
        const r = spot.getBoundingClientRect()
        spot.style.setProperty('--x', `${e.clientX - r.left}px`)
        spot.style.setProperty('--y', `${e.clientY - r.top}px`)
      }
    }
    root.addEventListener('pointermove', onMove, { passive: true })
    return () => root.removeEventListener('pointermove', onMove)
  }, [])

  return <div className="light-field" aria-hidden="true" />
}
