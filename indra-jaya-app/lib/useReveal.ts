import { useEffect, useRef } from 'react'

/**
 * Reveal-on-scroll, done with restraint.
 *
 * Adds `is-in` to any descendant carrying `.reveal` the first time it enters
 * the viewport, so CSS handles a short fade + rise. One-shot (we unobserve
 * after revealing) so nothing re-animates on scroll-back. Honors
 * `prefers-reduced-motion` by revealing everything immediately.
 *
 * Optional stagger: children with `[data-reveal-stagger]` on a parent get an
 * incremental `--reveal-delay` based on their order.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))

    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'))
      return
    }

    // Apply stagger delays within any group that opts in.
    root.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
      const step = Number(group.dataset.revealStagger) || 80
      Array.from(group.children).forEach((child, i) => {
        if (child instanceof HTMLElement && child.classList.contains('reveal')) {
          child.style.setProperty('--reveal-delay', `${i * step}ms`)
        }
      })
    })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return ref
}
