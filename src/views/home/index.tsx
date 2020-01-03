import React, { PropsWithChildren, useState, useEffect } from 'react'
import article from '~/api/article'
import { com, flex } from '~/styles'
import { makeStyles } from '@material-ui/styles'
import ArticleBox from '~/components/ArticleBox'
import keepAlive from '~/components/HOC/keepAlive'
import createRouter from '~/utils/createRouter'
import { useKeepAliveEffect } from 'react-keep-alive'
import Pagination from '~/components/Pagination'
import animatedScrollTo from 'animated-scroll-to'
import useSaveScroll from '~/hooks/useSaveScroll'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'

export interface Props extends RouteComponent {
  
}

interface RouteStateParams {
  reload?: boolean
}

type FinalProps = Props & DataConnectedProps

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
    [topArticles, setTopArticles] = useState<ApiData.SearchResult[]>(null as any),
    [articleList, setArticleList] = useState<PageState<ApiData.SearchResult>>(initList())

  useKeepAliveEffect(() =>{
    if(router.params.state.reload || _GLOBAL.homeRefreshMark){
      setArticleList(initList())
      load(1, true)
      loadTopArticles()
      router.clearState()
      _GLOBAL.homeRefreshMark = false
    }
  })

  useSaveScroll()

  useEffect(() =>{
    load()
    loadTopArticles()
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

  function loadTopArticles(){
    article.searchTop().then(setTopArticles)
  }

  function changePage(page: number){
    animatedScrollTo(0, { minDuration: 300, maxDuration: 300, speed: 2000 })
      .then(() => load(page))
  }

  if(!props.state.data.settings) return <div />

  return (
    <div>
      <header>
        <h2 className={com.mainTitle}>{props.state.data.settings.title}</h2>
        <p>{props.state.data.settings.title}</p>

        {topArticles ? 
          <div className={classes.topArticles}>{topArticles.map(item =>
            <ArticleBox top key={item._id} style={{ margin: 0 }}
              articleData={item}
              onClick={() => router.push('/article/view', { search: { articleId: item._id } })}
            />
          )}</div>
        : null}
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

export default keepAlive(dataHOC(Home))

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

  topArticles: {
    display: 'grid',
    gridTemplateRows: 'repeat(auto-fill, 300px)',
    gridTemplateColumns: 'repeat(2, calc(50% - 5px))',
    gridRowGap: 10,
    gridColumnGap: 10
  },
  
  articleList: {
    marginTop: 50
  }
})