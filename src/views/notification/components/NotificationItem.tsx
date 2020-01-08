import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, Avatar } from '@material-ui/core'
import { flex } from '~/styles'
import styleVars from '~/styles/styleVars'

export interface Props {
  notificationData: ApiData.Notification
}

type FinalProps = Props

function NotificationItem(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()
  
  const {operatorUserData} = props.notificationData
  return (
    <div className={c(classes.container, flex.row, flex.crossCenter)}>
      <Avatar src={operatorUserData.avatar}>{operatorUserData.name[0]}</Avatar>
      <div className={c(flex.column, flex.around)} style={{ marginLeft: 10 }}>
        <NotiItemTitle notificationData={props.notificationData} />
        <div style={{ color: styleVars.subtext }}>{props.notificationData.commentContent}</div>
      </div>
    </div>
  )
}

export default NotificationItem

const useStyles = makeStyles({
  container: {

  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#eee'
  }
})

type NotiItemTitle = (props: { notificationData: ApiData.Notification }) => JSX.Element
const NotiItemTitle: NotiItemTitle = ({notificationData: {type, operatorUserData, userData, articleTitle}}) => <div>
  {(() =>{
    if(type === 'comment'){
      return <>
        <strong>{operatorUserData.name}</strong>
        <span>在</span>
        <strong>{articleTitle}</strong>
        <span>下发表了评论</span>
      </>
    }

    if(type === 'reply'){
      return <>
        <strong>{operatorUserData.name}</strong>
        <span>回复了你在</span>
        <strong>{articleTitle}</strong>
        <span>下的评论</span>
      </>
    }
  })()}
</div>