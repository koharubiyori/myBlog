import React, { useRef, useEffect } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux'
import Routes, { basePath } from './routes'
import { SnackbarProvider } from 'notistack'
import mountNotifyMethod from './utils/mountNotifyMethod'
import init from './init'
import styleVars from './styles/styleVars'
import { Provider as KeepAliveProvider } from 'react-keep-alive'
import MyConfirm, { MyConfirmRef } from './components/dialog/Confirm'
import './utils/mouseClick'
import createRouter from './utils/createRouter'
import { bindContext as bindNotifyContext } from '~/externalContexts/notify'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: styleVars.main,
      dark: styleVars.dark,
      light: styleVars.light,
      contrastText: 'white'
    }
  }
})

export default function App(){
  const router = createRouter()
  const refs = {
    snackbar: useRef(),
    myConfirm: useRef<MyConfirmRef>()
  }

  useEffect(() =>{
    bindNotifyContext((refs.snackbar.current as any).enqueueSnackbar)
    mountNotifyMethod((refs.snackbar.current as any).enqueueSnackbar)
    
    setTimeout(() =>{
      let confirm: any = refs.myConfirm.current!.show
      confirm.hide = refs.myConfirm.current!.hide
      window.$confirm = confirm
    })
    
    init()
  }, [])

  useEffect(() =>{
    if(window.location.pathname === '/'){
      router.replace('/')
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <ReduxProvider store={store}>
        <SnackbarProvider maxSnack={3} ref={refs.snackbar}>
          <KeepAliveProvider>
            <Routes />
            <MyConfirm getRef={refs.myConfirm} />
          </KeepAliveProvider>
        </SnackbarProvider>
      </ReduxProvider>
    </ThemeProvider>
  )
}