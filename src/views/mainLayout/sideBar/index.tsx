import React, { PropsWithChildren } from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import classes from './index.module.scss'
import HomeIcon from '@material-ui/icons/Home'
import { MyRouter } from '~/utils/createRouter'

export interface Props {
  theme: ApiData.Theme
  router: MyRouter
}

type FinalProps = Props

function SideBar({
  children,
  theme,
  router,
}: PropsWithChildren<FinalProps>){
  return (
    <>
      <Drawer
        variant="permanent"
        className={classes.root}
      >
        {/* 给toolbar让出位置 */}
        <div style={{ height: 70 }} />

        <img src={theme.avatar || require('~/images/sub/akari.jpg')} alt="icon" {...c(classes.avatar)} />
        <div className={classes.info}>
          <div className="name">小春日和</div>
        </div>
        <List className={classes.drawer}>
          <ListItem button onClick={() => router.search('/')}>
            <ListItemIcon>
              <HomeIcon style={{ color: '#C5C5C5' }} />
            </ListItemIcon>
            <ListItemText primary="首页" />
          </ListItem>
        </List>
      </Drawer>

      {/* 真实的drawer使用position:fiexd，这里再加一个元素用于占位 */}
      <div className={classes.drawer} />
    </>
  )
}

export default SideBar