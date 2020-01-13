import React, { useState, useEffect, useRef, PropsWithChildren, FC } from 'react'
import { getRole } from '~/redux/user/HOC'
import { MyRouteOptions, defaultRouteOptions } from './asyncLoader'
import { Redirect } from '@reach/router'


export interface Props {
  path: string
  route?: MyRouteOptions
  component?: FC
}

type FinalProps = Props

function MyRoute(props: PropsWithChildren<FinalProps>){  
  const Component = props.route ? props.route.component : props.component!
  const options = props.route || defaultRouteOptions
  const isValid = options.role.includes(getRole())
  
  return isValid ? <Component /> : <Redirect noThrow to="/" />
}

export default MyRoute