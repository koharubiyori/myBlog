import { useEffect } from 'react'
import { routeLeaveGuard, RouteLeaveGuardCb } from '~/utils/createRouter'

export default function useRouteLeaveGuard(guard: RouteLeaveGuardCb){
  useEffect(() =>{
    routeLeaveGuard.current = guard
    return () =>{ routeLeaveGuard.current = null }
  }, [])
}