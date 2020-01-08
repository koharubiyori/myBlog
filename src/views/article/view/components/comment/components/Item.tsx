import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, Avatar, Button } from '@material-ui/core'
import { flex } from '~/styles'
import idToMoment from '~/utils/idToMoment'
import CommentEditor from './Editor'
import comment from '~/api/comment'
import store from '~/redux'
import CloseIcon from '@material-ui/icons/Close'
import { FlattenedTree, CommentWithParentUserData } from '../redux/commentList'
import _ from 'lodash'
import getNotify from '~/externalContexts/notify'

export interface Props {
  commentData: FlattenedTree | CommentWithParentUserData
  articleId: string
  commentListIncrement (newComment: ApiData.Comment): void
  userData: ApiData.User
  onClickDelete? (commentId: string): void
}

type FinalProps = Props

function CommentItem(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    notify = getNotify(),
    [visibleEditor, setVisibleEditor] = useState(false),
    [replyValue, setReplyValue] = useState('')

  function showReplyEditor(){
    if(!store.getState().user._id) return notify('未登录无法进行回复')
    setVisibleEditor(true)
  }
  
  function submitReply(){
    if(!replyValue) return notify('回复内容不能为空')
    comment.post({
      articleId: props.articleId,
      targetId: props.commentData._id,
      targetUserId: props.commentData.userId,
      content: replyValue
    })
      .then(data =>{
        setReplyValue('')
        setVisibleEditor(false)
        props.commentListIncrement({
          _id: data.commentId,
          articleId: props.articleId,
          userId: props.userData._id,
          parentId: props.commentData._id,
          content: replyValue,
          deleted: false,
          userData: _.omit(props.userData, 'account')
        })

        notify.success('回复成功')
      })
  }

  return (
    <div className={classes.container}>
      <CloseIcon className={classes.closeBtn} onClick={() => props.onClickDelete && props.onClickDelete(props.commentData._id)} />
      <header className={c(flex.row, flex.crossCenter)}>
        <Avatar 
          src={props.commentData.userData.avatar}
        >{props.commentData.userData.name[0]}</Avatar>
        
        <div className={c(flex.column, flex.between, classes.info)}>
          <div className="userName" style={{ fontWeight: 'bold' }}>{props.commentData.userData.name}</div>
          <div className="date">{idToMoment(props.commentData._id).format('YYYY年MM月DD日 HH:mm:ss')}</div>
        </div>
      </header>
      
      <main>
        {props.commentData.parentUserData ? 
          <strong style={{ fontSize: 13, marginRight: 15 }}>@{props.commentData.parentUserData.name}</strong> 
        : null}
        <span>{props.commentData.content}</span>
      </main>

      <footer style={{ marginTop: 15 }}>
        {!visibleEditor ? 
          <Button color="primary" onClick={showReplyEditor}>回复</Button>
        :
          <CommentEditor reply 
            value={replyValue}
            onChangeText={setReplyValue}
            onClickSubmit={submitReply}
            onClickClose={() => setVisibleEditor(false)}
          />
        }
        
      </footer>

      <div className={classes.children}>{props.children}</div>
    </div>
  )
}

export default CommentItem

const useStyles = makeStyles({
  container: {
    margin: '15px 0',
    position: 'relative',

    '@global': {
      main: {
        marginLeft: 50,
        marginTop: 10
      }
    }
  },

  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 10,
    color: '#ABABAB',
    cursor: 'pointer'
  },

  info: {
    height: '40px !important',
    marginLeft: 10,
    fontSize: 13,
  },

  children: {
    marginLeft: 50
  }
})