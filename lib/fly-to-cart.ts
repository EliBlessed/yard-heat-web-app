/**
 * Sends a small copy of a product image flying into the cart button, then calls `onLanded`.
 * If the photo has scrolled off screen, the copy takes off from `button` instead.
 * Skips the flight (and calls `onLanded` straight away) for people who prefer reduced motion,
 * or if either element is missing.
 */
export function flyToCart(source: HTMLElement | null, onLanded?: () => void, button?: HTMLElement | null) {
  const land = () => onLanded?.()
  if (typeof window === "undefined" || !source) return land()
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return land()

  const target = document.querySelector<HTMLElement>("[data-cart-target]")
  const img = source.querySelector("img")
  if (!target || !img) return land()

  const photo = img.getBoundingClientRect()
  const offScreen = photo.bottom < 0 || photo.top > window.innerHeight
  const from = offScreen && button ? button.getBoundingClientRect() : photo
  const to = target.getBoundingClientRect()
  const size = Math.min(from.width, from.height, offScreen ? 64 : 160)

  const ghost = img.cloneNode(true) as HTMLImageElement
  ghost.removeAttribute("srcset")
  ghost.src = img.currentSrc || img.src
  ghost.setAttribute("aria-hidden", "true")
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "999px",
    zIndex: "100",
    pointerEvents: "none",
    boxShadow: "0 12px 30px -10px rgb(122 16 22 / 0.6)",
  })
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  const flight = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 80}px) scale(0.45)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.12)`, opacity: 0.2 },
    ],
    { duration: 750, easing: "cubic-bezier(0.5, 0, 0.3, 1)" },
  )
  flight.onfinish = () => {
    ghost.remove()
    land()
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease-out" },
    )
  }
}
