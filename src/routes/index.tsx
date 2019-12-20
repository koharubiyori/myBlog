import React from 'react'
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import asyncLoader from './asyncLoader'
import MainLayout from '~/views/mainLayout'
import Register from '~/views/account/Register'
import Login from '~/views/account/Login'

const l = asyncLoader
const UserInfo = l('account/UserInfo')
const ArticleEdit = l('article/edit')
const Home = l('home')

function AnimationRoutes(){
  const location = useLocation()

  return (
    // <TransitionGroup>
    //   {/* <CSSTransition unmountOnExit appear key={location.key} timeout={300} classNames="fade"> */}

    //   {/* </CSSTransition> */}
    // {/* </TransitionGroup> */}

    <Switch location={location}>
      <Route path="/account/register" component={Register} />
      <Route path="/account/login" component={Login} />
      <Route path="/account/userInfo" component={UserInfo} />
      
      <Route path="/article/edit" component={ArticleEdit} />

      <Route path="/" component={Home} />
    </Switch>
  )
}

export default function Routes(){

  return (
    <BrowserRouter basename="/view">
      <Route path="/">
        <MainLayout>
          <AnimationRoutes />
        </MainLayout>
      </Route>
    </BrowserRouter>
  )
}