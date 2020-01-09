import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'nprogress/nprogress.css'
import nProgress from 'nprogress'
import './styles/global'
import { updateUserInfo } from '~/redux/user/HOC'

// 用于拼接class
window.c = (...args: (string | null | undefined)[]) => args.join(' ')

// 初始化全局变量
window._GLOBAL = {
  homeRefreshMark: false
}

nProgress.configure({ showSpinner: false })

// 等待权限获取完成
updateUserInfo().finally(() => ReactDOM.render(<App />, document.getElementById('root')))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
