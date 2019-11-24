import React from 'react'
import './styles/main.scss'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import store from './redux'
import Routes from './routes'


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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Routes />
      </Provider>
    </ThemeProvider>
  )
}

export default App
