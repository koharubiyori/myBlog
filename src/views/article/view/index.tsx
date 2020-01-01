import React, { useState, useEffect, useRef, PropsWithChildren, useContext } from 'react'
import { makeStyles, Box, Tooltip } from '@material-ui/core'
import EditorViewer from 'tui-editor/dist/tui-editor-Viewer'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight
import article from '~/api/article'
import createRouter from '~/utils/createRouter'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import ForumIcon from '@material-ui/icons/Forum'
import VisibilityIcon from '@material-ui/icons/Visibility'
import StarsIcon from '@material-ui/icons/Stars'
import { ReactComponent as TagIcon } from '~/images/sub/tag.svg'
import idToMoment from '~/utils/idToMoment'
import { flex, transition } from '~/styles'
import resetComponentProps from '~/utils/resetComponentProps'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import styleVars, { createTransition } from '~/styles/styleVars'
import ArticleComment, { ArticleCommentRef } from './components/comment'
import ArticleContents, { ArticleContentsRef } from './Contents'
import { MainLayoutContext } from '~/views/mainLayout'
import parseTitles from './utils/parseTitles'
import trimArticleContent from './utils/trimArticleContent'
import useArticleContentStyles from './styles/articleContent'
import qs from 'qs'
import animatedScrollTo from 'animated-scroll-to'
import { CSSTransition } from 'react-transition-group'

export interface Props {
  
}

interface RouteSearchParams {
  articleId: string
}

interface ArticleCache {
  [articleId: string]: {
    data: ApiData.Article
    scroll: number
  }
}

type FinalProps = Props & DataConnectedProps

