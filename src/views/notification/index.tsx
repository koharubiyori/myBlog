import { Button, ButtonGroup, makeStyles } from '@material-ui/core'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import notification from '~/api/notification'
import BgImg from '~/components/BgImg'
import { com } from '~/styles'
import { createPageListLoader, initPageList, PageListState } from '~/utils/pageList'
import styleVars from '~/styles/styleVars'
import NotificationItem from './components/NotificationItem'

export interface Props {
  
}

type FinalProps = Props

function MyNotification(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [uncheckedNotifications, setUncheckedNotifications] = useState<ApiData.Notification[]>(null as any),
    [notifications, setNotifications] = useState<PageListState<ApiData.Notification>>(initPageList()),
    [activeTab, setActiveTab] = useState(0)
  
  useEffect(() =>{
    loadUnchecked()
    load()
  }, [])
    
  function loadUnchecked(){
    notification.load({ isUnchecked: true })
      .then(data => setUncheckedNotifications(data as ApiData.Notification[]))
  }

  function load(page = 1, force = false){
    createPageListLoader(notifications, setNotifications, 
      page => notification.load({ page }) as Promise<PageData<ApiData.Notification>>
    )(page, force)
  }

  function check(){
    notification.check({ notificationIds: uncheckedNotifications.map(item => item._id) })
      .then(() =>{
        setUncheckedNotifications([])
        load(1, true)
      })
  }

  if(!uncheckedNotifications || notifications.status !== 3) return <div />

  return (
    <div>
      <h2 className={com.mainTitle}>通知</h2>
      <BgImg hidden />
      <ButtonGroup variant="contained" color="primary" className={classes.btnGroup}>
        <Button data-active={activeTab === 0} onClick={() => setActiveTab(0)}>全部</Button>
        <Button data-active={activeTab === 1} onClick={() => setActiveTab(1)}>已读</Button>
        <Button data-active={activeTab === 2} onClick={() => setActiveTab(2)}>未读</Button>
      </ButtonGroup>

      <div className={classes.notifications}>
        {(activeTab === 0 || activeTab === 2) ?
          uncheckedNotifications.map(item => <NotificationItem key={item._id} notificationData={item} />)
        : null}

        {activeTab === 0 || activeTab === 1 ?
          notifications.cache[notifications.currentPage].map(item => <NotificationItem key={item._id} notificationData={item} />)
        : null}
      </div>
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

  btnGroup: {
    '@global .MuiButtonBase-root[data-active="true"]': {
      backgroundColor: styleVars.dark
    }
  },

  notifications: {

  }
})