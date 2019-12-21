import React from 'react'
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import asyncLoader from './asyncLoader'
import MainLayout from '~/views/mainLayout'
import Home from '~/views/home'

const l = asyncLoader

export const routeMaps = {
  '/account/register': l('account/Register'),
  '/account/login': l('account/Login'),
  '/account/userInfo': l('account/UserInfo'),

  '/article/edit': l('article/edit'),
  '/article/view': l('article/view')
}

export type RoutePaths = keyof (typeof routeMaps & { '/': any })

function AnimationRoutes(){
  const location = useLocation()

  return (
    // <TransitionGroup>
    //   {/* <CSSTransition unmountOnExit appear key={location.key} timeout={300} classNames="fade"> */}

    //   {/* </CSSTransition> */}
    // {/* </TransitionGroup> */}

    <Switch location={location}>
      {Object.keys(routeMaps).map((path) => <Route key={path} path={path} component={(routeMaps as any)[path]} />)}
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