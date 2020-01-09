import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, Avatar } from '@material-ui/core'
import { flex } from '~/styles'
import styleVars from '~/styles/styleVars'

export interface Props {
  notificationData: ApiData.Notification
  onClick? (): void
}

type FinalProps = Props

function NotificationItem(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()
  
  const {operatorUserData} = props.notificationData
  return (
    <div className={c(classes.container, flex.row, flex.crossCenter)} onClick={() => props.onClick && props.onClick()}>
      <Avatar src={operatorUserData.avatar}>{operatorUserData.name[0]}</Avatar>
      <div className={c(flex.column, flex.around)} style={{ marginLeft: 10 }}>
        <NotiItemTitle notificationData={props.notificationData} />
        <div style={{ color: styleVars.subtext, fontSize: 'small' }}>{props.notificationData.commentData!.content}</div>
      </div>
    </div>
  )
}

export default NotificationItem

const useStyles = makeStyles({
  container: {
    padding: 20,
    transition: 'all 0.2s',
    cursor: 'pointer',
    borderBottom: '1px #ccc solid',
    
    '&:hover': {
      backgroundColor: '#eee'
    }
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#eee'
  }
})

type NotiItemTitle = (props: { notificationData: ApiData.Notification }) => JSX.Element
const NotiItemTitle: NotiItemTitle = ({notificationData: {type, operatorUserData, userData, articleData}}) => <div>
  {(() =>{
    if(type === 'comment'){
      return <>
        <strong>{operatorUserData.name}</strong>
        <span>在</span>
        <strong>{articleData!.title}</strong>
        <span>下发表了评论</span>
      </>
    }

    if(type === 'reply'){
      return <>
        <strong>{operatorUserData.name}</strong>
        <span>回复了你在</span>
        <strong>{articleData!.title}</strong>
        <span>下的评论</span>
      </>
    }
  })()}
</div>