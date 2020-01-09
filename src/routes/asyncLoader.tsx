import React, { FC } from 'react'
import { default as loadable } from '@loadable/component'
import { CircularProgress } from '@material-ui/core'
import { getRole } from '~/redux/user/HOC'
export interface AsyncLoaderOptions {
  role: ReturnType<typeof getRole>[],
}

export const defaultRouteOptions: AsyncLoaderOptions = {
  role: ['admin', 'user', 'visitor']
}

export type MyRouteOptions = AsyncLoaderOptions & { component: FC<any> }

export default function(path: string, options = defaultRouteOptions): MyRouteOptions{
  return {
    ...options,
    component: process.env.NODE_ENV === 'development' ? 
      require('~/views/' + path).default :
      loadable(() => import('~/views/' + path), {
        fallback: <LoadingProgress /> 
      })
  }
}

function LoadingProgress (){
  return <CircularProgress style={{  display: 'block', margin: '30px auto' }} />
}