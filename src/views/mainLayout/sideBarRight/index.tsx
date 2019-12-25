import React, { PropsWithChildren, useState, useEffect, FC, createContext } from 'react'
import { makeStyles } from '@material-ui/core'
import resetComponentProps from '~/utils/resetComponentProps'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import createRouter from '~/utils/createRouter'

export interface Props {
  getRef?: React.MutableRefObject<any>
  getContextValue?: React.MutableRefObject<any>
}

export interface SideBarRightRef {
  setVisible (val: boolean): void
  setDisabledResizeHandler (val: boolean): void
}

export interface SideBarRightContext {
  setContent: React.Dispatch<React.SetStateAction<FC<{}>>>
}

export const SideBarRightContext = createContext<SideBarRightContext | null>(null)

type FinalProps = Props & UserConnectedProps

function SideBarRight(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(), 
    router = createRouter(),
    [visible, setVisible] = useState(true),
    [Content, setContent] = useState<FC>(() => () => null)
  let disabledResizeHandler = false

  if(props.getRef) props.getRef.current = { setVisible, setDisabledResizeHandler }
  if(props.getContextValue) props.getContextValue.current = { setContent }

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
      <div className={classes.root}>
        <Content />
      </div>
    : null
  )
}

export default resetComponentProps<Props>(
  userHOC(SideBarRight)
) 

const useStyles = makeStyles({
  root: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: 200
  }
})