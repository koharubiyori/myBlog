import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core'
import styleVars from '~/styles/styleVars'
import { TextFieldProps } from '@material-ui/core/TextField'

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface MyConfirmRef {
  show (params: Params): void
  hide (): void
}

interface Params {
  title?: string
  content: string
  checkText?: string
  closeText?: string
  input?: boolean
  inputProps?: TextFieldProps
  onCheck?: Function | null
  onClose?: Function | null
  onChangeInputText?: Function | null
}

type FinalProps = Props

function MyConfirm(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [visible, setVisible] = useState(false),
    [params, setParams] = useState<Params>({
      title: '',
      content: '',
      checkText: '',
      closeText: '',
      input: false,
      onCheck: null,
      onClose: null,
      onChangeInputText: null
    })

  if(props.getRef) props.getRef.current = { show, hide }
  
  function handlerCheck(){
    params.onCheck && params.onCheck()
    setVisible(false)
  }

  function show(params: Params){
    setParams(params)
    setVisible(true)
  }

  function hide(){
    setVisible(false)
    params.onClose && params.onClose()
  }

  return (
    <Dialog fullWidth
      open={visible}
      onClose={hide}
      classes={{
        paper: classes.maxWidth
      }}
    >
      <DialogTitle>{params.title || '提示'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{params.content}</DialogContentText>
        {params.input ?
          <TextField autoFocus fullWidth
            margin="dense"
            label="Email Address"
            {...params.inputProps}
          />
        : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handlerCheck} color="primary" autoFocus style={{ fontWeight: 'bold' }}>{params.checkText || '确定'}</Button>
        <Button onClick={hide} color="primary" style={{ color: styleVars.subtext }}>{params.closeText || '取消'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default MyConfirm

const useStyles = makeStyles({
  maxWidth: {
    maxWidth: 500
  }
})