import React, { Component, PropsWithChildren } from 'react'
import classes from './index.module.scss'
import MyAppBar from './myAppBar'
import SideBar from './sideBar'
import SideBarRight from './sideBarRight'
import ActionsButton from './ActionsButton'
import common from '~/api/common'
import { RouteChildrenProps, withRouter } from 'react-router'
import createRouter from '~/utils/createRouter'

export interface Props {
  
}

export interface State {
  theme: ApiData.Theme
}

type FinalProps = Props & RouteChildrenProps

class MainLayout extends Component<PropsWithChildren<FinalProps>, State> {
  router = createRouter(this.props)
  actionsButtonMethods: Methods = null as any
  
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      theme: {} as any
    }

    common.getTheme().then(theme => this.setState({ theme }))
  }

  componentDidMount (){
    // 管理主布局各部分的显隐
  }

  render (){
    return (
      <>
        <MyAppBar router={this.router} />
        <SideBar theme={this.state.theme} router={this.router} />
        <SideBarRight router={this.router} />
        <ActionsButton router={this.router} getMethods={methods => this.actionsButtonMethods = methods} />
        <div {...c(classes.contentContainer)}>
          <div className="content">{this.props.children}</div>
        </div>
      </>
    )
  }
}

export default withRouter(MainLayout as any)