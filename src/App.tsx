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
      autoHideDuration: 4000 
    })

    let notify: any = (message: any, position?: any) => msg(message, createOptions('default', position))
    notify.info = (message: any, position?: any) => msg(message, createOptions('info', position))
    notify.success = (message: any, position?: any) => msg(message, createOptions('success', position))
    notify.warning = (message: any, position?: any) => msg(message, createOptions('warning', position))
    notify.error = (message: any, position?: any) => msg(message, createOptions('error', position))
    window.$notify = notify
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
