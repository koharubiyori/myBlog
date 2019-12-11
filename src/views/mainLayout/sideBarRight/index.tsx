import React, { PropsWithChildren, useState, useEffect } from 'react'
import { Drawer } from '@material-ui/core'
import classes from './index.module.scss'
import { MyRouter } from '~/utils/createRouter'
import resetComponentProps from '~/utils/resetComponentProps'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import { CSSTransition } from 'react-transition-group'

export interface Props {
  router: MyRouter
  getMethods?: GetMethods<Methods>
}

export interface Methods {
  setVisible (val: boolean): void
}

type FinalProps = Props & UserConnectedProps

function SideBarRight({
  children,
  getMethods,
  router,
  state,
  $user
}: PropsWithChildren<FinalProps>){
  const [visible, setVisible] = useState(true)
  
  useEffect(() =>{
    const resizeHandler = () => setVisible(window.innerWidth >= 880)
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  getMethods && getMethods({ setVisible }) 

  return (
    <CSSTransition in={visible} unmountOnExit timeout={500} classNames="fade">
      <Drawer
        variant="permanent"
        anchor="right"
        classes={{ root: classes.drawerContainer }}
      >
        {/* 给toolbar让出位置 */}
        <div style={{ height: 70 }} />
        <div style={{ width: 200, backgroundColor: '#eee' }}></div>
      </Drawer>
    </CSSTransition>
  )
}

export default resetComponentProps<Props>(
  userHOC(SideBarRight)
) 