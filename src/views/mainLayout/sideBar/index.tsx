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
    <Drawer
      variant="permanent"
    >
      {/* 给toolbar让出位置 */}
      <div style={{ height: 70 }} />

      <img src={theme.avatar || require('~/images/sub/akari.jpg')} alt="icon" {...c(classes.avatar)} />
      <List className={classes.drawer}>
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="首页" />
        </ListItem>
      </List>
    </Drawer>
  )
}

export default SideBar