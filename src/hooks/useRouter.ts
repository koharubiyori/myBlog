// import { useHistory } from 'react-router'
import qs from 'qs'
import { RoutePaths } from '~/routes'

export interface MyRouter<SearchParams, StateParams> {
  params: {
    search: SearchParams
    state: StateParams
  }

  search (path: RoutePaths, params?: { [key: string]: any }, action?: 'push' | 'replace'): void
  state (path: RoutePaths, params?: { [key: string]: any }, action?: 'push' | 'replace'): void 
}

export default function useRouter<SearchParams = {}, StateParams = {}>(): Readonly<MyRouter<SearchParams, StateParams>>{  
  // const history = useHistory()
  const history: any = {}
  
  return {
    params: {
      search: qs.parse(history.location.search.split('?')[1]),
      state: history.location.state || {}
    },

    search (path, params = {}, action = 'push'){
      history[action]({ pathname: path, search: qs.stringify(params) })
    },

    state (path, params = {}, action = 'push'){
      history[action]({ pathname: path, state: params })
    }
  }
}