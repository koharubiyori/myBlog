import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'

export interface Props {
  uri?: string
  hidden?: boolean
}

type FinalProps = Props

function BgImg(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()
  
  useEffect(() =>{
    if(props.hidden){
      document.querySelectorAll('.backgroundImage').forEach((item: any) => item.style.display = 'none')
      return () => document.querySelectorAll('.backgroundImage').forEach((item: any) => item.style.display = 'block')
    }
  }, [])

  return props.hidden ? null : <img src={props.uri} alt="bgImg" className={c(classes.bgImg, 'backgroundImage')} />
}

export default BgImg

const useStyles = makeStyles({
  bgImg: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    objectFit: 'cover',
    // filter: 'brightness(0.9)'
  }
})