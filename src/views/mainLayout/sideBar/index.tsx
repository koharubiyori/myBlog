import React, { PropsWithChildren } from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import classes from './index.module.scss'
import HomeIcon from '@material-ui/icons/Home'

export interface Props {
  theme: ApiData.Theme
}

export default function SideBar(props: PropsWithChildren<Props>){
  return (
    <Drawer
      variant="permanent"
    >
      {/* 给toolbar让出位置 */}
      <div style={{ height: 70 }} />

      <img src={props.theme.avatar || require('~/images/sub/akari.jpg')} alt="icon" {...c(classes.avatar)} />
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