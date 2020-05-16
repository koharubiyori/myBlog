import React, { useState, useEffect, PropsWithChildren, createContext, useRef, FC } from 'react'
import MyAppBar from './myAppBar'
import Sidebar from './sidebar'
import { default as SidebarRight, SidebarRightRef } from './sidebarRight'
import { default as ActionsButton, ActionsButtonRef } from './ActionsButton'
import common from '~/api/common'
import { makeStyles } from '@material-ui/core'
import { flex } from '~/styles'
import createRouter from '~/utils/createRouter'
import BgImg from '~/components/BgImg'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'

export const containerMaxWidth = 800
export const containerMinWidth = 600

export interface Props extends RouteComponent {
  
}

export interface MainLayoutControllers {
  sidebarRight: SidebarRightRef
  actionsButton: ActionsButtonRef
}

// 因为mainLayoutControllers的成员都是组件实例(ref)，为了防止拿到null，这里保存一个promise，并将resolve函数赋给外部变量
// 之后在下面的useEffect中，调用resolve，传入mainLayoutControllers对象
let mainLayoutControllersResolve: (value: MainLayoutControllers) => void 
export const MainLayoutContext = createContext<Promise<MainLayoutControllers>>(new Promise(resolve => mainLayoutControllersResolve = resolve))

type FinalProps = Props & DataConnectedProps

function MainLayout(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter(),
    [theme, setTheme] = useState<ApiData.Theme>({} as any),
    refs = {
      sidebarRight: useRef<SidebarRightRef>(),
      actionsButton: useRef<ActionsButtonRef>()
    }

    useEffect(() =>{
      common.getTheme().then(setTheme)
      router.push('/')  // 迷之原因第一次进入的home没有压进栈中，这里只好手动push一个
    }, [])

    useEffect(() =>{
      mainLayoutControllersResolve({
        sidebarRight: refs.sidebarRight.current!,
        actionsButton: refs.actionsButton.current!
      })
    }, [])

    return (
      <>
        <MyAppBar />
        {props.state.data.settings ? 
          <BgImg uri={props.state.data.settings.bgImg} />
        : null}
        <div className={c(flex.row)}>
          <Sidebar theme={theme} />

          <div className={c(classes.contentContainer, flex.grow)}>
            <div className="mainLayout-content">{props.children}</div>
          </div>
          
          <SidebarRight getRef={refs.sidebarRight} />
        </div>
        
        <ActionsButton getRef={refs.actionsButton} />
      </>
    )
}

export default dataHOC(MainLayout) as FC<Props>

const useStyles = makeStyles({
  contentContainer: {
    position: 'relative',
    top: 84,
    margin: '0 20px',
  },

  '@global .mainLayout-content': {
    maxWidth: containerMaxWidth,
    minWidth: containerMinWidth,
    margin: '0 auto',
    paddingBottom: 20,
  }
})