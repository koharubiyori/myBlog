import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import markdownContents from 'markdown-contents'
import _ from 'lodash'

export interface Title{
  level: number
  id: string
  name: string
  offset: number
}

export interface Props {
  titles: Title[]
}

type FinalProps = Props

function ArticleContents(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()
  let isMaxLevel2 = !props.titles.some(item => item.level === 1)
    
  console.log(props.titles)
  return (
    <div className={classes.container}>
      <p>目录</p>
      <div className={classes.titles}>
        {props.titles.map(item =>
          <div key={item.id}
            className={classes.title} 
            style={{ marginLeft: 15 * (item.level - (isMaxLevel2 ? 2 : 1)) }}
            // data-number={}
          >
            {item.name}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleContents

const useStyles = makeStyles({
  container: {
    boxSizing: 'border-box',
    padding: '0 10px'
  },

  titles: {

  },

  title: {

  }
})