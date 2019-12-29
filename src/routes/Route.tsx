import React, { useState, useEffect, useRef, PropsWithChildren, FC } from 'react'

export interface Props {
  path: string
  component: FC
}

type FinalProps = Props

function MyRoute(props: PropsWithChildren<FinalProps>){
  const Component = props.component
  
  return <Component />
}

export default MyRoute