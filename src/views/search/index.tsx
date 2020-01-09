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
import { PageListState, initPageList, createPageListLoader } from '~/utils/pageList'

export interface Props extends RouteComponent {
  
}

interface RouteSearchParams {
  keyword?: string
}

type FinalProps = Props

function SearchResult(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter<RouteSearchParams, {}>(),
    [articleList, setArticleList] = useState(initPageList<ApiData.SearchResult>())

  useSaveScroll()

  useEffect(() =>{
    load(1, router.params.search.keyword)
  }, [])

  function load(page = 1, keyword?: string){
    createPageListLoader(articleList, setArticleList, 
      page => article.search({ page, keyword })  
    )(page)
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