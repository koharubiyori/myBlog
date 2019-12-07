import React, { Component, PropsWithChildren } from 'react'
import classes from './index.module.scss'
import { TextField, ButtonBase } from '@material-ui/core'
import user from '~/api/user'
import resetComponentProps from '~/utils/resetComponentProps'

export interface Props {
  
}

export interface State {
  name: string
  password: string
  status: number
  RSCodeSvg: string
  RSCodeGetCount: number
}

type FinalProps = Props

class Register extends Component<PropsWithChildren<FinalProps>, State> {
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      name: '',
      password: '',
      status: 1,
      
      RSCodeSvg: '',
      RSCodeGetCount: 0
    }

    this.getRegisterSecurityCode()
  }

  getRegisterSecurityCode = () =>{
    if(this.state.RSCodeGetCount >= 3) return $snackbar('老哥歇会吧，点的太快了')
    user.getRegisterSecurityCode().then(data => this.setState({ RSCodeSvg: data.svg }))
    this.setState({ RSCodeGetCount: this.state.RSCodeGetCount + 1 })
    setTimeout(() => this.setState({ RSCodeGetCount: this.state.RSCodeGetCount - 1 }), 10000)
  }

  render (){
    return (
      <div {...c(classes.container)}>
        <h2 {...c('com-mainTitle')} style={{ marginTop: 120 }}>注册</h2>
        <TextField fullWidth 
          {...c(classes.input)}
          label="帐号或用户名" 
          variant="outlined" 
          value={this.state.name} 
          onChange={e => this.setState({ name: e.target.value })}
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

        <div {...c('flex-row flex-between flex-cross-bottom')} style={{ marginTop: 40 }}>
          <TextField
            label="验证码" 
            variant="filled" 
          />

          <ButtonBase focusRipple onClick={this.getRegisterSecurityCode}>
            <div 
              {...c('com-pointer')} 
              title="看不清？点击再来一个"
              dangerouslySetInnerHTML={{ __html: this.state.RSCodeSvg }}
            />
          </ButtonBase>
        </div>
      </div>
    )
  }
}



export default resetComponentProps<Props>(Register)