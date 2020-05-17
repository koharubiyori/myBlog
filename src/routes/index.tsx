import React from 'react'
import { Router, Redirect } from '@reach/router'
import asyncLoader from './asyncLoader'
import Route from './Route'
import MainLayout from '~/views/mainLayout'
import Home from '~/views/home'

export const basePath = ''

const l = asyncLoader

export const routeMaps = {
  '/account/register': l('account/Register'),
  '/account/login': l('account/Login'),
  '/account/userInfo': l('account/UserInfo', { role: ['admin', 'user'] }),

  '/article/edit': l('article/edit', { role: ['admin'] }),
  '/article/view': l('article/view'),

  '/search': l('search'),
  '/search/byTag': l('search/byTag'),
  
  '/settings': l('settings', { role: ['admin'] }),
  '/settings/katakoto': l('settings/katakoto', { role: ['admin'] }),
  
  '/notification': l('notification', { role: ['admin', 'user'] }),
  '/collectList': l('collectList', { role: ['admin', 'user'] }),
  '/aboutMe': l('aboutMe')
}

export type RoutePaths = keyof (typeof routeMaps & { '/': any })

export default function Routes(){

  return (
    <Router basepath={basePath}>
      <MainLayout path="/">
        {Object.keys(routeMaps).map(path => <Route key={path} path={path} route={routeMaps[path as keyof typeof routeMaps]} />)}
        <Route path="/" component={Home} />
        <Redirect noThrow from="/*" to="/" />
      </MainLayout>
    </Router>
  )
}

