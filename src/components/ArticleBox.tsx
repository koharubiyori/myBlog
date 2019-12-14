import React, { PropsWithChildren } from 'react'
import classes from './ArticleBox.module.scss'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import resetComponentProps from '~/utils/resetComponentProps'
import { Box } from '@material-ui/core'
import idToMoment from '~/utils/idToMoment'

export interface Props {
  articleData: Omit<ApiData.Article, 'content'>
}

type FinalProps = Props & DataConnectedProps

function ArticleBox(props: PropsWithChildren<FinalProps>){
  const {tags} = props.state.data
  let {articleData} = props
  let dateStr = idToMoment(articleData._id).format('YY年MM月DD日')
  let tagNames = articleData.tags.map(tagId => tags.find(tagObj => tagObj._id === tagId)!.name)

  return (
    <Box boxShadow={1}>
      <big className="title">{articleData.title}</big>
      <div className="info">
        <div className="profile">{articleData.profile}</div>
        <hr />
        
        <div>
          <div>{dateStr}</div>
          <div>{articleData.readNum}次浏览</div>
          <div>{articleData.commentTotal}条评论</div>
          <div>{articleData.collectTotal}人收藏</div>
        </div>
        
        <div>{tagNames.map(tagName =>
          <div>
            <span>{tagName}</span>
          </div>  
        )}</div>
      </div>
    </Box>
  )
}

export default resetComponentProps<Props>(
  dataHOC(ArticleBox)
) 