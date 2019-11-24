import React, { PropsWithChildren } from 'react'
import AppBar from './AppBar'
import testHOC, { ConnectedProps } from '~/redux/test/HOC'

interface ConnectedProps2 {
  state: {
    aaa: {
      bbb: string
    }
  },

  aaa: {
    get (): void
  }
}

@testHOC
export default class MainLayout extends React.Component<PropsWithChildren<{}>, {}, ConnectedProps & ConnectedProps2>{
  constructor (props: PropsWithChildren<{}> & ConnectedProps & ConnectedProps2){
    super(props)
    this.state = {
      
    }

    props.test.set('haha', 20)
  }


  render (){
    return (
      <div>
        <AppBar />
        {this.props.children}
      </div>
    )
  }
}