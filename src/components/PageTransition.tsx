'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

/**
 * Wraps page content and replays the dissolve-wipe animation on every route
 * change by remounting via a pathname `key`. The animation itself lives in
 * `.page-transition` (globals.css) and is collapsed under
 * `prefers-reduced-motion: reduce`.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      // Keep AT focus move without a focus-visible ring (see globals.css).
      mainContent.focus({ preventScroll: true, focusVisible: false })
    }
  }, [pathname])

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
