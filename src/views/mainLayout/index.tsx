import React, { Component, PropsWithChildren, createContext } from 'react'
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
  setSideBarRightVisible (val: boolean): void
  setActionsButtonVisible (val: boolean): void 
}

export const MainLayoutContext = createContext<MainLayoutControllers>(null as any)

type FinalProps = Props & RouteChildrenProps

class MainLayout extends Component<PropsWithChildren<FinalProps>, State> {
  router = createRouter(this.props)
  sideBarRightMethods: SideBarRightMethods = null as any
  actionsButtonMethods: ActionsButtonMethods = null as any
  mainLayoutControllers: MainLayoutControllers = {} as any
  
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      theme: {} as any
    }

    common.getTheme().then(theme => this.setState({ theme }))
  }

  componentDidMount (){
    // 管理主布局各部分的显隐
    // this.sideBarRightMethods.setVisible()
    this.mainLayoutControllers = {
      setActionsButtonVisible: val => { this.actionsButtonMethods.setHidden(!val) },
      setSideBarRightVisible: val => { this.sideBarRightMethods.setVisible(val) }
    }
  }

  render (){
    return (
      <>
        <MyAppBar router={this.router} />
        <SideBar theme={this.state.theme} router={this.router} />
        <SideBarRight router={this.router} getMethods={methods => this.sideBarRightMethods = methods} />
        <ActionsButton router={this.router} getMethods={methods => this.actionsButtonMethods = methods} />
        <div {...c(classes.contentContainer)}>
          <MainLayoutContext.Provider value={this.mainLayoutControllers}>
            <div className="content">{this.props.children}</div>
          </MainLayoutContext.Provider>
        </div>
      </>
    )
  }
}

export default withRouter(MainLayout as any)