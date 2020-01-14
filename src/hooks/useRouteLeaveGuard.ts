import { useEffect } from 'react'
import { routeLeaveGuard, RouteLeaveGuardCb } from '~/utils/createRouter'
import { RoutePaths } from '~/routes'

export default function useRouteLeaveGuard(guard: RouteLeaveGuardCb){
  useEffect(() =>{
    routeLeaveGuard.current = guard
    return () =>{ routeLeaveGuard.current = null }
  }, [])
}