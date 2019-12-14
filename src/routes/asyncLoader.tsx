import React from 'react'
import { default as loadable, DefaultComponent} from '@loadable/component'
import { CircularProgress } from '@material-ui/core'

export default function(path: string){
  if(process.env.NODE_ENV === 'development'){
    return require('~/views/' + path).default
  }

  return loadable(() => import('~/views/' + path), {
    fallback: <LoadingProgress /> 
  })
}

function LoadingProgress (){
  return <CircularProgress style={{  display: 'block', margin: '30px auto' }} />
}