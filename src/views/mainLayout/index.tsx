import React, { Component, PropsWithChildren } from 'react'
import classes from './index.module.scss'
import MyAppBar from './myAppBar'
import SideBar from './sideBar'
import common from '~/api/common'
import SideBarRight from './sideBarRight'
import { Box } from '@material-ui/core'

export interface Props {
  
}

export interface State {
  theme: ApiData.Theme
}

class MainLayout extends Component<PropsWithChildren<Props>, State> {
  constructor (props: PropsWithChildren<Props>){
    super(props)
    this.state = {
      theme: {} as any
    }

    common.getTheme().then(theme => this.setState({ theme }))
  }

  render (){
    return (
      <>
        <MyAppBar />
        <SideBar theme={this.state.theme} />
        <SideBarRight />
        <div {...c(classes.contentContainer)}>
          <div className="content">{this.props.children}</div>
        </div>
      </>
    )
  }
}

export default MainLayout