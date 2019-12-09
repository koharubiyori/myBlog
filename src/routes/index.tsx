import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import loadable from '@loadable/component'
import MainLayout from '~/views/mainLayout'
import Register from '~/views/account/Register'
import Login from '~/views/account/Login'

const UserInfo = loadable(() => import('~/views/account/UserInfo'))

export default class Routes extends React.Component{
  constructor (props: Object){
    super(props)
    this.state = {
      
    }
  }

  render(): JSX.Element{
    return (
      <BrowserRouter>
        <Route path="/">
          <MainLayout>
            <Route path="/account/register" component={Register} />
            <Route path="/account/login" component={Login} />
            <Route path="/account/userInfo" component={UserInfo} />
          </MainLayout>
        </Route>
      </BrowserRouter>
    )
  }
}