import React, { PropsWithChildren, useState, useEffect, FC } from 'react'
import { AppBar, Toolbar, Typography, InputBase, IconButton, Button, makeStyles, Avatar, Badge, Menu, MenuItem } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import { flex } from '~/styles'
import createRouter from '~/utils/createRouter'
import { basePath } from '~/routes'
import getNotify from '~/externalContexts/notify'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import getConfirm from '~/externalContexts/confirm'

export const appBarHeight = 55

export interface Props {
  
}

interface RouteSearchParams {
  keyword?: string
}

type FinalProps = Props & UserConnectedProps & DataConnectedProps

function MyAppBar(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    notify = getNotify(),
    confirm = getConfirm(),
    router = createRouter<RouteSearchParams>(),
    [searchInput, setSearchInput] = useState(''),
    [userMenuEl, setUserMenuEl] = useState<HTMLElement | null>(null)

  useEffect(() =>{
    if(router.location.pathname === `${basePath}/search`){
      setSearchInput(router.params.search.keyword || '')
    }
  }, [])

  useEffect(() =>{
    const mousewheelHandler = () => setUserMenuEl(null)
    window.addEventListener('mousewheel', mousewheelHandler)

    return () => window.removeEventListener('mousewheel', mousewheelHandler)
  }, [])

  function pressEnterToSearch(keyCode: number){
    if(keyCode !== 13){ return }
    let trimmedSearchInput = searchInput.trim()
    
    if(trimmedSearchInput === '') return notify('搜索关键词不能为空')
    router.push('/search', { search: { keyword: trimmedSearchInput } })
  }

  function logout(){
    setUserMenuEl(null)
    confirm({
      content: '确定要登出吗？',
      onCheck (){
        props.$user.clear()
        notify.success('已登出')
        router.replace('/')
      }
    })
  }

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <div className={flex.grow}>
          <img src={require('~/images/button/title.png')} 
            alt="title" 
            style={{ height: 20, verticalAlign: 'middle', cursor: 'pointer' }}
            onClick={() => router.navigate('/')}
          />
        </div>
        <InputBase 
          style={{ marginRight: 100 }}
          className={classes.searchInput}
          classes={{ focused: classes.searchInputFocused }}
          placeholder="搜索..."
          startAdornment={<SearchIcon style={{ marginRight: 20 }} />}
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => pressEnterToSearch(e.keyCode)}
        />
        
        <Button 
          variant="outlined" 
          style={{ borderColor: '#eee', marginRight: 20 }}
          onClick={() => router.navigate('/aboutMe')}
        >关于我</Button>

        {props.state.user.account ? 
          <>
            <IconButton onClick={() => router.navigate('/notification')}>
              <Badge 
                color="error"
                invisible={props.state.data.uncheckedNotificationTotal === 0}
                badgeContent={props.state.data.uncheckedNotificationTotal} 
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={e => setUserMenuEl(e.currentTarget)}>
              <Avatar 
                src={props.state.user.avatar} 
                style={{ width: 25, height: 25, backgroundColor: 'white', color: '#666' }}
              >{props.state.user.name[0]}</Avatar>
            </IconButton>
            <Menu keepMounted
              anchorEl={userMenuEl}
              open={!!userMenuEl}
              onClose={() => setUserMenuEl(null)}
            >
              <MenuItem onClick={() => router.navigate('/account/userInfo').then(() => setUserMenuEl(null))}>个人信息</MenuItem>
              <MenuItem onClick={() => router.navigate('/collectList').then(() => setUserMenuEl(null))}>收藏列表</MenuItem>
              <MenuItem onClick={logout}>登出</MenuItem>
            </Menu>
          </>
        :
          <IconButton onClick={() => router.navigate('/account/login')}>
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

export default dataHOC(userHOC(MyAppBar)) as FC<Props>

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

