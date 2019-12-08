import { RouteChildrenProps } from 'react-router'
import qs from 'qs'

export interface MyRouter {
  params: {
    search: object
    state: object
  }

  search (path: string, params?: object, action?: 'push' | 'replace'): void
  state (path: string, params?: object, action?: 'push' | 'replace'): void 
}

export default function(
  routeComponent: { 
    props: { 
      history: RouteChildrenProps['history'] 
    }
  }
): MyRouter{
  let {history} = routeComponent.props
  
  return {
    params: {
      search: qs.parse(history.location.search.split('?')[1]),
      state: history.location.state
    },

    search (path, params = {}, action = 'push'){
      history[action]({ pathname: path, search: qs.stringify(params) })
    },

    state (path, params = {}, action = 'push'){
      history[action]({ pathname: path, state: params })
    }
  }
}