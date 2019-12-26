import React, { PropsWithChildren } from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import styleVars from '~/styles/styleVars'
import createRouter from '~/utils/createRouter'

export interface Props {
  theme: ApiData.Theme
}

type FinalProps = Props

function Sidebar(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter()
  
  return (
    <>
      <Drawer
        variant="permanent"
        className={classes.root}
      >
        {/* 给toolbar让出位置 */}
        <div style={{ height: 70 }} />

        <img src={props.theme.avatar || require('~/images/sub/akari.jpg')} alt="icon" className={classes.avatar} />
        <div className={classes.info}>
          <div className="name">小春日和</div>
        </div>
        <List className={classes.drawer}>
          <ListItem button onClick={() => router.push('/')}>
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

export default Sidebar

const useStyles = makeStyles({
  root: {
    '@global': {
      '.MuiPaper-root': {
        backgroundColor: styleVars.black,
        color: '#C5C5C5'
      },
  
      '.MuiListItem-button:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      },
  
      '.MuiTouchRipple-root': {
        color: 'white'
      }
    }
  },

  drawer: {
    width: 220
  },

  avatar: {
    margin: '30px auto',
    width: 130,
    height: 130,
    borderRadius: '50%',
    border: '5px white solid',
    transition: 'all 0.2s',
    cursor: 'pointer',
  
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },

  info: {
    textAlign: 'center',
    color: '#A99CFF',
    fontWeight: 'bold',
    marginTop: -20,
    marginBottom: 10
  }
})