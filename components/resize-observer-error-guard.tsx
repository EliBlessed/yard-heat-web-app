'use client'

import { useEffect } from 'react'

// Chrome/Safari can throw this benign warning when a ResizeObserver callback
// doesn't finish before the next frame (commonly triggered by UI libraries
// like Radix/Base UI measuring elements, e.g. the Select on the checkout
// page). It does not indicate broken layout or lost updates, so we silence
// it instead of letting it surface as an uncaught runtime error.
const RESIZE_OBSERVER_LOOP_MESSAGE =
  'ResizeObserver loop completed with undelivered notifications.'

export function ResizeObserverErrorGuard() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message === RESIZE_OBSERVER_LOOP_MESSAGE) {
        event.stopImmediatePropagation()
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return null
}
