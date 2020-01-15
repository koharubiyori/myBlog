import React, { FC } from 'react'
import { KeepAlive } from 'react-keep-alive'

let keepAliveIncrementKey = 0
let nameMap = new Map<FC<any>, string>()    // keepAlive需要一个唯一name，这里用map保存组件对应name

export default (Component: FC<any>) =>{
  let name = nameMap.get(Component)
  if(typeof name === 'undefined'){
    name = (keepAliveIncrementKey++).toString()
    nameMap.set(Component, name)
  }

  return (...props: any[]) => 
    <KeepAlive name={name}>
      <Component {...props} />
    </KeepAlive>
}