import { useEffect, useRef } from 'react'

export interface UseWindowReachBottomOptions {
  offset?: number
  limit?: number
  handler(): void
}

export default function useWindowReachBottom(options: UseWindowReachBottomOptions | (() => void)) {
  let offset = 70
  let limit = 500
  let handler = options
  
  if (typeof options !== 'function') {
    offset = options.offset || offset
    limit = options.limit || limit
    handler = options.handler
  }

  const limitFlag = useRef(false)
  
  useEffect(() => {
    function scrollEventHandler() {
      if (limitFlag.current) { return }
      const currentScroll = document.documentElement.scrollTop
      const maxScroll = document.documentElement.offsetHeight - document.documentElement.clientHeight
  
      if (currentScroll >= maxScroll - offset) {
        limitFlag.current = true
        setTimeout(() => {
          (handler as () => void)()
          limitFlag.current = false
        }, limit)
      }
    }

    window.addEventListener('scroll', scrollEventHandler)
    return () => window.removeEventListener('scroll', scrollEventHandler)
  })
}