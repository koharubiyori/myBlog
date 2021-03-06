import React, { useState, useEffect, PropsWithChildren } from 'react'
import { TextField, ButtonBase, Button, makeStyles } from '@material-ui/core'
import user from '~/api/user'
import md5 from 'md5'
import textChecker from '~/utils/textChecker'
import { com, flex } from '~/styles'
import createRouter from '~/utils/createRouter'
import BgImg from '~/components/BgImg'
import controlReqStatus from '~/utils/controlReqStatus'
import getNotify from '~/externalContexts/notify'
import useSEO from '~/hooks/useSEO'
import groupTrim from '~/utils/trimmer'

export interface Props {
  
}

type FinalProps = Props

function Register(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter(),
    notify = getNotify(),
    [account, setAccount] = useState(''),
    [name, setName] = useState(''),
    [password, setPassword] = useState(''),
    [RSCode, setRSCode] = useState(''),
    [registerStatus, setRegisterStatus] = useState(1),
    [RSCodeSvg, setRSCodeSvg] = useState(''),
    [RSCodeGetCount, setRSCodeGetCount] = useState(0)

  useEffect(() =>{
    getRegisterCaptcha()
  }, [])

  useSEO(setTitle => setTitle('登录', '和我签订契约，成为魔法少女吧！ ／人◕ ‿‿ ◕人＼'))

  function getRegisterCaptcha (): void{
    if(RSCodeGetCount >= 3) return notify('点的这么快，人家都忙不过来啦  >_<')
    user.getRegisterCaptcha().then(data => setRSCodeSvg(data.svg))
    setRSCodeGetCount(prevVal => prevVal + 1)
    setTimeout(() => setRSCodeGetCount(prevVal => prevVal - 1), 10000)
  }

  function register (): void{
    let code = RSCode

    let trimmed = groupTrim({ account, name, password, code })

    if(!trimmed.account) return notify('帐号不能为空')
    if(!trimmed.name) return notify('昵称不能为空')
    if(!trimmed.password) return notify('密码不能为空')
    if(!trimmed.code) return notify('验证码不能为空')

    if(!textChecker.account(trimmed.account)) return notify('帐号中包含非法字符')
    if(!textChecker.name(trimmed.name)) return notify('昵称中包含非法字符')
    if(!textChecker.password(trimmed.password)) return notify('密码中包含非法字符')

    trimmed.password = md5(trimmed.password)

    controlReqStatus(
      setRegisterStatus,
      user.register(trimmed)
    )
      .then(() =>{
        notify.success('注册成功，即将前往登录')
        setTimeout(() => router.replace('/account/login'), 1500)
      })
      .catch(e =>{
        console.log(e)
      })
  }

  return (
    <div className={classes.container}>
      <BgImg hidden />
      <h2 className={com.mainTitle} style={{ marginTop: 40 }}>注册</h2>
      <p className={com.subTitle}>僕と契約して、魔法少女になってほしいんだ&emsp;／人◕ ‿‿ ◕人＼</p>
      <TextField fullWidth 
        className={classes.input}
        label="帐号" 
        placeholder="8-16位的字母、数字、下划线"
        variant="outlined" 
        value={account} 
        onChange={e => setAccount(e.target.value)}
      />

      <TextField fullWidth 
        className={classes.input}
        label="昵称" 
        placeholder="奇怪的颜文字是不行的哦_(:з」∠)_"
        variant="outlined" 
        value={name} 
        onChange={e => setName(e.target.value)}
      />
      
      <TextField fullWidth 
        className={classes.input}
        style={{ marginTop: 40 }}
        label="密码" 
        placeholder="8-16位字母、数字、以及「_!@#$%^&*?」"
        variant="outlined" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)}
      />

      <div className={c(flex.row, flex.between, flex.crossEnd)} style={{ marginTop: 40 }}>
        <TextField
          label="验证码" 
          variant="filled" 
          value={RSCode}
          onChange={e => setRSCode(e.target.value)}
          onKeyDown={e => e.keyCode === 13 && register()}
        />

        <ButtonBase focusRipple onClick={getRegisterCaptcha}>
          <div 
            className={com.pointer}
            title="看不清？点击再来一个"
            dangerouslySetInnerHTML={{ __html: RSCodeSvg }}
          />
        </ButtonBase>
      </div>

      <div className={c(flex.row, flex.between)} style={{ marginTop: 40 }}>
        <Button variant="contained" color="primary" size="large"
          disabled={registerStatus === 2}
          onClick={register}
        >注册</Button>
        
        <Button color="primary" 
          onClick={() => router.replace('/account/login')}
        >已有帐号？前往登录</Button>
      </div>
    </div>
  )
}

export default Register

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