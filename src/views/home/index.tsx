import React, { PropsWithChildren, useState, useEffect } from 'react'
import article from '~/api/article'
import { com } from '~/styles'
import { makeStyles } from '@material-ui/styles'
import ArticleBox from '~/components/ArticleBox'
import keepAlive from '~/components/HOC/keepAlive'
import createRouter from '~/utils/createRouter'
import { useKeepAliveEffect } from 'react-keep-alive'

export interface Props extends RouteComponent {
  
}

interface RouteStateParams {
  reload?: boolean
}

type FinalProps = Props

const initList = () =>({
  currentPage: 1,
  pageTotal: 1,
  list: [],
  status: 1
})

function Home(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter<{}, RouteStateParams>(),
    [articleList, setArticleList] = useState<PageState<ApiData.SearchResult>>(initList())

  useKeepAliveEffect(() =>{
    if(router.params.state.reload){
      setArticleList(initList())
      load()
      router.clearState()
    }
  })

  useEffect(() =>{
    load()
  }, [])

  function load(page = 1, keyword?: string){
    if(articleList.status === 2){ return }
    
    setArticleList(prevVal => ({ ...prevVal, status: 2 }))
    article.search({ page, keyword })
      .then(data =>{ 
        let status = 3
        if(data.list.length === data.total) status = 4
        if(data.total === 0) status = 5

        setArticleList(prevVal => ({
          currentPage: data.currentPage,
          pageTotal: prevVal.pageTotal,
          list: prevVal.list.concat(data.list),
          status
        }))        
      })
      .catch(e =>{
        console.log(e)
        setArticleList(prevVal => ({ ...prevVal, status: 0 }))
      })
  }

  return (
    <div>
      <header>
        <h2 className={com.mainTitle}>小春日和の小窝</h2>
        <p>明日もきっと、こはるびよりなんです。</p>
        {articleList.status === 3 || articleList.status === 4 ? 
          <div className={classes.articleList}>{articleList.list.map(item =>
            <ArticleBox articleData={item} key={item._id} onClick={() => router.push('/article/view', { search: { articleId: item._id } })} />  
          )}</div>
        : null}
      </header>
    </div>
  )
}

export default keepAlive(Home)

const useStyles = makeStyles({
  '@global .mainLayout-content:not(foo)': {
    backgroundColor: 'transparent'
  },
  
  articleList: {
    marginTop: 50
  }
})