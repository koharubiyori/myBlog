import { Button, ButtonGroup, makeStyles } from '@material-ui/core'
import React, { PropsWithChildren, useEffect, useRef, useState, FC } from 'react'
import notification from '~/api/notification'
import BgImg from '~/components/BgImg'
import { com, flex } from '~/styles'
import { createPageListLoader, initPageList, PageListState } from '~/utils/pageList'
import styleVars from '~/styles/styleVars'
import NotificationItem from './components/NotificationItem'
import createRouter from '~/utils/createRouter'
import getNotify from '~/externalContexts/notify'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import Pagination from '~/components/Pagination'

export interface Props {
  
}

type FinalProps = Props & DataConnectedProps

function MyNotification(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    router = createRouter(),
    notify = getNotify(),
    [uncheckedNotifications, setUncheckedNotifications] = useState<ApiData.Notification[]>(null as any),
    [notifications, setNotifications] = useState(initPageList<ApiData.Notification>()),
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
    if(uncheckedNotifications.length === 0) return notify('暂无未读评论')
    notification.check({ notificationIds: uncheckedNotifications.map(item => item._id) })
      .then(() =>{
        setUncheckedNotifications([])
        load(1, true)
        props.$data.set('uncheckedNotificationTotal', 0)
      })
  }

  if(!uncheckedNotifications || notifications.status !== 3) return <div />

  return (
    <div>
      <h2 className={c(com.mainTitle, flex.row, flex.between, flex.crossCenter)}>
        <span>通知</span>
        <Button
          variant="outlined"
          color="primary"
          onClick={check}
        >标记所有为已读</Button>
      </h2>
      <BgImg hidden />

      {uncheckedNotifications && notifications.status === 3 ? 
        <>
          <ButtonGroup variant="contained" color="primary" className={classes.btnGroup}>
            <Button data-active={activeTab === 0} onClick={() => setActiveTab(0)}>全部</Button>
            <Button data-active={activeTab === 1} onClick={() => setActiveTab(1)}>已读</Button>
            <Button data-active={activeTab === 2} onClick={() => setActiveTab(2)}>未读</Button>
          </ButtonGroup>

          <div className={classes.notifications}>
            {(activeTab === 0 || activeTab === 2) && uncheckedNotifications.length !== 0 ?
              <>
                <h3 className={classes.subtitle}>未读通知</h3>
                {uncheckedNotifications.map(item => <NotificationItem 
                  key={item._id} 
                  notificationData={item} 
                  onClick={() => router.push('/article/view', { search: { articleId: item.articleData!._id } })} 
                />)}
              </>
            : null}

            {(activeTab === 0 || activeTab === 1) && notifications.total !== 0 ?
              <>
                <h3 className={classes.subtitle}>已读通知</h3>
                {notifications.cache[notifications.currentPage].map(item => <NotificationItem 
                  key={item._id} 
                  notificationData={item} 
                  onClick={() => router.push('/article/view', { search: { articleId: item.articleData!._id } })} 
                />)}
                
                <Pagination 
                  style={{ marginTop: 40 }}
                  pageTotal={notifications.pageTotal}
                  current={notifications.currentPage}
                  onChangePage={page => load(page)}
                />
              </>
            : null}

            {
              (activeTab === 0 && uncheckedNotifications.length === 0 && notifications.total === 0) ||
              (activeTab === 1 && notifications.total === 0) ||
              (activeTab === 2 && uncheckedNotifications.length === 0) ?
                <div className={classes.noData}>暂无匹配通知</div>
              : null
            }
          </div>
        </>
      : null}
    </div>
  )
}

export default dataHOC(MyNotification) as FC<Props>

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
    marginTop: 20
  },

  subtitle: {
    fontWeight: 'initial',
    marginTop: 40
  },

  noData: {
    textAlign: 'center',
    marginTop: 40,
    color: styleVars.subtext
  }
})