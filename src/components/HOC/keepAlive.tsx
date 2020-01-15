import React, { FC } from 'react'
import { KeepAlive } from 'react-keep-alive'
export default 
(Component: FC<any>, name: string) => 
  (...props: any[]) => 
    <KeepAlive name={name}>
      <Component {...props} />
    </KeepAlive>