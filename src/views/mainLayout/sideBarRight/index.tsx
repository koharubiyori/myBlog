import React, { PropsWithChildren } from 'react'
import { Drawer } from '@material-ui/core'
import classes from './index.module.scss'
import { MyRouter } from '~/utils/createRouter'

export interface Props {
  router: MyRouter
}

type FinalProps = Props

function SideBarRight({
  children,
  router
}: PropsWithChildren<FinalProps>){
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

export default SideBarRight