import React, { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Typography, InputBase, IconButton, Button } from '@material-ui/core'
import classes from './index.module.scss'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

export interface Props {
  
}

export default function MyAppBar(props: PropsWithChildren<Props>){
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

        <IconButton>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}