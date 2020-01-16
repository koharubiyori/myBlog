import { Box, makeStyles, Tooltip } from '@material-ui/core'
import ForumIcon from '@material-ui/icons/Forum'
import StarsIcon from '@material-ui/icons/Stars'
import VisibilityIcon from '@material-ui/icons/Visibility'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import animatedScrollTo from 'animated-scroll-to'
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight
import React, { FC, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import Editor from 'tui-editor'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import article from '~/api/article'
import { ReactComponent as TagIcon } from '~/images/sub/tag.svg'
import { DataConnectedProps, dataHOC } from '~/redux/data/HOC'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'
import { flex, transition } from '~/styles'
import styleVars from '~/styles/styleVars'
import createRouter from '~/utils/createRouter'
import idToMoment from '~/utils/idToMoment'
import { MainLayoutContext } from '~/views/mainLayout'
import ArticleComment, { ArticleCommentRef } from './components/comment'
import ArticleContents, { ArticleContentsRef } from './Contents'
import parseTitles from './utils/parseTitles'
import trimArticleContent from './utils/trimArticleContent'
import useArticleContentClasses from '../styles/articleContent'
import moment from 'moment'
import getNotify from '~/externalContexts/notify'
import useSEO from '~/hooks/useSEO'
import bindImgViewer from './utils/bindImgViewer'

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

type FinalProps = Props & DataConnectedProps & UserConnectedProps

function ArticleView(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    articleContentClasses = useArticleContentClasses(),
    router = createRouter<RouteSearchParams>(),
    notify = getNotify(),
    mainLayoutControllersPromise = useContext(MainLayoutContext),
    [visible, setVisible] = useState(false),
    [articleData, setArticleData] = useState<ApiData.Article>(null as any),
    refs = {
      editor: useRef<HTMLDivElement>(),
      comment: useRef<ArticleCommentRef>(),
      contents: useRef<ArticleContentsRef>(),
    },
    editor = useRef<Editor | tuiEditor.Viewer>(),
    articleCache = useRef<ArticleCache>({})

  useSEO((setTitle) =>{
    articleData && setTitle(articleData.title, articleData.profile)  
  }, [articleData])
    
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
            const router = createRouter<RouteSearchParams>(location)
            loadArticle(router.params.search.articleId)
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

    if(props.$user.getRole() !== 'visitor'){
      article.getCollectStatus({ articleId: router.params.search.articleId })
        .then(data =>{
          mainLayoutControllersPromise.then(controllers =>{
            controllers.actionsButton.setIsCollected(data.collectStatus)
          })
        })
    }

    setTimeout(() =>{
      props.$data.getTags().then(tagList => tagList)
      editor.current = Editor.factory({
        viewer: true,
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
      bindImgViewer(refs.editor.current!)
    })
  }

  function copyLink(){
    let input = document.createElement('input')
    input.value = window.location.href
    input.style.cssText = 'position:fixed; left:-9999px'
    document.body.appendChild(input)
    input.focus()
    document.execCommand('selectAll')
    document.execCommand('copy')
    notify('已复制链接至剪切板')
    setTimeout(() => document.body.removeChild(input), 1000)
  }

  function tags(tagIds: string[]): ApiData.Tag[]{
    const {tags} = props.state.data
    if(!tags) return []
    return tagIds
      .filter(tagId => tags.some(item => item._id === tagId))
      .map(tagId => tags.find(tagObj => tagObj._id === tagId)!)
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

            <div className={c(flex.row, flex.crossCenter, flex.wrap, classes.tags)}>{tags(articleData.tags).map(tag =>
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
                <div ref={refs.editor as any} className={c(articleContentClasses.main)} />

                <div className={classes.cc}>
                  <p>版权声明：本文为原创文章，版权归 小春日和 所有</p>
                  <p>文章链接：
                    <Tooltip 
                      title="复制链接至剪切板"
                      placement="top"
                      classes={{ tooltip: classes.toolTip }}
                    >
                      <span style={{ color: styleVars.main, textDecoration: 'underline', cursor: 'pointer' }} onClick={copyLink}>{window.location.href}</span>
                    </Tooltip>
                  </p>
                  <p>
                    所有原创文章采用&nbsp;
                    <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh" 
                      target="_blank"
                      style={{ color: styleVars.main }}
                    >署名-非商业性使用 4.0 国际 (CC BY-NC 4.0)</a>
                    &nbsp;进行许可。
                  </p>
                  <p>您可以自由转载和修改，但必须保证在显著位置注明文章来源，且不能用于商业目的。</p>
                </div>

                <div className={c(flex.row, flex.between)} style={{ marginTop: 30, fontSize: 12, color: '#666' }}>
                  <span>最后修改日期：{moment(articleData.updatedAt).format('YYYY年MM月DD日 HH:mm')}</span>
                  <span>© 著作权归作者所有</span>
                </div>
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
                  >下一篇</div>
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

export default userHOC(dataHOC(ArticleView)) as FC<Props>

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
      marginTop: 5,
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
  },

  cc: {
    backgroundColor: 'white',
    boxSizing: 'border-box',
    borderLeft: `7px ${styleVars.main} solid`,
    padding: '10px 15px',
    fontSize: 14,
    marginTop: 50
  }
})