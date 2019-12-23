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
  listen: (listener: HistoryListener) => HistoryUnsubscribe
  location: HistoryLocation
}

export default function createRouter<SearchParams = {}, StateParams = {}>(): Readonly<MyRouter<SearchParams, StateParams>>{  
  const {location, navigate} = globalHistory
  
  return {
    params: {
      search: qs.parse(location!.search.split('?')[1]),
      state: location!.state || {}
    },

    push: (path, args = {}) =>{
      let toPath = basePath + path
      if(args.search) toPath += '?' + qs.stringify(args.search)
      return navigate(toPath, { state: args.state })
    },

    replace: (path, args = {}) =>{
      let toPath = basePath + path
      if(args.search) toPath += '?' + qs.stringify(args.search)
      return navigate(toPath, { state: args.state, replace: true })
    },

    listen: globalHistory.listen,
    location: globalHistory.location
  }
}