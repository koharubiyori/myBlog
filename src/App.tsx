import React from 'react'
import './styles/main.scss'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import store from './redux'
import Routes from './routes'
import { SnackbarProvider } from 'notistack'


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

  componentDidMount (){
    // const snackbarShow = (this.refs.snackbar as InstanceType<typeof Snackbar>).show
    // let snackbar: any = (message: string) => snackbarShow({ message, type: 'default', position: ['top', 'center'] })
    // snackbar.info = (message: any, position: any) => snackbarShow({ message, type: 'info', position })
    // snackbar.success = (message: any, position: any) => snackbarShow({ message, type: 'success', position })
    // snackbar.warning = (message: any, position: any) => snackbarShow({ message, type: 'warning', position })
    // snackbar.danger = (message: any, position: any) => snackbarShow({ message, type: 'danger', position })
    
    // window.$snackbar = snackbar as Window['$snackbar']
  }

  render (){
    return (
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SnackbarProvider maxSnack={3}>
            <Routes />
          </SnackbarProvider>
        </Provider>
      </ThemeProvider>
    )
  }
}
