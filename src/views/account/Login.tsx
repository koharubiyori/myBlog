import React, { Component, PropsWithChildren } from 'react'
import classes from './Login.module.scss'
import { RouteChildrenProps } from 'react-router'
import createRouter from '~/utils/createRouter'
import { TextField, Button } from '@material-ui/core'
import md5 from 'md5'
import user from '~/api/user'
import { set as setUserInfo } from '~/redux/user/HOC'

export interface Props {
  
}

export interface State {
  accountOrName: string
  password: string
  loginStatus: number
}

type FinalProps = Props & RouteChildrenProps

class Login extends Component<PropsWithChildren<FinalProps>, State> {
  router = createRouter(this.props)
  
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      accountOrName: '',
      password: '',
      loginStatus: 1
    }
  }

  login = () =>{
    let {accountOrName, password} = this.state
    if(!accountOrName) return $notify('帐号或昵称不能为空')
    if(!password) return $notify('密码不能为空')

    password = md5(password)
    this.setState({ loginStatus: 2 })
    user.login({ accountOrName, password })
      .then(data =>{
        this.setState({ loginStatus: 3 })
        $notify.success('登录成功')
        setUserInfo(data)
        this.router.search('/')
      })
      .catch(e => {
        console.log(e)
        this.setState({ loginStatus: 0 })
      })
  }

  render (){
    return (
      <div {...c(classes.container)}>
        <h2 {...c('com-mainTitle')} style={{ marginTop: 40 }}>登录</h2>
        <TextField fullWidth 
          {...c(classes.input)}
          label="帐号或昵称" 
          variant="outlined" 
          value={this.state.accountOrName} 
          onChange={e => this.setState({ accountOrName: e.target.value })}
        />
        
        <TextField fullWidth 
          {...c(classes.input)}
          style={{ marginTop: 40 }}
          label="密码" 
          variant="outlined" 
          type="password" 
          value={this.state.password} 
          onChange={e => this.setState({ password: e.target.value })}
        />

        <div {...c('flex-row flex-between')} style={{ marginTop: 40 }}>
          <Button variant="contained" color="primary" size="large"
            disabled={this.state.loginStatus === 2}
            onClick={this.login}
          >登录</Button>
          
          <Button color="primary" 
            onClick={() => this.router.search('/account/register')}
          >没有帐号？前往注册</Button>
        </div>
      </div>
    )
  }
}

export default Login