import { createMuiTheme, ThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import React, { useEffect, useRef } from 'react'
import { Provider as KeepAliveProvider } from 'react-keep-alive'
import { Provider as ReduxProvider } from 'react-redux'
import { bindContext as bindConfirmContext } from '~/externalContexts/confirm'
import { bindContext as bindNotifyContext } from '~/externalContexts/notify'
import MyConfirm, { MyConfirmRef } from './components/dialog/Confirm'
import init from './init'
import store from './redux'
import Routes from './routes'
import styleVars from './styles/styleVars'
import createRouter from './utils/createRouter'
// import './utils/mouseClick'

// 解决jss生成的class名重复问题
const generateClassName = createGenerateClassName({
  disableGlobal: false,
  productionPrefix: 'c',
})

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
    
    setTimeout(() =>{
      bindConfirmContext(refs.myConfirm.current!)
    })
    
    init()
  }, [])

  // useEffect(() =>{
  //   if(window.location.pathname === '/'){
  //     router.replace('/')
  //   }
  // }, [])

  return (
    <StylesProvider generateClassName={generateClassName}>
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
    </StylesProvider>
  )
}