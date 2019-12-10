import React from 'react'
import { default as loadable, DefaultComponent} from '@loadable/component'
import { CircularProgress } from '@material-ui/core'

export default function(component: (props: any) => Promise<DefaultComponent<any>>){
  return loadable(component, {
    fallback: <LoadingProgress /> 
  })
}

function LoadingProgress (){
  return <CircularProgress style={{  display: 'block', margin: '30px auto' }} />
}