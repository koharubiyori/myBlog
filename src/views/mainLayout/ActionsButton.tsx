import React, { PropsWithChildren, useState, useEffect, useRef, FC } from 'react'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import DeleteIcon from '@material-ui/icons/Delete'
import ShortTextIcon from '@material-ui/icons/ShortText'
import { makeStyles } from '@material-ui/styles'
import createRouter from '~/utils/createRouter'
import { RoutePaths, basePath } from '~/routes'
import _ from 'lodash'
import qs from 'qs'
import article from '~/api/article'
import getNotify from '~/externalContexts/notify'
import getConfirm from '~/externalContexts/confirm'
import styleVars from '~/styles/styleVars'
import katakoto from '~/api/katakoto'

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface ActionsButtonRef {
  setVisible (val: boolean): void
  setDisabledResizeHandler (val: boolean): void
  setIsCollected (val: boolean): void
}

type FinalProps = Props & UserConnectedProps

type ActionName = '新建文章' | '分享' | '收藏文章' | '取消收藏' | '编辑' | '删除' | '只言片语'

interface Action {
  icon: JSX.Element | null
  name: ActionName | ''
}

const actionMaps: {
  [Key in RoutePaths | 'default']?: { [Key in 'admin' | 'visitor' | 'user']?: Action[] }
} = {
  '/article/view': {
    admin: [
      { icon: <FavoriteIcon />, name: '收藏文章' },
      { icon: <EditIcon />, name: '编辑' },
      { icon: <DeleteIcon />, name: '删除' },
      { icon: <AddIcon />, name: '新建文章' },
      { icon: <ShortTextIcon />, name: '只言片语' }
    ],

    user: [
      { icon: <FavoriteIcon />, name: '收藏文章' }
    ]
  },

  default: {
    admin: [
      { icon: <AddIcon />, name: '新建文章' },
      { icon: <ShortTextIcon />, name: '只言片语' },
    ],
  }
}

function ActionsButton(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter(),
    notify = getNotify(),
    confirm = getConfirm(),
    [open, setOpen] = useState(false),
    [visible, setVisible] = useState(true),
    [actions, setActions] = useState<Action[]>([]),
    [isCollected, setIsCollected] = useState(false)
  let disabledResizeHandler = false

  if(props.getRef) props.getRef.current = { setVisible, setDisabledResizeHandler, setIsCollected }

  useEffect(() =>{
    const resizeHandler = () => {
      if(disabledResizeHandler){ return }
      setVisible(window.innerWidth >= 1060)
    }

    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  useEffect(() =>{
    router.listen(({location}) => loadActions(location.pathname))
  }, [])

  useEffect(() =>{
    loadActions(router.location.pathname)
  }, [props.state.user, isCollected])

  function loadActions(pathName: string){
    const path: RoutePaths = pathName.replace(new RegExp('^' + _.escapeRegExp(basePath)), '') as any
    const action = actionMaps[path] || actionMaps.default
    const role = props.$user.getRole()
    const roleAction = action![role] || actionMaps.default![role]
    
    if(roleAction){
      roleAction.forEach(item =>{
        if(item.name === '收藏文章' || item.name === '取消收藏'){
          item.icon = isCollected ? <FavoriteIcon color="error" /> : <FavoriteIcon />
          item.name = isCollected ? '取消收藏' : '收藏文章'
        }
      })
    }

    roleAction && setActions(roleAction)
  }

  function actionHandler (actionName: ActionName){
    switch(actionName){
      case '新建文章': {
        router.push('/article/edit', { state: { type: 0 } })
        break
      }

      case '编辑': {
        router.push('/article/edit', { state: {
          type: 1,
          articleId: qs.parse(router.location.search.split('?')[1]).articleId
        } })
        break
      }

      case '删除': {
        confirm({
          content: '确定要删除这篇文章？',
          onCheck (){
            article.delete({ articleId: qs.parse(router.location.search.split('?')[1]).articleId })
              .then(() =>{
                notify.success('操作成功')
                router.replace('/', { state: { reload: true } })
              })
          }
        })
        break
      }

      case '收藏文章': 
      case '取消收藏': {
        const {articleId} = qs.parse(router.location.search.split('?')[1])
        article.setCollectStatus({ articleId, collect: !isCollected })
        isCollected ? notify('取消收藏') : notify.success('收藏文章')
        setIsCollected(prevVal => !prevVal)
        break
      }

      case '只言片语': {
        confirm({
          input: true,
          disabledAutoHide: true,
          title: '新建只言片语',
          inputLabel: '内容',
          onCheck (inputValue){
            if(inputValue!.length === 0) return notify('内容不能为空')
            katakoto.add({ content: inputValue! })
              .then(() =>{
                notify('提交成功')
                confirm.hide()
              })
          },

          onClose: confirm.hide
        })
        break
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
          style={{ position: 'fixed', bottom: 70, right: 210 }}
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

export default userHOC(ActionsButton) as FC<Props>

const useStyles = makeStyles({
  '@global': {
    // '.MuiFab-primary:not(foo)': {
    //   backgroundColor: styleVars.main
    // }
  }
})