'use client'

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  cubicBezier,
} from 'framer-motion'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFirstLoad = useRef(true)
  const prefersReducedMotion = useReducedMotion()
  useEffect(() => {
    isFirstLoad.current = false
  }, [])

  const easeBezier = cubicBezier(0.22, 1, 0.36, 1)
  const variants = {
    initial: { opacity: 0, y: 6, filter: 'blur(4px)' },
    enter: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.28, ease: easeBezier },
    },
  }

  if (prefersReducedMotion || isFirstLoad.current) return <>{children}</>

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait" initial={false}>
        <m.div key={pathname} variants={variants} initial={'initial'} animate="enter" exit="exit">
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}

export type RouteTransitionProps = object
