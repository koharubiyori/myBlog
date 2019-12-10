import React, { PropsWithChildren, useState, useEffect } from 'react'
import resetComponentProps from '~/utils/resetComponentProps'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import ShareIcon from '@material-ui/icons/Share'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { MyRouter } from '~/utils/createRouter'

export interface Props {
  router: MyRouter
  getMethods?<T extends { [Key in keyof T]: Function }> (methods: T): void
}

type FinalProps = Props & UserConnectedProps

type ActionName = '新建文章' | '分享' | '收藏' | '编辑'
const visitorActions = [
  { icon: <ShareIcon />, name: '分享' }
].reverse()

const adminActions = [
  { icon: <ShareIcon />, name: '分享' },
  { icon: <AddIcon />, name: '新建文章' }
].reverse()

function ActionsButton({
  children,
  getMethods,
  router,
  state,
  $user
}: PropsWithChildren<FinalProps>){
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  
  function actionHandler (actionName: string){
    switch(actionName){
      case '新建文章': {

      }
    }

    setOpen(false)
  }

  useEffect(() =>{
    const resizeHandler = () => setHidden(window.innerWidth < 880)
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  getMethods && getMethods({ setHidden })
  
  return (
    <>
      {state.user.name !== '' ?
        <SpeedDial
          style={{ position: 'fixed', bottom: 70, right: 260 }}
          ariaLabel=""
          hidden={hidden}
          open={open}
          icon={<SpeedDialIcon 
            openIcon={$user.isAdmin() ? <EditIcon /> : <FavoriteIcon />} 
            onClick={() => actionHandler($user.isAdmin() ? '编辑' : '收藏')}
          />}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}

        >
          {($user.isAdmin() ? adminActions : visitorActions).map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => actionHandler(action.name as any)}
            />
          ))}
        </SpeedDial>
      : null}
    </>
  )
}

export default resetComponentProps<Props>(
  userHOC(ActionsButton)
) 