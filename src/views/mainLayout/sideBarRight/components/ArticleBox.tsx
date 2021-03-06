import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import { flex, com } from '~/styles'
import VisibilityIcon from '@material-ui/icons/Visibility'

const iconLoader = (iconName: string): string => require('~/images/icons/' + iconName + '.png')
const icons = ('chino cocoa rize syaro maya noel nonoka koharu shione').split(' ').map(iconLoader)

export interface Props {
  articleData: ApiData.SearchResult
  onClick?(): void
}

type FinalProps = Props

function SidebarRightArticleBox(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    randomIcon = useRef(icons[Math.floor(Math.random() * icons.length)])
  
  return (
    <div 
      className={c(classes.container, flex.row)} 
      style={{ overflow: 'hidden' }}
      onClick={() => props.onClick && props.onClick()}
      title={props.articleData.title}
    >
      <div className={c(flex.row, flex.center)} style={{ width: 50, marginRight: 10 }}>
        <img src={randomIcon.current} className={classes.icon} alt="icon" />
      </div>

      <div className={c(flex.column, flex.around)} style={{ height: 50, overflow: 'hidden' }}>
        <div className={com.textLimit}>{props.articleData.title}</div>
        <div className={c(flex.row, flex.crossCenter)} style={{ color: '#666', fontSize: 13 }}>
          <VisibilityIcon className={classes.visibilityIcon} />
          <span>{props.articleData.readNum}</span>
        </div>
      </div>
    </div>
  )
}

export default SidebarRightArticleBox

const useStyles = makeStyles({
  container: {
    padding: '10px',
    transition: 'all 0.2s',
    cursor: 'pointer',
    borderBottom: '1px #ccc solid',

    '&:hover': {
      backgroundColor: '#eee'
    }
  },

  icon: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#ccc'
  },

  visibilityIcon: {
    fontSize: 14,
    verticalAlign: 'middle',
    marginRight: 2
  }
})