function ArticleView(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    articleContentStyles = useArticleContentStyles(),
    router = createRouter<RouteSearchParams>(),
    mainLayoutControllersPromise = useContext(MainLayoutContext),
    [visible, setVisible] = useState(false),
    [articleData, setArticleData] = useState<ApiData.Article>(null as any),
    refs = {
      editor: useRef<HTMLDivElement>(),
      comment: useRef<ArticleCommentRef>(),
      contents: useRef<ArticleContentsRef>(),
    },
    editor = useRef<EditorViewer>(),
    articleCache = useRef<ArticleCache>({})

  useEffect(() =>{
    loadArticle(router.params.search.articleId)

    return () =>{
      mainLayoutControllersPromise.then(controllers =>{
        controllers.sidebarRight.writeContent()
      })
    }
  }, [])

  useEffect(() =>{
    return router.listen(({location, action}) =>{
      if(location.pathname === router.location.pathname){
        // 加载新的文章时，缓存上一篇文章的进度条位置
        setArticleData(prevVal =>{
          if(prevVal){
            articleCache.current[prevVal._id].scroll = window.scrollY
          }
          
          return prevVal
        })

        animatedScrollTo(0, { maxDuration: 500, minDuration: 500, speed: 2000 })
          .then(() =>{
            loadArticle(qs.parse(location.search.split('?')[1]).articleId)
            refs.comment.current!.load()
          })
      }
    })
  }, [])
  
  function loadArticle(articleId: string, force = false){    
    if(!force && articleCache.current[articleId]){
      const {data, scroll} = articleCache.current[articleId]
      writeContent(data)
      setTimeout(() =>{
        window.scrollTo(0, scroll)
        refs.contents.current!.setWindowScrollY(scroll)
      })
    }else{
      setVisible(false)
      article.get({ articleId })
        .then(data =>{
          writeContent(data)
          setVisible(true)
        })
    }
  }

  function writeContent(articleData: ApiData.Article){
    articleCache.current[articleData._id] = {
      data: articleData,
      scroll: 0
    }

    setArticleData(articleData)
    setTimeout(() =>{
      props.$data.getTags().then(tagList => tagList)
      editor.current = new EditorViewer({
        el: refs.editor.current!,
        initialValue: articleData.content
      })

      let titles = parseTitles(refs.editor.current!)

      mainLayoutControllersPromise.then(controllers =>{
        controllers.sidebarRight.writeContent(
          <ArticleContents titles={titles} getRef={refs.contents} />
        )
      })

      trimArticleContent(refs.editor.current!)
    })
  }

  function tags(tagIds: string[]): ApiData.Tag[]{
    const {tags} = props.state.data
    if(!tags) return []
    return tagIds.map(tagId => tags.find(tagObj => tagObj._id === tagId)!)
  }
  
  return (
    <div>
      <CSSTransition unmountOnExit in={visible} timeout={600} classNames={transition.fadeSink}>
        {visible ? 
          <header>
            <h2 className={classes.title}>{articleData.title}</h2>
            <div className={c(flex.row, flex.center, classes.info)}>
              <div className={classes.infoBox} style={{ backgroundColor: '#007FFF' }}>
                <WatchLaterIcon />
                <span>{idToMoment(articleData._id).format('YYYY年MM月DD日')}</span>
              </div>
              
              <div className={classes.infoBox} style={{ backgroundColor: '#04B431' }}>
                <VisibilityIcon />
                <span>{articleData.readNum} 次浏览</span>
              </div>
              
              <div className={classes.infoBox} style={{ backgroundColor: '#370B5F' }}>
                <ForumIcon />
                <span>{articleData.commentTotal} 条评论</span>
              </div>

              <div className={classes.infoBox} style={{ backgroundColor: '#B40486' }}>
                <StarsIcon />
                <span>{articleData.collectTotal} 人收藏</span>
              </div>
            </div>

            <div className={c(flex.row, flex.crossCenter, classes.tags)}>{tags(articleData.tags).map(tag =>
              <div 
                className="tag" 
                key={tag._id} 
                title={`查看“${tag.name}”分类下所有文章`}
                onClick={() => router.push('/search/byTag', { search: { tagId: tag._id } })}
              >
                <TagIcon style={{ marginRight: 5, width: 14, height: 14, fill: 'white', verticalAlign: 'text-bottom' }} />
                <span>{tag.name}</span>
              </div>  
            )}</div>
          </header>
        : <div />}
      </CSSTransition>
     
      <CSSTransition unmountOnExit in={visible} timeout={700} classNames={transition.fadeFloat}>
        {visible ? 
          <main>
            <Box boxShadow={2} className={classes.container}>
              <img src={articleData.headImg} className={classes.headImg} alt="headImg" />
              <div className={classes.content}>
                <div className={classes.profile}>{articleData.profile}</div>
                <div ref={refs.editor as any} className={c(articleContentStyles.main)} />
              </div>
            </Box>

            <div className={c(flex.row, flex.between)}>
              {articleData.lastArticle ? 
                <Tooltip 
                  title={articleData.lastArticle.title} 
                  placement="right"
                  classes={{ tooltip: classes.toolTip }}
                >
                  <div 
                    className={classes.lastNextBtn} 
                    onClick={() => router.push('/article/view', { search: { articleId: articleData.lastArticle._id } })}
                  >上一篇</div>
                </Tooltip>

              : <div />}

              {articleData.nextArticle ? 
                <Tooltip 
                  title={articleData.nextArticle.title} 
                  placement="left"
                  classes={{ tooltip: classes.toolTip }}
                >
                  <div 
                    className={classes.lastNextBtn} 
                    onClick={() => router.push('/article/view', { search: { articleId: articleData.nextArticle._id } })}
                  >上一篇</div>
                </Tooltip>
              : <div />}
            </div>
            
            <ArticleComment articleId={router.params.search.articleId} getRef={refs.comment} />
          </main>
        : <div />}
      </CSSTransition>
    </div>
  )
}

export default resetComponentProps<Props>(
  dataHOC(ArticleView)
)


const useStyles = makeStyles({
  title: {
    textAlign: 'center',
    color: 'white',
    textShadow: '0 0 3px black',
  },

  info: {
    fontSize: 13,

    '@global': {
      '> div': {
        marginRight: 10,
      },

      '.MuiSvgIcon-root': {
        fontSize: 16,
        marginRight: 5,
        verticalAlign: 'text-bottom',
      }
    }
  },

  infoBox: {
    borderRadius: 5,
    padding: '5px 7px',
    color: 'white',
  },

  tags: {
    fontSize: 13,
    marginTop: 10,

    '@global .tag': {
      transition: 'all 0.2s',
      borderRadius: 5,
      padding: 5,
      marginRight: 10,
      backgroundColor: styleVars.main,
      fill: 'white',
      color: 'white',
      cursor: 'pointer',
      
      '&:hover': {
        opacity: 0.8
      },

      '& svg': {
        position: 'relative',
        top: -1
      }
    }
  },

  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10
  },
  
  headImg: {
    width: '100%',
    height: 300,
    objectFit: 'cover'
  },

  content: {
    boxSizing: 'border-box',
    padding: '15px 20px 20px 20px',
  },

  profile: {
    margin: '10px 0',
  },

  lastNextBtn: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    boxShadow: '0 0 5px white',
    marginTop: 20,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',

    '&:hover': {
      backgroundColor: 'white'
    }
  },

  toolTip: {
    fontSize: 13
  }
})