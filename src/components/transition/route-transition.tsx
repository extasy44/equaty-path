'use client'

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  cubicBezier,
} from 'framer-motion'
import { usePathname } from 'next/navigation'

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  const easeBezier = cubicBezier(0.22, 1, 0.36, 1)
  const variants = {
    initial: { opacity: 0, y: 6, filter: 'blur(4px)' },
    enter: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.2, ease: easeBezier },
    },
    exit: {
      opacity: 0,
      y: -6,
      filter: 'blur(4px)',
      transition: { duration: 0.14, ease: easeBezier },
    },
  }

  if (prefersReducedMotion) return <>{children}</>

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={pathname}
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="relative isolate bg-white"
          style={{ willChange: 'opacity, transform, filter' }}
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}

export type RouteTransitionProps = object
