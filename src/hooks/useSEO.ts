import { useEffect } from 'react'
import { useKeepAliveEffect } from 'react-keep-alive'

const siteName = '小春日和の秘密基地'

export type SetTitle = (title: string, desc?: string) => void

export function setTitle(title: string, desc = ''){
  document.title = title ? (title + ' - ' + siteName) : siteName
  document.querySelector('meta[name="description"]')!.setAttribute('content', desc)
}

export function resetTitle(){
  document.title = siteName
  document.querySelector('meta[name="description"]')!.setAttribute('content', '')
}

export default function useSEO(handler: (setTitle: SetTitle) => void, deps: React.DependencyList | undefined = []){ 
  useEffect(() =>{
    handler(setTitle)
    return resetTitle
  }, deps)
}