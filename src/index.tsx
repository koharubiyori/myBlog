import './utils/mountColors'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'nprogress/nprogress.css'
import nProgress from 'nprogress'

// 用于拼接class
window.c = (...args: string[]) => ({ className: args.join(' ') })


nProgress.configure({ showSpinner: false })

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
