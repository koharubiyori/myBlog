import React from 'react'
import { Router } from '@reach/router'
import asyncLoader from './asyncLoader'
import MainLayout from '~/views/mainLayout'
import Home from '~/views/home'

export const basePath = '/view'

const l = asyncLoader

export const routeMaps = {
  '/account/register': l('account/Register'),
  '/account/login': l('account/Login'),
  '/account/userInfo': l('account/UserInfo'),

  '/article/edit': l('article/edit'),
  '/article/view': l('article/view')
}

export type RoutePaths = keyof (typeof routeMaps & { '/': any })

export default function Routes(){

  return (
    <Router basepath={basePath}>
      <MainLayout path="/">
        {Object.keys(routeMaps).map(path => React.createElement((routeMaps as any)[path], { path, key: path }))}
        <Home path="/" />
      </MainLayout>
    </Router>
  )
}

