import React, { useState, useEffect, useRef, PropsWithChildren, useContext } from 'react'
import { makeStyles, Box } from '@material-ui/core'
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
import TagIcon from '~/components/icons/tag'
import idToMoment from '~/utils/idToMoment'
import { flex } from '~/styles'
import resetComponentProps from '~/utils/resetComponentProps'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import styleVars from '~/styles/styleVars'
import ArticleComment from './comment'
import ArticleContents from './Contents'
import { MainLayoutContext } from '~/views/mainLayout'

export interface Props {
  
}

interface RouteSearchParams {
  articleId: string
}

type FinalProps = Props & DataConnectedProps

function ArticleView(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    router = createRouter<RouteSearchParams>(),
    mainLayoutControllersPromise = useContext(MainLayoutContext),
    [articleData, setArticleData] = useState<ApiData.Article>(),
    refs = {
      editor: useRef<HTMLDivElement>()
    },
    editor = useRef<EditorViewer>()


  useEffect(() =>{
    loadArticle(router.params.search.articleId)

    return () =>{
      mainLayoutControllersPromise.then(controllers =>{
        controllers.sidebarRight.writeContent()
      })
    }
  }, [])

  function loadArticle(articleId: string){
    article.get({ articleId })
      .then(data =>{
        setArticleData(data)
        props.$data.getTags().then(tagList => tagList)
        editor.current = new EditorViewer({
          el: refs.editor.current!,
          initialValue: data.content
        })

        let titles = Array.from(refs.editor.current!.querySelectorAll('h1, h2, h3')).map((item, index) =>{
          let level = parseInt(item.tagName[1])
          let id = `articleTitle-${index}-${level}`
          let name = item.textContent!
          let offset = Math.floor(item.getBoundingClientRect().top)

          item.setAttribute('id', id)

          return { level, id, name, offset }
        })

        // 生成序号
        let lastLevel = 0,                 // 上个title的等级
            numbers: string[] = [],           // 生成序号的结果，长度和titles相同
            currentNumber: number[] = []   // 当前序号，根据这个来序列化序号字符串
        titles.forEach(item =>{
          // 如果结果集为空(第一次循环)，则直接记录一个1
          if(numbers.length === 0){
            numbers.push('1')
            currentNumber.push(1)
            lastLevel = item.level
            return true
          }

          if(item.level > lastLevel){   // 当前等级大于最后等级(由大标题进入小标题)
            currentNumber.push(1)
          }else if(item.level === lastLevel){   // 进入同级标题
            // currentNumber的最后一个值+1
            let lastEndNumber = currentNumber[currentNumber.length - 1]
            currentNumber.splice(currentNumber.length - 1, 1, lastEndNumber + 1)
          }else{    // 由小标题进入大标题
            // 计算要退出几层（例如：三级标题下紧挨着一级标题，则：3 - 1）
            let upLevel = lastLevel - item.level
            // 利用splice返回删除元素的特性，将删除元素再赋给current，实现一个从尾部删除的效果
            currentNumber = currentNumber.splice(0, currentNumber.length - upLevel)

            let lastEndNumber = currentNumber[currentNumber.length - 1]
            currentNumber.splice(currentNumber.length - 1, 1, lastEndNumber + 1)
          }

          lastLevel = item.level
          numbers.push(currentNumber.join('.'))
        })

        mainLayoutControllersPromise.then(controllers =>{
          controllers.sidebarRight.writeContent(
            <ArticleContents titles={titles} />
          )
        })
      })
  }

  function tagNames(tagIds: string[]): string[]{
    const {tags} = props.state.data
    if(!tags) return []
    return tagIds.map(tagId => tags.find(tagObj => tagObj._id === tagId)!.name)
  }
  
  if(!articleData) return null
  return (
    <div>
      <header>
        <h2 className={classes.title}>{articleData.title}</h2>
        <div className={c(flex.row, flex.center, classes.info)}>
          <div>
            <WatchLaterIcon />
            <span>{idToMoment(articleData._id).format('YYYY年MM月DD日')}</span>
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

        <div className={c(flex.row, flex.crossCenter, classes.tags)}>{tagNames(articleData.tags).map(tagName =>
          <div className="tag" key={tagName} title={`查看“${tagName}”分类下所有文章`}>
            <TagIcon style={{ marginRight: 5 }} />
            <span>{tagName}</span>
          </div>  
        )}</div>
      </header>
     
      <Box boxShadow={2} className={classes.container}>
        <img src={articleData.headImg} className={classes.headImg} alt="headImg" />
        <div className={classes.content}>
          <div className={classes.profile}>{articleData.profile}</div>
          <div ref={refs.editor as any} className={classes.markdownViewer} />
        </div>
      </Box>

      <ArticleComment articleData={articleData} />
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
    fontSize: 14,

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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
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

  markdownViewer: {

  }
})