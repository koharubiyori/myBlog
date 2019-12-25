import React, { useState, useEffect, PropsWithChildren, createContext, useRef } from 'react'
import MyAppBar from './myAppBar'
import SideBar from './sideBar'
import { default as SideBarRight, SideBarRightRef } from './sideBarRight'
import { default as ActionsButton, ActionsButtonRef } from './ActionsButton'
import common from '~/api/common'
import { makeStyles } from '@material-ui/core'
import { flex } from '~/styles'
import createRouter from '~/utils/createRouter'
import BgImg from '~/components/BgImg'

export interface Props extends RouteComponent {
  
}

export interface State {
  theme: ApiData.Theme
}

export interface MainLayoutControllers {
  sideBarRight: SideBarRightRef
  actionsButton: ActionsButtonRef
}

export const MainLayoutContext = createContext<MainLayoutControllers | null>(null)

type FinalProps = Props

function MainLayout(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter(),
    [theme, setTheme] = useState<ApiData.Theme>({} as any),
    refs = {
      sideBarRight: useRef<SideBarRightRef>(),
      actionsButton: useRef<ActionsButtonRef>()
    },
    mainLayoutControllers = useRef<MainLayoutControllers>(null)

    useEffect(() =>{
      common.getTheme().then(setTheme)
    }, [])

    useEffect(() =>{
      (mainLayoutControllers.current as any) = {
        sideBarRight: refs.sideBarRight.current!,
        actionsButton: refs.actionsButton.current!
      }
    }, [])

    return (
      <>
        <MyAppBar />
        <BgImg uri={'https://i.loli.net/2019/11/19/1tconZNSjgXROA7.png'} />
        <div className={c(flex.row)}>
          <SideBar theme={theme} />

          <div className={c(classes.contentContainer, flex.grow)}>
            <MainLayoutContext.Provider value={mainLayoutControllers.current}>
              <div className="mainLayout-content">{props.children}</div>
            </MainLayoutContext.Provider>
          </div>
          
          <SideBarRight getRef={refs.sideBarRight} />
        </div>
        
        <ActionsButton getRef={refs.actionsButton} />
      </>
    )
}

export default MainLayout

const useStyles = makeStyles({
  contentContainer: {
    position: 'relative',
    top: 84,
    margin: '0 20px',
  },

  '@global .mainLayout-content': {
    maxWidth: 800,
    minWidth: 600,
    margin: '0 auto',
    paddingBottom: 20,
  }
})