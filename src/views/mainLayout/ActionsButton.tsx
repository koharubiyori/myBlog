import React, { PropsWithChildren, useState, useEffect, useLayoutEffect, useRef } from 'react'
import resetComponentProps from '~/utils/resetComponentProps'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import ShareIcon from '@material-ui/icons/Share'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { makeStyles } from '@material-ui/styles'
import createRouter from '~/utils/createRouter'
import { RoutePaths, basePath } from '~/routes'
import _ from 'lodash'
import qs from 'qs'

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface ActionsButtonRef {
  setVisible (val: boolean): void
  setDisabledResizeHandler (val: boolean): void
}

type FinalProps = Props & UserConnectedProps

type ActionName = '新建文章' | '分享' | '收藏' | '编辑'

interface Action {
  icon: JSX.Element | null
  name: ActionName | ''
}

const actionMaps: {
  [Key in RoutePaths | 'default']?: { [Key in 'admin' | 'visitor' | 'user']?: Action[] }
} = {
  '/article/view': {
    admin: [
      { icon: <ShareIcon />, name: '分享' },
      { icon: <AddIcon />, name: '新建文章' },
      { icon: <EditIcon />, name: '编辑' },
    ],

    user: [
      { icon: <ShareIcon />, name: '分享' },
      { icon: <FavoriteIcon />, name: '收藏' },
    ],
  },

  default: {
    admin: [
      { icon: <AddIcon />, name: '新建文章' },
      { icon: <ShareIcon />, name: '分享' },
    ],

    user: [
      { icon: <FavoriteIcon />, name: '收藏' }
    ]
  }
}

function ActionsButton(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter(),
    [open, setOpen] = useState(false),
    [visible, setVisible] = useState(true),
    [actions, setActions] = useState<Action[]>([]),
    [dialAction, setDialAction] = useState<Action>({ icon: null, name: '' }),
    lastProps = useRef<FinalProps>(props)
  let disabledResizeHandler = false

  if(props.getRef) props.getRef.current = { setVisible, setDisabledResizeHandler }

  useEffect(() =>{
    const resizeHandler = () => {
      if(disabledResizeHandler){ return }
      setVisible(window.innerWidth >= 880)
    }

    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  useEffect(() =>{
    router.listen(({location}) => loadActions(location.pathname))
  }, [])

  useEffect(() =>{
    if(lastProps.current.state.user._id === '' && props.state.user._id){
      loadActions(router.location.pathname)
    }

    lastProps.current = props
  })

  function loadActions(pathName: string){
    const path: RoutePaths = pathName.replace(new RegExp('^' + _.escapeRegExp(basePath)), '') as any
    const action = actionMaps[path] || actionMaps.default
    const role = props.$user.getRole()
    const roleAction = action![role] || actionMaps.default![role]
    
    roleAction && setActions(roleAction.reverse())
  }

  function actionHandler (actionName: ActionName){
    switch(actionName){
      case '新建文章': {
        router.push('/article/edit')
        break
      }
      case '编辑': {
        router.push('/article/edit', { state: {
          type: 1,
          articleId: qs.parse(router.location.search.split('?')[1]).articleId
        } })
      }
    }

    setOpen(false)
  }

  function setDisabledResizeHandler(val: boolean){
    disabledResizeHandler = val
  }
  
  return (
    <>
      {props.state.user.name !== '' ?
        <SpeedDial
          style={{ position: 'fixed', bottom: 70, right: 260 }}
          ariaLabel=""
          hidden={!visible}
          open={open}
          icon={<SpeedDialIcon />}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}

        >
          {actions.map(action => (
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

const useStyles = makeStyles({
  '@global': {
    // '.MuiFab-primary:not(foo)': {
    //   backgroundColor: styleVars.main
    // }
  }
})