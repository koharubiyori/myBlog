import React, { PropsWithChildren, useState, useEffect } from 'react'
import { Drawer, makeStyles } from '@material-ui/core'
import resetComponentProps from '~/utils/resetComponentProps'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import useRouter from '~/hooks/useRouter'

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface SideBarRightRef {
  setVisible (val: boolean): void
  setDisabledResizeHandler (val: boolean): void
}

type FinalProps = Props & UserConnectedProps

function SideBarRight(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(), 
    router = useRouter(),
    [visible, setVisible] = useState(true)
  let disabledResizeHandler = false

  if(props.getRef) props.getRef.current = { setVisible, setDisabledResizeHandler }

  useEffect(() =>{
    const resizeHandler = () =>{
      if(disabledResizeHandler){ return }
      setVisible(window.innerWidth >= 880)
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
        <Drawer
          variant="permanent"
          anchor="right"
          classes={{ root: classes.root }}
        >
          {/* 给toolbar让出位置 */}
          <div style={{ height: 70 }} />
          <div style={{ width: 200, backgroundColor: '#eee' }}></div>
        </Drawer>

        <div style={{ width: 200 }} />
      </>
    : null
  )
}

export default resetComponentProps<Props>(
  userHOC(SideBarRight)
) 

const useStyles = makeStyles({
  root: {
    '@global .MuiPaper-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    }
  }
})