import React, { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Typography, InputBase, IconButton, Button } from '@material-ui/core'
import classes from './index.module.scss'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { MyRouter } from '~/utils/createRouter'
import { default as userHOC, UserConnectedProps } from '~/redux/user/HOC'
import resetComponentProps from '~/utils/resetComponentProps'

export interface Props {
  router: MyRouter
}

type FinalProps = Props & UserConnectedProps

function MyAppBar({
  children,
  router,
  state
}: PropsWithChildren<FinalProps>){
  return (
    <AppBar {...c(classes.appBar)}>
      <Toolbar>
        <Typography variant="h6" {...c('flex-grow')}>title</Typography>
        <InputBase 
          style={{ marginRight: 100 }}
          {...c(classes.searchInput)} 
          classes={{ focused: classes.searchInputFocused }}
          placeholder="搜索..."
          startAdornment={<SearchIcon style={{ marginRight: 20 }} />}
        />
        
        <Button variant="outlined" style={{ borderColor: '#eee', marginRight: 20 }}>关于我</Button>

        <IconButton>
          <NotificationsIcon />
        </IconButton>

        {state.user.account ? 
          <IconButton onClick={() => router.search('/account/info')}>
            <img src={state.user.avatar || require('~/images/sub/akari.jpg')} alt="icon" style={{ width: 24, height: 24, borderRadius: '50%' }} />
          </IconButton>
        :
          <IconButton onClick={() => router.search('/account/login')}>
            <AccountCircleIcon />
          </IconButton>
        }
      </Toolbar>
    </AppBar>
  )
}

export default resetComponentProps<Props>(
  userHOC(MyAppBar)
) 