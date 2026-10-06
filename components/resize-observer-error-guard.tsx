'use client'

// Chrome/Safari can throw this benign warning when a ResizeObserver callback
// doesn't finish before the next frame (commonly triggered by UI libraries
// like Radix/Base UI measuring elements, e.g. the Select on the checkout
// page). It does not indicate broken layout or lost updates, so we neutralize
// it at the source instead of letting it surface as an uncaught runtime error.
const RESIZE_OBSERVER_LOOP_MESSAGE =
  'ResizeObserver loop completed with undelivered notifications.'

function isResizeObserverLoopMessage(message: unknown) {
  return typeof message === 'string' && message.includes(RESIZE_OBSERVER_LOOP_MESSAGE)
}

// Runs once, synchronously, as soon as this module is evaluated on the
// client — earlier than a useEffect, and before the condition can fire for
// the first time. Patching ResizeObserver itself (rather than only catching
// the resulting error event) prevents the browser's internal loop-limit
// check from ever tripping, since every callback now runs on its own
// animation frame instead of synchronously inside the observation pass.
if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
  const NativeResizeObserver = window.ResizeObserver
  const patchedFlag = '__v0ResizeObserverPatched'

  if (!(NativeResizeObserver as unknown as Record<string, boolean>)[patchedFlag]) {
    class PatchedResizeObserver extends NativeResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        let scheduled = false
        super((entries, observer) => {
          if (scheduled) return
          scheduled = true
          requestAnimationFrame(() => {
            scheduled = false
            callback(entries, observer)
          })
        })
      }
    }
    ;(PatchedResizeObserver as unknown as Record<string, boolean>)[patchedFlag] = true
    window.ResizeObserver = PatchedResizeObserver
  }

  // Defense in depth: swallow the warning if it is ever still emitted
  // (e.g. by a library instantiating ResizeObserver before this module
  // loaded). Registered in the capture phase so it runs before other
  // listeners, including dev-overlay error reporting.
  window.addEventListener(
    'error',
    (event) => {
      if (isResizeObserverLoopMessage(event.message)) {
        event.stopImmediatePropagation()
        event.preventDefault()
      }
    },
    true,
  )
}

export function ResizeObserverErrorGuard() {
  return null
}
