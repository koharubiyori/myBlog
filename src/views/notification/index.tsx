import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import BgImg from '~/components/BgImg'
import { com } from '~/styles'
import notification from '~/api/notification'
import { PageListState, initPageList, createPageListLoader } from '~/utils/pageList'

export interface Props {
  
}

type FinalProps = Props

function MyNotification(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [uncheckedNotifications, setUncheckedNotifications] = useState<ApiData.Notification[]>([]),
    [notifications, setNotifications] = useState<PageListState<ApiData.Notification>>(initPageList())
  
  useEffect(() =>{
    loadUnchecked()
    load()
  }, [])
    
  function loadUnchecked(){
    notification.load({ isChecked: false })
      .then(data => setUncheckedNotifications(data as ApiData.Notification[]))
  }

  function load(page = 1, force = false){
    createPageListLoader(notifications, setNotifications, 
      page => notification.load({ page }) as Promise<PageData<ApiData.Notification>>
    )(page, force)
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