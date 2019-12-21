import React, { useRef, useEffect } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import store from './redux'
import Routes from './routes'
import { SnackbarProvider } from 'notistack'
import mountNotifyMethod from './utils/mountNotifyMethod'
import init from './init'
import styleVars from './styles/styleVars'

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