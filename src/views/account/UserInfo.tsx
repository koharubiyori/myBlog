import { Button, makeStyles, TextField } from '@material-ui/core'
import React, { ChangeEvent, FC, PropsWithChildren, useState } from 'react'
import common from '~/api/common'
import user from '~/api/user'
import BgImg from '~/components/BgImg'
import getNotify from '~/externalContexts/notify'
import useSEO from '~/hooks/useSEO'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'
import { com } from '~/styles'
import styleVars from '~/styles/styleVars'
import controlReqStatus from '~/utils/controlReqStatus'
import textChecker from '~/utils/textChecker'

export interface Props {
  
}

type FinalProps = Props & UserConnectedProps

function UserInfo(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    notify = getNotify(),
    [name, setName] = useState(props.state.user.name),
    [avatar, setAvatar] = useState(props.state.user.avatar),
    [imgUploadStatus, setImgUploadStatus] = useState(1),
    [saveStatus, setSaveStatus] = useState(1)

  useSEO(setTitle => setTitle('用户信息'))

  function uploadAvatar(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files!.length === 0){ return }
    let file = e.target.files!.item(0)!
    e.target.value = ''
    setImgUploadStatus(2)
    common.upload({ file })
      .then(data =>{
        setImgUploadStatus(3)
        setAvatar(data.fileUrl)
      }).catch(e =>{
        console.log(e)
        setImgUploadStatus(0)
      })
  }

  function save(){
    if(!name) return notify('昵称不能为空')
    if(!textChecker.name(name)) return notify('昵称包含非法字符')

    if(name === props.state.user.name && avatar === props.state.user.avatar) return notify('信息没有变化')

    controlReqStatus(
      setSaveStatus,
      user.setUserInfo({
        ...(name ? { name } : {}),
        ...(avatar ? { avatar }: {})
      })
    )
      .then(() =>{
        props.$user.set({ name, avatar })
        notify.success('信息已保存')
      })
      .catch(e =>{
        console.log(e)
      })
  }

  return (
    <div>
      <h2 className={com.mainTitle}>编辑个人信息</h2>
      <BgImg hidden />

      <label className={classes.avatar} data-status={imgUploadStatus}>
        <img alt="avatar" src={avatar || require('~/images/sub/akari.jpg')} />
        <input 
          type="file" accept=".png, .jpg, .jpeg" 
          style={{ position: 'fixed', left: -9999 }} 
          onChange={uploadAvatar} 
          ref={refs.fileInput}
        />
      </label>

      <TextField fullWidth 
        label="昵称" 
        value={name} 
        onChange={e => setName(e.target.name)}
      />

      <div style={{ marginTop: 40 }}>
        <Button variant="contained" color="primary" size="large"
          disabled={saveStatus === 2}
          onClick={save}
        >保存</Button>
      </div>
    </div>
  )
}

export default userHOC(UserInfo) as FC<Props>

const transition = 'all 0.25s'
const useStyles = makeStyles({
  '@global body': {
    backgroundImage: 'initial !important'
  },

  avatar: {
    display: 'block',
    width: 250,
    height: 250,
    borderRadius: '50%',
    border: `3px ${styleVars.main} solid`,
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    transition,
    margin: '50px auto',

    '@global > img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition
    },

    '&::before': {
      content: '"更换头像"',
      textDecoration: 'underline',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      fontSize: 18,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      transition,
      zIndex: 1,
      cursor: 'pointer',
      borderRadius: '50%'
    },

    '&:hover': {
      borderColor: '#ccc',
  
      '@global > img': {
        transform: 'scale(1.15)',
      },
  
      '&::before': {
        opacity: 1
      }
    },

    '&[data-status=2]': {
      '&::before': {
        opacity: 1,
        content: '"上传中"'
      }
    }
  }
})