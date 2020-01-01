import React, { FC } from 'react'
import { KeepAlive } from 'react-keep-alive'
export default 
(Component: FC<any>) => 
  (...props: any[]) => 
    <KeepAlive name={Component.name || Component.displayName}>
      <Component {...props} />
    </KeepAlive>