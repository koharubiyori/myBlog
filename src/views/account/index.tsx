import React, { Component, PropsWithChildren } from 'react'
import classes from './index.module.scss'
import { TextField, ButtonBase, Button } from '@material-ui/core'
import user from '~/api/user'
import resetComponentProps from '~/utils/resetComponentProps'
import md5 from 'md5'
import textChecker from '~/utils/textChecker'
import { RouteChildrenProps } from 'react-router'
import createRouter from '~/utils/createRouter'

export interface Props {
  
}

export interface State {
  account: string
  name: string
  password: string
  RSCode: string
  registerStatus: number
  RSCodeSvg: string
  RSCodeGetCount: number
  isLogin: boolean
}

type FinalProps = Props & RouteChildrenProps

class Register extends Component<PropsWithChildren<FinalProps>, State> {
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      account: '',
      name: '',
      password: '',
      RSCode: '',
      registerStatus: 1,
      
      RSCodeSvg: '',
      RSCodeGetCount: 0,

      isLogin: false
    }

    this.getRegisterSecurityCode()
  }

  router = createRouter(this)

  getRegisterSecurityCode = () =>{
    if(this.state.RSCodeGetCount >= 3){
      $notify('点了这么多下，来喝点什么休息一下吧。')
      return setTimeout(() => $notify('サー(伝統芸能)... 只有冰红茶了可以吗'), 2000)
    }
    user.getRegisterSecurityCode().then(data => this.setState({ RSCodeSvg: data.svg }))
    this.setState({ RSCodeGetCount: this.state.RSCodeGetCount + 1 })
    setTimeout(() => this.setState({ RSCodeGetCount: this.state.RSCodeGetCount - 1 }), 10000)
  }

  register = () =>{
    let {account, name, password, RSCode: code} = this.state
    if(!account) return $notify('帐号不能为空')
    if(!name) return $notify('昵称不能为空')
    if(!password) return $notify('密码不能为空')
    if(!code) return $notify('验证码不能为空')

    if(!textChecker.account(account)) return $notify('帐号中包含非法字符')
    if(!textChecker.name(name)) return $notify('昵称中包含非法字符')
    if(!textChecker.password(password)) return $notify('密码中包含非法字符')

    password = md5(password)
    user.register({ account, name, password, code })
      .then(() =>{
        $notify.success('注册成功')
      })
  }

  render (){
    return (
      <div {...c(classes.container)}>
        <h2 {...c('com-mainTitle')} style={{ marginTop: 40 }}>注册</h2>
        <p {...c('com-subTitle')}>僕と契約して、魔法少女になってほしいんだ&emsp;／人◕ ‿‿ ◕人＼</p>
        <TextField fullWidth 
          {...c(classes.input)}
          label="帐号" 
          placeholder="8-16位的字母、数字、下划线"
          variant="outlined" 
          value={this.state.account} 
          onChange={e => this.setState({ account: e.target.value })}
        />

        <TextField fullWidth 
          {...c(classes.input)}
          label="昵称" 
          placeholder="奇怪的颜文字是不行的哦_(:з」∠)_"
          variant="outlined" 
          value={this.state.name} 
          onChange={e => this.setState({ name: e.target.value })}
        />
        
        <TextField fullWidth 
          {...c(classes.input)}
          style={{ marginTop: 40 }}
          label="密码" 
          placeholder="8-16位字母、数字、以及「_!@#$%^&*?」"
          variant="outlined" 
          type="password" 
          value={this.state.password} 
          onChange={e => this.setState({ password: e.target.value })}
        />

        <div {...c('flex-row flex-between flex-cross-bottom')} style={{ marginTop: 40 }}>
          <TextField
            label="验证码" 
            variant="filled" 
            value={this.state.RSCode}
            onChange={e => this.setState({ RSCode: e.target.value })}
          />

          <ButtonBase focusRipple onClick={this.getRegisterSecurityCode}>
            <div 
              {...c('com-pointer')} 
              title="看不清？点击再来一个"
              dangerouslySetInnerHTML={{ __html: this.state.RSCodeSvg }}
            />
          </ButtonBase>
        </div>

        <div {...c('flex-row flex-between')} style={{ marginTop: 40 }}>
          <Button variant="contained" color="primary" size="large"
            disabled={this.state.registerStatus === 2}
            onClick={this.register}
          >注册</Button>
          
          <Button color="primary" 
            onClick={() => this.router.search('/account', { type: 'login' })}
          >已有帐号？前往登录</Button>
        </div>
      </div>
    )
  }
}



export default resetComponentProps<Props>(Register)