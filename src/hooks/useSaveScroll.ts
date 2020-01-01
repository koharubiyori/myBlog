import { useRef } from 'react'
import { useKeepAliveEffect } from 'react-keep-alive'

export default function useSaveScroll(){
  const scrollY = useRef(0)

  useKeepAliveEffect(() =>{
    window.scrollTo(0, scrollY.current)  

    function scrollHandler(){
      scrollY.current = window.scrollY
    }

    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  })
}