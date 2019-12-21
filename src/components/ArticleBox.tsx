import React, { PropsWithChildren } from 'react'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import resetComponentProps from '~/utils/resetComponentProps'
import { Box } from '@material-ui/core'
import idToMoment from '~/utils/idToMoment'
import { makeStyles } from '@material-ui/styles'
import { flex } from '~/styles'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import ForumIcon from '@material-ui/icons/Forum'
import VisibilityIcon from '@material-ui/icons/Visibility'
import StarsIcon from '@material-ui/icons/Stars'
import TagIcon from '~/components/icons/tag'

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
  let tagNames = articleData.tags.map(tagId => tags.find(tagObj => tagObj._id === tagId)!.name)

  return (
    <Box boxShadow={1} className={classes.container} onClick={props.onClick}>
      <img alt="articleBoxBg" src={articleData.headImg} className="bgImg" />
      <big className="title">{articleData.title}</big>
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
        
        <div className="tags">{tagNames.map(tagName =>
          <div className="tag" key={tagName}>
            <TagIcon color="white" style={{ marginRight: 5 }} />
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

const _transition = 'all 0.3s'
const useStyles = makeStyles({
  container: {
    position: 'relative',
    height: 300,
    margin: '30px 0',
    color: 'white',
    cursor: 'pointer',
    overflow: 'hidden',

    '&:hover': {
      '@global': {
        '.bgImg': {
          filter: 'brightness(0.5) blur(3px)',
          transform: 'scale(1.1)'
        },

        '.title': {
          transform: 'translateY(-50px)'
        },

        '.info': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }
    },

    '@global': {
      '.bgImg': {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        objectFit: 'cover',
        zIndex: -1,
        filter: 'brightness(0.65)',
        transition: _transition
      },
      
      '.title': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 24,
        textShadow: '0 0 3px white',
        transition: _transition,
      },
    
      '.info': {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        padding: 20,
        opacity: 0,
        transform: 'translateY(-20px)',
        transition: 'all 0.4s',
    
        '@global': {
          hr: {
            width: '100%',
            height: 1,
            backgroundColor: '#eee',
            border: 'none',
            margin: '10px 0'
          },
    
          '.MuiSvgIcon-root': {
            fontSize: 16,
            marginRight: 5,
            verticalAlign: 'text-bottom'
          }
        }
      },
    
      '.totals': {
        height: 30,
        boxSizing: 'border-box',
        fontSize: 13,
    
        '@global > div': {
          marginRight: 15
        }
      },
    
      '.tags': {
        fontSize: 13
      },
    
      '.profile': {
        height: 50,
        display: 'flex',
        alignItems: 'flex-end',
        marginBottom: 5
      },
    }
  },
})