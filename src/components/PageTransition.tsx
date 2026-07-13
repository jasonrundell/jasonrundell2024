'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Wraps page content and replays the dissolve-wipe animation on every route
 * change by remounting via a pathname `key`. The animation itself lives in
 * `.page-transition` (globals.css) and is collapsed under
 * `prefers-reduced-motion: reduce`.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
