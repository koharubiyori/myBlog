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

export default function createRouter<SearchParams = {}, StateParams = {}>(): Readonly<MyRouter<SearchParams, StateParams>>{  
  const {location, navigate} = globalHistory
  
  const myNavigate = (path: string, args = {} as { search?: {}, state?: {} }, replace = false) =>{
    let toPath = basePath + path
    if(args.search) toPath += '?' + qs.stringify(args.search)
    return navigate(toPath, { state: args.state, replace })
  }

  return {
    push: myNavigate,

    params: {
      search: qs.parse(location!.search.split('?')[1]),
      state: location!.state || {}
    },

    replace: (path, args = {}) => myNavigate(path, args, true),

    navigate: (path, args = {}) =>{
      if(window.location.pathname === basePath + path) return Promise.reject()
      return myNavigate(path, args)
    },

    back: window.history.back,
    clearState: () => window.history.replaceState({}, ''),
    listen: globalHistory.listen,
    location: globalHistory.location
  }
}