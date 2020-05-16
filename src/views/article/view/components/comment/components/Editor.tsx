import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, TextField, Button } from '@material-ui/core'

export interface Props {
  style?: React.CSSProperties
  value?: string
  reply?: boolean
  onChangeText? (text: string): void
  onClickSubmit? (): void
  onClickClose? (): void
}

type FinalProps = Props

function CommentEditor(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()
  
  return (
    <div style={props.style}>
      <TextField fullWidth multiline 
        label={`${props.reply ? '回复' : '评论'}内容`}
        variant="outlined" 
        placeholder="说点什么吧..."
        rows={3} 
        inputProps={{ maxLength: 500 }}
        value={props.value}
        onChange={e => props.onChangeText && props.onChangeText(e.target.value)}
      />

      <footer style={{ marginTop: 10 }}>
        <Button color="primary" variant="outlined" onClick={() => props.onClickSubmit && props.onClickSubmit()}>{props.reply ? '回复' : '评论'}</Button>
        {props.reply ? 
          <Button style={{ marginLeft: 10 }} onClick={() => props.onClickClose && props.onClickClose()}>关闭</Button>
        : null}
      </footer>
    </div>
  )
}

export default CommentEditor

const useStyles = makeStyles({
  
})