import React, { FC } from 'react'
import { KeepAlive } from 'react-keep-alive'
export default 
(Component: FC) => 
  (...props: any[]) => 
    <KeepAlive name={Component.name}>
      <Component {...props} key={Component.name} />
    </KeepAlive>