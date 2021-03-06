import React, { useState,  PropsWithChildren } from 'react'
import { TextField, Button, makeStyles } from '@material-ui/core'
import md5 from 'md5'
import user from '~/api/user'
import { set as setUserInfo } from '~/redux/user/HOC'
import { com, flex } from '~/styles'
import createRouter from '~/utils/createRouter'
import styleVars from '~/styles/styleVars'
import BgImg from '~/components/BgImg'
import controlReqStatus from '~/utils/controlReqStatus'
import getNotify from '~/externalContexts/notify'
import useSEO from '~/hooks/useSEO'
import groupTrim from '~/utils/trimmer'

export interface Props {
  
}

type FinalProps = Props

function Login(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter(),
    notify = getNotify(),
    [accountOrName, setAccountOrName] = useState(''),
    [password, setPassword] = useState(''),
    [loginStatus, setLoginStatus] = useState(1)

  useSEO(setTitle => setTitle('登录'))

  function login(): void{
    let trimmed = groupTrim({ accountOrName, password })
    
    if(!trimmed.accountOrName) return notify('帐号或昵称不能为空')
    if(!trimmed.password) return notify('密码不能为空')

    controlReqStatus(
      setLoginStatus, 
      user.login({ 
        accountOrName: trimmed.accountOrName, 
        password: md5(trimmed.password) 
      })
    )
      .then(data =>{
        notify.success('登录成功')
        setUserInfo(data)
        router.replace('/')
      })
      .catch(e => {
        console.log(e)
      })
  }

  return (
    <div className={classes.container}>
      <BgImg hidden />
      <h2 className={com.mainTitle} style={{ marginTop: 40 }}>登录</h2>
      <TextField fullWidth 
        className={classes.input}
        label="帐号或昵称" 
        variant="outlined" 
        value={accountOrName} 
        onChange={e => setAccountOrName(e.target.value)}
      />
      
      <TextField fullWidth 
        className={classes.input}
        style={{ marginTop: 40 }}
        label="密码" 
        variant="outlined" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.keyCode === 13 && login()}
      />

      <div className={c(flex.row, flex.between)} style={{ marginTop: 40 }}>
        <Button variant="contained" color="primary" size="large"
          disabled={loginStatus === 2}
          onClick={login}
        >登录</Button>
        
        <Button color="primary" 
          onClick={() => router.replace('/account/register')}
        >没有帐号？前往注册</Button>
      </div>
    </div>
  )
}

export default Login

const useStyles = makeStyles({
  '@global body': {
    backgroundImage: 'initial !important'
  },
  
  container: {
    maxWidth: 500,
    margin: '0 auto',
  },

  input: {
    marginTop: 40,
    maxWidth: 500,
  }
})