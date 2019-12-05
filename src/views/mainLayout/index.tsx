import React, { Component, PropsWithChildren } from 'react'
// import classes from './MainLayout.module.scss'
import { withTheme } from '@material-ui/core'
import MyAppBar from './myAppBar'
import SideBar from './sideBar'
import user from '~/api/user'

export interface Props {
  
}

class MainLayout extends Component<PropsWithChildren<Props>> {
  state = {
    
  }

  constructor (props: PropsWithChildren<Props>){
    super(props)
    this.state = {
      
    }
  }

  render (){
    return (
      <div>
        <MyAppBar />
        <SideBar />
        {this.props.children}
      </div>
    )
  }
}

export default withTheme(MainLayout)