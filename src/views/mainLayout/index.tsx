import React, { Component, PropsWithChildren, createContext, createRef } from 'react'
import classes from './index.module.scss'
import MyAppBar from './myAppBar'
import SideBar from './sideBar'
import { default as SideBarRight, Methods as SideBarRightMethods } from './sideBarRight'
import { default as ActionsButton, Methods as ActionsButtonMethods } from './ActionsButton'
import common from '~/api/common'
import { RouteChildrenProps, withRouter } from 'react-router'
import createRouter from '~/utils/createRouter'

export interface Props {
  
}

export interface State {
  theme: ApiData.Theme
}

export interface MainLayoutControllers {
  sideBarRight: {
    setVisible (val: boolean): void
    setDisabledResizeHandler (val: boolean): void
  }

  actionsButton: {
    setVisible (val: boolean): void
    setDisabledResizeHandler (val: boolean): void
  }
}

export const MainLayoutContext = createContext<MainLayoutControllers>(null as any)

type FinalProps = Props & RouteChildrenProps

class MainLayout extends Component<PropsWithChildren<FinalProps>, State> {
  router = createRouter(this.props)
  sideBarRightMethods: SideBarRightMethods = null as any
  actionsButtonMethods: ActionsButtonMethods = null as any
  mainLayoutControllers: MainLayoutControllers = null as any
  
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      theme: {} as any
    }

    common.getTheme().then(theme =>{
      this.setState({ theme })
      document.body.style.cssText = `
        background-color: #ccc;
      `
    })
  }

  componentDidMount (){
    // 管理主布局各部分的显隐
    this.mainLayoutControllers = {
      sideBarRight: {
        setVisible: this.sideBarRightMethods.setVisible,
        setDisabledResizeHandler: this.sideBarRightMethods.setDisabledResizeHandler
      },

      actionsButton: {
        setVisible: val => this.actionsButtonMethods.setHidden(!val),
        setDisabledResizeHandler: this.actionsButtonMethods.setDisabledResizeHandler
      }
    }

  }

  render (){
    return (
      <>
        <MyAppBar router={this.router} />

        <div className="flex-row">
          <SideBar theme={this.state.theme} router={this.router} />

          <div {...c(classes.contentContainer, 'flex-grow')}>
            <MainLayoutContext.Provider value={this.mainLayoutControllers}>
              <div className="mainLayout-content">{this.props.children}</div>
            </MainLayoutContext.Provider>
          </div>
          
          <SideBarRight router={this.router} getMethods={methods => this.sideBarRightMethods = methods} />
        </div>
        
        <ActionsButton router={this.router} getMethods={methods => this.actionsButtonMethods = methods} />
      </>
    )
  }
}

export default withRouter(MainLayout as any)