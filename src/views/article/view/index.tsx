import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import EditorViewer from 'tui-editor/dist/tui-editor-Viewer'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight
import useRouter from '~/hooks/useRouter'
import article from '~/api/article'

export interface Props {
  
}

interface RouteSearchParams {
  articleId: string
}

type FinalProps = Props

function ArticleView(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    router = useRouter<RouteSearchParams>(),
    [articleData, setArticleData] = useState<ApiData.Article>(),
    refs = {
      editor: useRef<HTMLDivElement>()
    },
    editor = useRef<EditorViewer>()
  
  useEffect(() =>{
    loadArticle(router.params.search.articleId)

  }, [])

  function loadArticle(articleId: string){
    article.get({ articleId })
      .then(data =>{
        setArticleData(data)
        editor.current = new EditorViewer({
          el: refs.editor.current!,
          initialValue: data.content
        })
      })
  }
  
  if(!articleData) return null
  return (
    <div className={classes.container}>
      <img src={articleData.headImg} className={classes.headImg} alt="headImg" />
      <div ref={refs.editor as any} className={classes.content} />
    </div>
  )
}

export default ArticleView


const useStyles = makeStyles({
  container: {
    borderRadius: 5,
    overflow: 'hidden'
  },
  
  headImg: {
    width: '100%',
    height: 300,
    objectFit: 'cover'
  },

  content: {
    backgroundColor: 'white'
  }
})