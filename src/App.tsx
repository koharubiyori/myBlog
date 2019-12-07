import React from 'react'
import './styles/main.scss'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import store from './redux'
import Routes from './routes'
import { SnackbarProvider, WithSnackbarProps } from 'notistack'


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

export default class App extends React.Component {
  _refs = {
    snackbar: React.createRef()
  }
  
  componentDidMount (){
    const msg: WithSnackbarProps['enqueueSnackbar'] = (this._refs.snackbar.current as any).enqueueSnackbar
    const createOptions = (
      type: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default', 
      position: ['top' | 'bottom', 'left' | 'center' | 'right', ] = ['top', 'center']
    ) => ({ 
      variant: type, 
      anchorOrigin: { vertical: position[0], horizontal: position[1] },
      autoHideDuration: 3000 
    })

    let snackbar: any = (message: any, position?: any) => msg(message, createOptions('default', position))
    snackbar.info = (message: any, position?: any) => msg(message, createOptions('info', position))
    snackbar.success = (message: any, position?: any) => msg(message, createOptions('success', position))
    snackbar.warning = (message: any, position?: any) => msg(message, createOptions('warning', position))
    snackbar.error = (message: any, position?: any) => msg(message, createOptions('error', position))
    window.$snackbar = snackbar
  }

  render (){
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SnackbarProvider maxSnack={3} ref={this._refs.snackbar}>
            <Routes />
          </SnackbarProvider>
        </Provider>
      </ThemeProvider>
    )
  }
}
