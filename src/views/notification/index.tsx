import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import BgImg from '~/components/BgImg'
import { com } from '~/styles'
import notification from '~/api/notification'

export interface Props {
  
}

type FinalProps = Props

const initList = () =>({
  currentPage: 1,
  total: 0,
  pageTotal: 1,
  cache: {},
  status: 1
})

function MyNotification(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [uncheckedNotifications, setUncheckedNotifications] = useState<ApiData.Notification[]>([]),
    [notifications, setNotifications] = useState<PageState<ApiData.Notification>>(initList())
  
  useEffect(() =>{
    loadUnchecked()
    load()
  }, [])
    
  function loadUnchecked(){
    notification.load({ isChecked: false })
      .then(setUncheckedNotifications)
  }

  function load(){
    
  }

  return (
    <div>
      <h2 className={com.mainTitle}>通知</h2>
      <BgImg hidden />
    </div>
  )
}

export default MyNotification

const useStyles = makeStyles({
  '@global': {
    '.mainLayout-content': {
      maxWidth: 'initial',
    },
  },
})