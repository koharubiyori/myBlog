import React, { PropsWithChildren, FC } from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import InfoIcon from '@material-ui/icons/Info'
import styleVars from '~/styles/styleVars'
import createRouter from '~/utils/createRouter'
import { appBarHeight } from '../myAppBar'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'

export interface Props {
  theme: ApiData.Theme
}

const aboutBlogArticleId = process.env.NODE_ENV === 'development' ? '5e1e8cbe4458a908c86b53a2' : '5e1e861bc9f02a467a70ecef'
const chatroomArticleId = process.env.NODE_ENV === 'development' ? '5e1d3b7d1879db108875c4fd' : '5e1e87dc93408846cbfd87de'

type FinalProps = Props & DataConnectedProps

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
        <div style={{ height: appBarHeight + 10 }} />
        {props.state.data.settings ?
          <img className={classes.blurBg} src={props.state.data.settings.bgImg} alt="blurBg" />
        : null}

        <img src={props.theme.avatar || require('~/images/sub/akari.jpg')} alt="icon" className={classes.avatar} />
        <div className={classes.info}>
          <div className="name">小春日和</div>
        </div>
        <List className={classes.drawer}>
          <ListItem button onClick={() => router.navigate('/')}>
            <ListItemIcon>
              <HomeIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="首页" />
          </ListItem>

          <ListItem button onClick={() => router.push('/article/view', { search: { articleId: aboutBlogArticleId } })}>
            <ListItemIcon>
              <QuestionAnswerIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="留言板" />
          </ListItem>

          <ListItem button onClick={() => router.push('/article/view', { search: { articleId: chatroomArticleId } })}>
            <ListItemIcon>
              <InfoIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="关于博客" />
          </ListItem>
        </List>
      </Drawer>

      {/* 真实的drawer使用position:fiexd，这里再加一个元素用于占位 */}
      <div className={classes.drawer} />
    </>
  )
}

export default dataHOC(Sidebar) as FC<Props>

const useStyles = makeStyles({
  root: {
    '@global': {
      '.MuiPaper-root': {
        // backgroundColor: 'rgba(49, 49, 49, 0.8)',
        color: 'black',
        // boxShadow: '0 0 3px black'
        borderRight: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 0 5px #666'
      },
  
      '.MuiListItem-button:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      },
  
      // '.MuiTouchRipple-root': {
      //   color: 'white'
      // }
    }
  },

  drawer: {
    width: 220
  },

  blurBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(30px)',
    clip: 'rect(0, 220px, 100vh, 0)',
    zIndex: -1
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
    fontWeight: 'bold',
    marginTop: -20,
    marginBottom: 10
  },

  icon: {
    color: 'black'
  }
})