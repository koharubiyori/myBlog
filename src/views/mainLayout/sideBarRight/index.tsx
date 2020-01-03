import React, { PropsWithChildren, useState, useEffect, FC, createContext } from 'react'
import { makeStyles } from '@material-ui/core'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import createRouter from '~/utils/createRouter'
import { appBarHeight } from '../myAppBar'
import { ReactComponent as TagIcon } from '~/images/sub/tag.svg'

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface SidebarRightRef {
  setVisible (val: boolean): void
  setDisabledResizeHandler (val: boolean): void
  writeContent (content?: JSX.Element | null): void
}

type FinalProps = Props & UserConnectedProps

function SidebarRight(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(), 
    router = createRouter(),
    [visible, setVisible] = useState(true),
    [Content, setContent] = useState<FC | null>(null)
  let disabledResizeHandler = false

  if(props.getRef) props.getRef.current = { 
    setVisible, 
    setDisabledResizeHandler,
    writeContent: (content = null) => setContent(() => content ? () => content : null)  
  }

  useEffect(() =>{
    const resizeHandler = () =>{
      if(disabledResizeHandler){ return }
      setVisible(window.innerWidth >= 1060)
    }
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  function setDisabledResizeHandler(val: boolean){
    disabledResizeHandler = val
  }

  return (
    visible ?
      <>
        <div className={classes.root}>
          {Content ? 
            <Content />
          :
            // <div>1234</div>  
            <TagIcon style={{ width: 10, height: 10 }} />
          }
        </div>

        <div style={{ width: 220 }} />
      </>
    : null
  )
}

export default userHOC(SidebarRight) as FC<Props>

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 220,
    paddingTop: appBarHeight,
    boxShadow: '0 0 5px #666'
  }
})