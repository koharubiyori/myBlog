import React, { PropsWithChildren, useState, useEffect, FC, createContext } from 'react'
import { makeStyles } from '@material-ui/core'
import resetComponentProps from '~/utils/resetComponentProps'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import createRouter from '~/utils/createRouter'

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
            <div>1234</div>  
          }
        </div>

        <div style={{ width: 220 }} />
      </>
    : null
  )
}

export default resetComponentProps<Props>(
  userHOC(SidebarRight)
) 

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: 220,
    paddingTop: 60
  }
})