import React, { Component, PropsWithChildren, ChangeEvent } from 'react'
import classes from './UserInfo.module.scss'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import resetComponentProps from '~/utils/resetComponentProps'
import { TextField, Button } from '@material-ui/core'
import user from '~/api/user'
import textChecker from '~/utils/textChecker'

export interface Props {
  
}

export interface State {
  name: string
  avatar: string
  imgUploadStatus: number
  saveStatus: number
}

type FinalProps = Props & UserConnectedProps

class UserInfo extends Component<PropsWithChildren<FinalProps>, State> {
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      name: props.state.user.name,
      avatar: props.state.user.avatar,
      imgUploadStatus: 1,
      saveStatus: 1
    }
  }

  uploadAvatar = (e: ChangeEvent<HTMLInputElement>) =>{
    if(e.target.files!.length === 0){ return }
    let file = e.target.files!.item(0)!
    this.setState({ imgUploadStatus: 2 })
    user.uploadAvatar({ file })
      .then(data =>{
        this.setState({ imgUploadStatus: 3, avatar: data.fileUrl })
      }).catch(e =>{
        console.log(e)
        this.setState({ imgUploadStatus: 0 })
      })
  }

  save = () =>{
    const {name, avatar} = this.state
    if(!name) return $notify('昵称不能为空')
    if(!textChecker.name(name)) return $notify('昵称包含非法字符')

    if(name === this.props.state.user.name && avatar === this.props.state.user.avatar) return $notify('信息没有变化')

    this.setState({ saveStatus: 2 })
    user.setUserInfo({
      ...(name ? { name } : {}),
      ...(avatar ? { avatar }: {})
    })
      .then(() =>{
        this.setState({ saveStatus: 3 })
        this.props.$user.set({ name, avatar })
        $notify.success('信息已保存')
      })
      .catch(e =>{
        console.log(e)
        this.setState({ saveStatus: 0 })
      })
  }

  render (){
    return (
      <div>
        <h2 {...c('com-mainTitle')}>编辑个人信息</h2>

        <label {...c(classes.avatar)} data-status={this.state.imgUploadStatus}>
          <img src={this.state.avatar || require('~/images/sub/akari.jpg')} />
          <input type="file" accept=".png, .jpg, .jpeg" style={{ position: 'fixed', left: -9999 }} onChange={this.uploadAvatar} />
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