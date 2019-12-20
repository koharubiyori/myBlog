import { useHistory } from 'react-router'
import qs from 'qs'

export interface MyRouter {
  params: {
    search: { [key: string]: any } | any
    state: { [key: string]: any } | any
  }

  search (path: string, params?: { [key: string]: any }, action?: 'push' | 'replace'): void
  state (path: string, params?: { [key: string]: any }, action?: 'push' | 'replace'): void 
}

export default function useRouter(): Readonly<MyRouter>{  
  const history = useHistory()
  
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