import React, { useRef, useEffect } from 'react'
import './styles/main.scss'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import store from './redux'
import Routes from './routes'
import { SnackbarProvider } from 'notistack'
import mountNotifyMethod from './utils/mountNotifyMethod'
import init from './init'


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#6B69D6',
      dark: '#504FA0',
      light: '#9796E3',
      contrastText: 'white'
    }
  }
})

export default function App(){
  const refs = {
    snackbar: useRef()
  }

  useEffect(() =>{
    mountNotifyMethod((refs.snackbar.current as any).enqueueSnackbar)
    init()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3} ref={refs.snackbar}>
          <Routes />
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  )
}