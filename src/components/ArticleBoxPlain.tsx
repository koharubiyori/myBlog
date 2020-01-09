import React, { PropsWithChildren, FC } from 'react'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import { Box } from '@material-ui/core'
import idToMoment from '~/utils/idToMoment'
import { makeStyles } from '@material-ui/styles'
import { flex } from '~/styles'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import ForumIcon from '@material-ui/icons/Forum'
import VisibilityIcon from '@material-ui/icons/Visibility'
import StarsIcon from '@material-ui/icons/Stars'
import { ReactComponent as TagIcon } from '~/images/sub/tag.svg'

export interface Props {
  articleData: ApiData.SearchResult
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

type FinalProps = Props & DataConnectedProps

function ArticleBox(props: PropsWithChildren<FinalProps>){
  const classes = useStyles()
  const {tags} = props.state.data
  if(tags === null) return null

  let {articleData} = props
  let dateStr = idToMoment(articleData._id).format('YYYY年MM月DD日')
  let tagNames = articleData.tags
    .filter(tagId => tags.some(tag => tag._id === tagId))
    .map(tagId => tags.find(tagObj => tagObj._id === tagId)!.name)

  return (
    <Box boxShadow={1} className={classes.container} onClick={props.onClick}>
      <div className="headImgWrap">
        <img alt="articleBoxBg" src={articleData.headImg} />
      </div>
      <main>
        <div className="title">{articleData.title}</div>
        
        <hr style={{ backgroundColor: '#ccc' }} />

        <div className="info" style={{ wordBreak: 'break-word' }}>
          <div className="profile">{articleData.profile}</div>
          <hr />
          
          <div className={c(flex.row, flex.crossCenter, 'totals')}>
            <div>
              <WatchLaterIcon />
              <span>{dateStr}</span>
            </div>
            
            <div>
              <VisibilityIcon />
              <span>{articleData.readNum} 次浏览</span>
            </div>
            
            <div>
              <ForumIcon />
              <span>{articleData.commentTotal} 条评论</span>
            </div>

            <div>
              <StarsIcon />
              <span>{articleData.collectTotal} 人收藏</span>
            </div>
          </div>
          
          <div className={c(flex.row, 'tags')}>
            {tagNames.filter((_, index) => index < 5).map(tagName =>
              <div className="tag" style={{ marginRight: 10 }} key={tagName}>
                <TagIcon className={classes.tagIcon} />
                <span>{tagName}</span>
              </div>  
            )}

            {tagNames.length > 5 ? <div>...</div> : null}
          </div>
        </div>
      </main>
    </Box>
  )
}

export default dataHOC(ArticleBox) as FC<Props>

const useStyles = makeStyles({
  '@global @keyframes fadeSink': {
    from: {
      opacity: 0,
      transform: 'translateY(-30px)'
    }
  },
  
  container: {
    maxWidth: 700,
    backgroundColor: 'white',
    position: 'relative',
    margin: '30px auto',
    cursor: 'pointer',
    overflow: 'hidden',
    animation: 'fadeSink 0.7s',
    color: '#666',
    transition: 'all 0.3s',

    '&:hover': {
      boxShadow: '0 0 5px #666, 0 0 7px #ccc',

      '@global > .headImgWrap > img': {
        transform: 'scale(1.05)'
      }
    },
    
    '@global': {
      main: {
        boxSizing: 'border-box',
        padding: 10
      },

      '.MuiSvgIcon-root': {
        fontSize: 16,
        position: 'relative',
        top: 3,
        marginRight: 5
      },

      '.headImgWrap': {
        height: 250,
        overflow: 'hidden',
        
        '@global > img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'all 0.3s'
        }
      },

      '.title': {
        fontSize: 26,
        textAlign: 'center',
      },

      '.info': {
        
      },

      '.profile': {
        marginLeft: 10
      },

      '.totals': {
        fontSize: 13,

        '@global > div': {
          marginRight: 10
        }
      },

      '.tags': {
        marginTop: 5
      },
    }
  },

  tagIcon: {
    width: 13, 
    height: 13, 
    marginRight: 5, 
    fill: '#666',
    position: 'relative',
    top: 1
  }
})