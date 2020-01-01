import React, { PropsWithChildren, useState, useEffect } from 'react'
import article from '~/api/article'
import { com } from '~/styles'
import { makeStyles } from '@material-ui/styles'
import ArticleBox from '~/components/ArticleBox'
import keepAlive from '~/components/HOC/keepAlive'
import createRouter from '~/utils/createRouter'
import { useKeepAliveEffect } from 'react-keep-alive'
import Pagination from '~/components/Pagination'
import animatedScrollTo from 'animated-scroll-to'
import useSaveScroll from '~/hooks/useSaveScroll'

export interface Props extends RouteComponent {
  
}

interface RouteStateParams {
  reload?: boolean
}

type FinalProps = Props

const initList = () =>({
  currentPage: 1,
  total: 0,
  pageTotal: 1,
  cache: {},
  status: 1
})

function Home(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter<{}, RouteStateParams>(),
    [articleList, setArticleList] = useState<PageState<ApiData.SearchResult>>(initList())

  useKeepAliveEffect(() =>{
    if(router.params.state.reload || _GLOBAL.homeRefreshMark){
      setArticleList(initList())
      load(1, true)
      router.clearState()
      _GLOBAL.homeRefreshMark = false
    }
  })

  useSaveScroll()

  useEffect(() =>{
    load()
  }, [])

  function load(page = 1, force = false){
    if(articleList.status === 2){ return }
    
    setArticleList(prevVal => ({ ...prevVal, status: 2 }))
    if(articleList.cache[page] && !force){
      setArticleList(prevVal => ({ ...prevVal, currentPage: page, status: 3 }))
    }else{
      article.search({ page, exceptTop: true })
        .then(data =>{ 
          setArticleList(prevVal => ({
            total: data.total,
            currentPage: page,
            pageTotal: data.pageTotal,
            cache: {
              ...prevVal.cache,
              [page]: data.list
            },
            status: 3
          }))      
        })
        .catch(e =>{
          console.log(e)
          setArticleList(prevVal => ({ ...prevVal, status: 0 }))
        })
    }
  }

  function changePage(page: number){
    animatedScrollTo(0, { minDuration: 300, maxDuration: 300, speed: 2000 })
      .then(() => load(page))
  }

  return (
    <div>
      <header>
        <h2 className={com.mainTitle}>小春日和の小窝</h2>
        <p>明日もきっと、こはるびよりなんです。</p>
      </header>

      <main>
        {articleList.status === 3 ? 
          <div className={classes.articleList}>{articleList.cache[articleList.currentPage].map(item =>
            <ArticleBox key={item._id} 
              articleData={item} 
              onClick={() => router.push('/article/view', { search: { articleId: item._id } })} 
            />
          )}</div>
        : null}

        {articleList.status === 3 ?
          <Pagination 
            style={{ animation: 'fadeSink 0.2s' }}
            pageTotal={articleList.pageTotal}
            current={articleList.currentPage}
            onChangePage={changePage}
          />
        : null}
      </main>
    </div>
  )
}

export default keepAlive(Home)

const useStyles = makeStyles({
  '@global .mainLayout-content:not(foo)': {
    backgroundColor: 'transparent'
  },

  '@global @keyframes fadeSink': {
    from: {
      opacity: 0,
      transform: 'translateY(-30px)'
    }
  },
  
  articleList: {
    marginTop: 50
  }
})