import React, { PropsWithChildren } from 'react'
import { Drawer } from '@material-ui/core'
import classes from './index.module.scss'
import { MyRouter } from '~/utils/createRouter'
import resetComponentProps from '~/utils/resetComponentProps'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'

export interface Props {
  router: MyRouter
}

type FinalProps = Props & UserConnectedProps

function SideBarRight({
  children,
  router,
  state,
  $user
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

export default resetComponentProps<Props>(
  userHOC(SideBarRight)
) 