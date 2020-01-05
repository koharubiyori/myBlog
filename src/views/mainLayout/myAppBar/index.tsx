import React, { PropsWithChildren, useState, useEffect, FC } from 'react'
import { AppBar, Toolbar, Typography, InputBase, IconButton, Button, makeStyles } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import { flex } from '~/styles'
import createRouter from '~/utils/createRouter'
import { basePath } from '~/routes'
import getNotify from '~/externalContexts/notify'

export const appBarHeight = 55

export interface Props {
  
}

interface RouteSearchParams {
  keyword?: string
}

type FinalProps = Props & UserConnectedProps

function MyAppBar(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    notify = getNotify(),
    router = createRouter<RouteSearchParams>(),
    [searchInput, setSearchInput] = useState('')

  useEffect(() =>{
    if(router.location.pathname === `${basePath}/search`){
      setSearchInput(router.params.search.keyword || '')
    }
  }, [])

  function pressEnterToSearch(keyCode: number){
    if(keyCode !== 13){ return }
    if(searchInput === '') return notify('搜索关键词不能为空')
    router.push('/search', { search: { keyword: searchInput } })
  }

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
          value={searchInput}
          onChange={e => setSearchInput(e.target.value.trim())}
          onKeyDown={e => pressEnterToSearch(e.keyCode)}
        />
        
        <Button variant="outlined" style={{ borderColor: '#eee', marginRight: 20 }}>关于我</Button>

        <IconButton>
          <NotificationsIcon />
        </IconButton>

        {props.state.user.account ? 
          <IconButton onClick={() => router.navigate('/account/userInfo')}>
            <img src={props.state.user.avatar || require('~/images/sub/akari.jpg')} alt="icon" style={{ width: 24, height: 24, borderRadius: '50%' }} />
          </IconButton>
        :
          <IconButton onClick={() => router.navigate('/account/register')}>
            <AccountCircleIcon />
          </IconButton>
        }

        {props.$user.getRole() === 'admin' ? 
          <IconButton onClick={() => router.navigate('/settings')}>
            <SettingsIcon />
          </IconButton>
        : null}
      </Toolbar>
    </AppBar>
  )
}

export default userHOC(MyAppBar) as FC<Props>

const useStyles = makeStyles({
  appBar: {
    zIndex: 1201,    // sidebar的z-index为1200
    minWidth: 1350,
  
    '@global [class*="root"]:not(foo)': {
      color: 'white',
    },

    '@global': {
      '.MuiToolbar-regular': {
        minHeight: appBarHeight
      }
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

