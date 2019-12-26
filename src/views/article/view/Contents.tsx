import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import markdownContents from 'markdown-contents'

export interface Props {
  markdown: string
  titleTopOffsets: number[]
}

type FinalProps = Props

function ArticleContents(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    titles = markdownContents(props.markdown).articles()
  

  console.log(titles)
  return (
    <div>
      12333
    </div>
  )
}

export default ArticleContents

const useStyles = makeStyles({
  
})