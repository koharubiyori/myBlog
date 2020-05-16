import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core'
import styleVars from '~/styles/styleVars'

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface MyConfirmRef {
  show (params: Params): void
  hide (): void
}

interface Params {
  title?: string
  content?: string
  checkText?: string
  closeText?: string
  input?: boolean
  inputValue?: string
  inputLabel?: string
  disabledAutoHide?: boolean
  onCheck? (inputValue?: string): void
  onClose? (): void
}

type FinalProps = Props

function MyConfirm(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [visible, setVisible] = useState(false),
    [inputValue, setInputValue] = useState(''),
    [params, setParams] = useState<Params>({
      title: '',
      content: '',
      checkText: '',
      closeText: '',
      input: false,
    })

    const test = useRef<HTMLDivElement>(null as any)
  
  if(props.getRef) props.getRef.current = { show, hide }
  
  function handlerCheck(){
    params.onCheck && params.onCheck(params.input ? inputValue : undefined)
    !params.disabledAutoHide && setVisible(false)
  }

  function show(params: Params){
    setParams(params)
    setVisible(true)
    setInputValue(params.inputValue || '')
    params.input && setTimeout(() => (test.current!.querySelector('.MuiInputBase-input') as any).focus())
  }

  function hide(){
    params.onClose && params.onClose()
    !params.disabledAutoHide && setVisible(false)
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
        {params.content ? 
          <DialogContentText>{params.content}</DialogContentText>
        : null}

        {params.input ?
          <TextField autoFocus fullWidth
            margin="dense"
            label={params.inputLabel}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.keyCode === 13 && handlerCheck()}
            ref={test}
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