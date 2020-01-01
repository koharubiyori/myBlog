import React, { PropsWithChildren, useState, useEffect } from 'react'
import article from '~/api/article'
import { com } from '~/styles'
import { makeStyles } from '@material-ui/styles'
import keepAlive from '~/components/HOC/keepAlive'
import createRouter from '~/utils/createRouter'
import Pagination from '~/components/Pagination'
import animatedScrollTo from 'animated-scroll-to'
import useSaveScroll from '~/hooks/useSaveScroll'
import ArticleBoxPlain from '~/components/ArticleBoxPlain'

export interface Props extends RouteComponent {
  
}

interface RouteSearchParams {
  keyword?: string
}

type FinalProps = Props

const initList = () =>({
  currentPage: 1,
  total: 0,
  pageTotal: 1,
  cache: {},
  status: 1
})

function SearchResult(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter<RouteSearchParams, {}>(),
    [articleList, setArticleList] = useState<PageState<ApiData.SearchResult>>(initList())

  useSaveScroll()

  useEffect(() =>{
    load(1, router.params.search.keyword)
  }, [])

  function load(page = 1, keyword?: string){
    if(articleList.status === 2){ return }
    
    setArticleList(prevVal => ({ ...prevVal, status: 2 }))
    if(articleList.cache[page]){
      setArticleList(prevVal => ({ ...prevVal, currentPage: page, status: 3 }))
    }else{
      article.search({ page, keyword })
        .then(data =>{ 
          setArticleList(prevVal => ({
            currentPage: page,
            total: data.total,
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
        <h2 className={com.mainTitle}>搜索结果</h2>
        <p>共搜索到{articleList.total}篇文章</p>
      </header>

      <main>
        {articleList.status === 3 ? 
          <div className={classes.articleList}>{articleList.cache[articleList.currentPage].map(item =>
            <ArticleBoxPlain key={item._id} 
              articleData={item} 
              onClick={() => router.push('/article/view', { search: { articleId: item._id } })} 
            />
          )}</div>
        : null}

        {articleList.status === 3 && articleList.total !== 0 ?
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

export default keepAlive(SearchResult)

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
    marginTop: 10
  }
})