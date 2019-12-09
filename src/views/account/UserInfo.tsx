import React, { Component, PropsWithChildren, ChangeEvent } from 'react'
import classes from './UserInfo.module.scss'
import { default as userHOC, UserConnectedProps } from '~/redux/user/HOC'
import resetComponentProps from '~/utils/resetComponentProps'
import { TextField, Button } from '@material-ui/core'
import user from '~/api/user'

export interface Props {
  
}

export interface State {
  name: string
  avatar: string
  saveStatus: number
}

type FinalProps = Props & UserConnectedProps

class UserInfo extends Component<PropsWithChildren<FinalProps>, State> {
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      name: props.state.user.name,
      avatar: props.state.user.avatar,
      saveStatus: 1
    }
  }

  uploadAvatar (e: ChangeEvent<HTMLInputElement>){
    let file = (e.target.files as FileList).item(0) as File
    user.uploadAvatar({ file }).then(data =>{
      console.log(data)
    })
  }

  save = () =>{
    
  }

  render (){
    return (
      <div>
        <h2 {...c('com-mainTitle')}>编辑个人信息</h2>

        <label {...c(classes.avatar)}>
          <img src={this.state.avatar || require('~/images/sub/akari.jpg')} />
          <input type="file" style={{ position: 'fixed', left: -9999 }} onChange={this.uploadAvatar} />
        </label>

        <TextField fullWidth 
          label="昵称" 
          value={this.state.name} 
          onChange={e => this.setState({ name: e.target.value })}
        />

        <div style={{ marginTop: 40 }}>
          <Button variant="contained" color="primary" size="large"
            disabled={this.state.saveStatus === 2}
            onClick={this.save}
          >保存</Button>
        </div>
      </div>
    )
  }
}

export default resetComponentProps(
  userHOC(UserInfo)
) 