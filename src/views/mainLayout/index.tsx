import React, { useState, useEffect, PropsWithChildren, createContext, useRef } from 'react'
import MyAppBar from './myAppBar'
import SideBar from './sideBar'
import { default as SideBarRight, SideBarRightRef } from './sideBarRight'
import { default as ActionsButton, ActionsButtonRef } from './ActionsButton'
import common from '~/api/common'
import { makeStyles } from '@material-ui/core'
import { flex } from '~/styles'

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
    [theme, setTheme] = useState<ApiData.Theme>({} as any),
    refs = {
      sideBarRight: useRef<SideBarRightRef>(),
      actionsButton: useRef<ActionsButtonRef>()
    },
    mainLayoutControllers = useRef<MainLayoutControllers>(null)

    useEffect(() =>{
      common.getTheme().then(theme =>{
        setTheme(theme)
        document.body.style.cssText = `
          background-image: url('https://i.loli.net/2019/11/19/1tconZNSjgXROA7.png');
          background-size: cover;
          background-repeat: no-repeat;
        `
      })
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
    minWidth: 400,
    margin: '0 auto',
    paddingBottom: 20,
  }
})