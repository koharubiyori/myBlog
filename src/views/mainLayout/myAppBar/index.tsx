import React, { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Typography, InputBase, IconButton, Button, makeStyles } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { MyRouter } from '~/utils/createRouter'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import resetComponentProps from '~/utils/resetComponentProps'
import { Link } from 'react-router-dom'
import { flex } from '~/styles'
import styleVars from '~/styles/styleVars'

export interface Props {
  router: MyRouter
}

type FinalProps = Props & UserConnectedProps

function MyAppBar(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()
  
  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={c(flex.grow)}>title</Typography>
        <InputBase 
          style={{ marginRight: 100 }}
          className={classes.searchInput}
          classes={{ focused: classes.searchInputFocused }}
          placeholder="搜索..."
          startAdornment={<SearchIcon style={{ marginRight: 20 }} />}
        />
        
        <Button variant="outlined" style={{ borderColor: '#eee', marginRight: 20 }}>关于我</Button>

        <IconButton>
          <NotificationsIcon />
        </IconButton>

        {props.state.user.account ? 
          <Link replace to="/account/userInfo" >
            <IconButton>
              <img src={props.state.user.avatar || require('~/images/sub/akari.jpg')} alt="icon" style={{ width: 24, height: 24, borderRadius: '50%' }} />
            </IconButton>
          </Link>
        :
          <Link replace to="/account/login">
            <IconButton>
              <AccountCircleIcon />
            </IconButton>
          </Link>
        }
      </Toolbar>
    </AppBar>
  )
}

export default resetComponentProps<Props>(
  userHOC(MyAppBar)
) 

const useStyles = makeStyles({
  '@global': {
    '.MuiAppBar-root': {
      backgroundColor: styleVars.main
    }
  },

  appBar: {
    zIndex: 1201,    // sideBar的z-index为1200
    minWidth: 1350,
  
    '@global [class*="root"]:not(foo)': {
      color: 'white',
    }
  },
  
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 150,
    height: 35,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 20,
    transition: 'all 0.2s',
  
    '@global input': {
      color: 'white',
  
      '&::-webkit-input-placeholder': {
        color: 'white',
        opacity: 0.8,
      }
    },
  
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    }
  },
  
  searchInputFocused: {
    width: 200,
  }
})

