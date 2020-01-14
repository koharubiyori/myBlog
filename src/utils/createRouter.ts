import { globalHistory, HistoryListener, HistoryUnsubscribe, HistoryLocation } from '@reach/router'
import qs from 'qs'
import { basePath, RoutePaths } from '~/routes'

type MyNavigateFn = (
  path: RoutePaths, 
  args?: {
    search?: { [key: string]: any }
    state?: { [key: string]: any }
  }
) => Promise<void>

export type NavigateExec = (newPath?: RoutePaths | false) => Promise<void>
export type NavigateNext = (newPath?: RoutePaths | false) => void
export type RouteLeaveGuardCb = (guard: NavigateNext) => void

export const routeLeaveGuard: { current: null | RouteLeaveGuardCb } = {
  current: null
}

export interface MyRouter<SearchParams, StateParams> {
  params: {
    search: SearchParams
    state: StateParams
  }

  push: MyNavigateFn
  replace: MyNavigateFn
  navigate: MyNavigateFn
  back: History['back']
  clearState (): void
  listen (listener: HistoryListener): HistoryUnsubscribe
  location: HistoryLocation
}

export default function createRouter<SearchParams = {}, StateParams = {}>(historyLocation?: HistoryLocation): Readonly<MyRouter<SearchParams, StateParams>>{  
  const location = historyLocation || globalHistory.location
  const {navigate} = globalHistory
  
  const myNavigate = (path: RoutePaths, args = {} as { search?: {}, state?: {} }, replace = false): Promise<void> =>{
    const exec: NavigateExec = (newPath?: RoutePaths | false) =>{
      if(newPath === false) return Promise.resolve()
      
      let toPath = basePath + (newPath || path)
      if(args.search) toPath += '?' + qs.stringify(args.search)
      return navigate(toPath, { state: args.state, replace })
    }
    
    return new Promise(resolve =>{
      if(routeLeaveGuard.current){
        const next: NavigateNext = (newPath?) =>{ exec(newPath).then(resolve) }
        routeLeaveGuard.current(next)
      }else{
        exec().then(resolve)
      }
    })
  }

  return {
    push: myNavigate,

    params: {
      search: qs.parse(location.search.split('?')[1]),
      state: location.state || {}
    },

    replace: (path, args = {}) => myNavigate(path, args, true),

    navigate: (path, args = {}) =>{
      if(window.location.pathname === basePath + path) return Promise.resolve()
      return myNavigate(path, args)
    },

    back: window.history.back,
    clearState: () => window.history.replaceState({}, ''),
    listen: globalHistory.listen,
    location: globalHistory.location
  }
}