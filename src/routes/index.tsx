import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import MainLayout from '~/views/mainLayout'
import Account from '~/views/account'

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
            <Route path="/account" component={Account} />
          </MainLayout>
        </Route>
      </BrowserRouter>
    )
  }
}