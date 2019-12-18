import React, { PropsWithChildren, useState, useEffect } from 'react'
import { Drawer, makeStyles } from '@material-ui/core'
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
  setDisabledResizeHandler (val: boolean): void
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
  let disabledResizeHandler = false

  useEffect(() =>{
    const resizeHandler = () =>{
      if(disabledResizeHandler){ return }
      setVisible(window.innerWidth >= 880)
    }
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  function setDisabledResizeHandler(val: boolean){
    disabledResizeHandler = val
  }

  getMethods && getMethods({ setVisible, setDisabledResizeHandler }) 

  return (
    visible ?
      <>
        <Drawer
          variant="permanent"
          anchor="right"
          classes={{ root: classes.root }}
        >
          {/* 给toolbar让出位置 */}
          <div style={{ height: 70 }} />
          <div style={{ width: 200, backgroundColor: '#eee' }}></div>
        </Drawer>

        <div style={{ width: 200 }} />
      </>
    : null
  )
}

export default resetComponentProps<Props>(
  userHOC(SideBarRight)
) 