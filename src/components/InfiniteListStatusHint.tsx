import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { PropsWithChildren } from 'react'

export interface Props {
  status: 0 | 1 | 2 | 3 | 4 | 5
}

type FinalProps = Props

function InfiniteListStatusHint(props: PropsWithChildren<FinalProps>) {
  const
    classes = useStyles()
  
  return (
    <div className={classes.infiniteListStatusHint}>
      {{
        0: () => <div>加载失败，点击重试</div>,
        1: () => null,
        2: () => <CircularProgress style={{  display: 'block', margin: '30px auto' }} />,
        3: () => null,
        4: () => <div>已经没有啦</div>,
        5: () => null
      }[props.status]()}
    </div>
  )
}

export default InfiniteListStatusHint

const useStyles = makeStyles({
  infiniteListStatusHint: {
    margin: '30px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 18
  }
})