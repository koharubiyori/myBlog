import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'

export interface Props {
  total: number
  pageSize: number
  current: number
}

type FinalProps = Props

function Pagination(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()
  
  return (
    <div>
      
    </div>
  )
}

export default Pagination

const useStyles = makeStyles({
  
})