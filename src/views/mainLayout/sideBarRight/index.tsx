import React, { PropsWithChildren } from 'react'
import { Drawer } from '@material-ui/core'
import classes from './index.module.scss'

export interface Props {
  
}

export default function SideBarRight(props: PropsWithChildren<Props>){
  return (
    <Drawer
      variant="permanent"
      anchor="right"
      classes={{ root: classes.drawerContainer }}
    >
      {/* 给toolbar让出位置 */}
      <div style={{ height: 70 }} />
      <div style={{ width: 200, backgroundColor: '#eee' }}></div>
    </Drawer>
  )
}