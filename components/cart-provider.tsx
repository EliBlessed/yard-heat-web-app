"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import {
  CART_STORAGE_KEY,
  addLine,
  cartItemCount,
  parseCart,
  removeLine,
  setLineQuantity,
  type CartLine,
} from "@/lib/cart"

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  /** False until the cart has been read from the browser, so server and first client render match. */
  ready: boolean
  removedUnavailable: boolean
  dismissRemovedNotice: () => void
  /** Returns true if the quantity was capped at the maximum. */
  add: (slug: string, sizeId: string, quantity: number) => boolean
  setQuantity: (slug: string, sizeId: string, quantity: number) => void
  remove: (slug: string, sizeId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStorage(): unknown {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStorage(lines: CartLine[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Storage unavailable: the cart keeps working in memory for this visit.
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)
  const [removedUnavailable, setRemovedUnavailable] = useState(false)
  const linesRef = useRef<CartLine[]>([])

  const commit = useCallback((next: CartLine[]) => {
    linesRef.current = next
    setLines(next)
    writeStorage(next)
  }, [])

  useEffect(() => {
    const { lines: loaded, removedUnavailable: removed } = parseCart(readStorage())
    linesRef.current = loaded
    setLines(loaded)
    setRemovedUnavailable(removed)
    if (removed) writeStorage(loaded)
    setReady(true)

    function onStorage(e: StorageEvent) {
      if (e.key !== null && e.key !== CART_STORAGE_KEY) return
      const synced = parseCart(readStorage()).lines
      linesRef.current = synced
      setLines(synced)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const add = useCallback(
    (slug: string, sizeId: string, quantity: number) => {
      const result = addLine(linesRef.current, slug, sizeId, quantity)
      commit(result.lines)
      return result.capped
    },
    [commit],
  )

  const setQuantity = useCallback(
    (slug: string, sizeId: string, quantity: number) =>
      commit(setLineQuantity(linesRef.current, slug, sizeId, quantity)),
    [commit],
  )

  const remove = useCallback(
    (slug: string, sizeId: string) => commit(removeLine(linesRef.current, slug, sizeId)),
    [commit],
  )

  const clear = useCallback(() => commit([]), [commit])
  const dismissRemovedNotice = useCallback(() => setRemovedUnavailable(false), [])

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: cartItemCount(lines),
      ready,
      removedUnavailable,
      dismissRemovedNotice,
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, ready, removedUnavailable, dismissRemovedNotice, add, setQuantity, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
