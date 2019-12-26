import React, { useState, useEffect, useRef, PropsWithChildren, useReducer, Children } from 'react'
import { makeStyles, Box } from '@material-ui/core'
import CommentEditor from './components/Editor'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import { Link } from '@reach/router'
import styleVars from '~/styles/styleVars'
import resetComponentProps from '~/utils/resetComponentProps'
import { basePath } from '~/routes'
import comment from '~/api/comment'
import CommentItem from './components/Item'
import _ from 'lodash'
import reducer from './redux/commentList'


export interface Props {
  articleData: ApiData.Article
}

type FinalProps = Props & UserConnectedProps

function ArticleComment(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [commentValue, setCommentValue] = useState(''),
    [commentListState, commentListDispatch] = useReducer(reducer, { 
      original: [],
      flattenedTree: [], 
    })

  useEffect(() =>{
    load()
  }, [])

  function load(){
    comment.get({ articleId: props.articleData._id })
      .then(data =>{
        commentListDispatch({ type: 'set', data })
      })
  }

  function delComment(commentId: string){
    $confirm({
      content: '确定要删除这条评论及其回复吗？',
      onCheck (){
        let ids = getChildrenIds(commentId)
        comment.delete({ commentIds: ids })
          .then(() =>{
            commentListDispatch({ type: 'delete', ids })
            $notify.success('删除成功')
          })
      }
    })

    function getChildrenIds(rootId: string): string[]{
      let ids: string[] = [rootId]
      function through(id: string){
        commentListState.original.forEach(item =>{
          if(item.parentId === id){
            ids.push(item._id)
            through(item._id)
          }
        })
      }

      through(rootId)
      return ids
    }
  }

  function commentListIncrement(newComment: ApiData.Comment){
    commentListDispatch({
      type: 'set',
      data: [ newComment, ...commentListState.original ]
    })
  }
  
  function submitComment(){
    if(!commentValue) return $notify('评论内容不能为空')
    comment.post({
      articleId: props.articleData._id,
      content: commentValue
    })
      .then(data =>{
        commentListIncrement({
          _id: data.commentId,
          articleId: props.articleData._id,
          userId: props.state.user._id,
          parentId: '',
          content: commentValue,
          deleted: false,
          userData: _.omit(props.state.user, 'account')
        })

        setCommentValue('')
        $notify.success('发表成功')
      })
  }

  return (
    <Box boxShadow={2} className={classes.container}>
      <p style={{ marginTop: 0 }}>共{commentListState.original.length}条评论</p>

      {props.state.user._id ?
        <CommentEditor 
          value={commentValue}
          onChangeText={setCommentValue}
          onClickSubmit={submitComment}
        />
      :
        <div className={classes.noLoginHint}>
          <span>没有</span>
          <Link to={`${basePath}/account/login`} style={{ color: styleVars.main }}>登录</Link>
          <span>无法进行评论哦~</span>
        </div>
      }

      <hr style={{ backgroundColor: '#ccc' }} />

      <div className={classes.comments}>{commentListState.flattenedTree.map(item =>
        <CommentItem 
          key={item._id}
          commentData={item} 
          articleId={props.articleData._id}
          commentListIncrement={commentListIncrement}
          userData={props.state.user}
          onClickDelete={delComment}
        >
          {item.children.map(item =>
            <CommentItem
              key={item._id}
              commentData={item}
              articleId={props.articleData._id}
              commentListIncrement={commentListIncrement}
              userData={props.state.user}
              onClickDelete={delComment}
            />
          )}
        </CommentItem>
      )}</div>
    </Box>
  )
}

export default resetComponentProps<Props>(
  userHOC(ArticleComment)
)

const useStyles = makeStyles({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    marginTop: 20,
  },

  noLoginHint: {
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  comments: {
    marginTop: 20
  }
})