import React, { useState,  PropsWithChildren } from 'react'
import { RouteChildrenProps } from 'react-router'
import createRouter from '~/utils/createRouter'
import { TextField, Button, makeStyles } from '@material-ui/core'
import md5 from 'md5'
import user from '~/api/user'
import { set as setUserInfo } from '~/redux/user/HOC'

export interface Props {
  
}

type FinalProps = Props & RouteChildrenProps

function Login(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter(props),
    [accountOrName, setAccountOrName] = useState(''),
    [password, setPassword] = useState(''),
    [loginStatus, setLoginStatus] = useState(1)

  function login(): void{
    if(!accountOrName) return $notify('帐号或昵称不能为空')
    if(!password) return $notify('密码不能为空')

    setLoginStatus(2)
    user.login({ accountOrName, password: md5(password) })
      .then(data =>{
        setLoginStatus(3)
        $notify.success('登录成功')
        setUserInfo(data)
        router.search('/')
      })
      .catch(e => {
        console.log(e)
        setLoginStatus(0)
      })
  }

  return (
    <div className={classes.container}>
      <h2 className="com-mainTitle" style={{ marginTop: 40 }}>登录</h2>
      <TextField fullWidth 
        {...c(classes.input)}
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
      />

      <div className="flex-row flex-between" style={{ marginTop: 40 }}>
        <Button variant="contained" color="primary" size="large"
          disabled={loginStatus === 2}
          onClick={login}
        >登录</Button>
        
        <Button color="primary" 
          onClick={() => router.search('/account/register')}
        >没有帐号？前往注册</Button>
      </div>
    </div>
  )
}

export default Login

const useStyles = makeStyles({
  container: {
    maxWidth: 500,
    margin: '0 auto'
  },

  input: {
    marginTop: 40,
    maxWidth: 500,
  }
})