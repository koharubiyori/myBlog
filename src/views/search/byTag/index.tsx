import React, { PropsWithChildren, useState, useEffect, useRef } from 'react'
import article from '~/api/article'
import { com } from '~/styles'
import { makeStyles } from '@material-ui/styles'
import keepAlive from '~/components/HOC/keepAlive'
import createRouter from '~/utils/createRouter'
import Pagination from '~/components/Pagination'
import animatedScrollTo from 'animated-scroll-to'
import useSaveScroll from '~/hooks/useSaveScroll'
import ArticleBoxPlain from '~/components/ArticleBoxPlain'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import { createPageListLoader, PageListState, initPageList } from '~/utils/pageList'
import { useKeepAliveEffect } from 'react-keep-alive'
import { setTitle, resetTitle } from '~/hooks/useSEO'
import getStates from '~/utils/getStates'
import qs from 'qs'

export interface Props extends RouteComponent {
  
}

interface RouteSearchParams {
  tagId: string
}

type FinalProps = Props & DataConnectedProps

function SearchByTagResult(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter<RouteSearchParams, {}>(),
    [articleList, setArticleList] = useState(initPageList<ApiData.SearchResult>()),
    lastLoadedTagId = useRef(router.params.search.tagId)

  const tagName = props.state.data.tags.find(item => item._id === router.params.search.tagId)?.name

  setTitle('搜索标签：' + tagName)

  useKeepAliveEffect(() => resetTitle)

  useSaveScroll()

  useEffect(() =>{
    load(router.params.search.tagId)
  }, [])

  useKeepAliveEffect(() =>{
    const {tagId} = qs.parse(window.location.search.split('?')[1])
    if(tagId !== lastLoadedTagId.current){
      setArticleList(initPageList())
      load(tagId)
    }
  })

  useKeepAliveEffect(() =>{
    return router.listen(({location, action}) =>{
      if(location.pathname === router.location.pathname){
        animatedScrollTo(0, { maxDuration: 500, minDuration: 500, speed: 2000 })
          .then(() =>{
            const router = createRouter<RouteSearchParams>(location)
            setArticleList(initPageList())
            load(router.params.search.tagId)
          })
      }
    })
  })

  function load(tagId: string, page = 1){
    lastLoadedTagId.current = tagId
    const [articleList] = getStates<[PageListState<ApiData.SearchResult>]>(setArticleList)
    createPageListLoader(articleList, setArticleList, 
      page => article.searchByTag({ page, tagId })  
    )(page)
  }

  function changePage(page: number){
    animatedScrollTo(0, { minDuration: 300, maxDuration: 300, speed: 2000 })
      .then(() => load(router.params.search.tagId, page))
  }

  if(!props.state.data.tags) return <div />

  return (
    <div>
      <header>
        <h2 className={com.mainTitle}>标签“{tagName}”下的文章</h2>
        <p>共有{articleList.total}篇文章</p>
      </header>

      <main>
        {articleList.status === 3 && articleList.cache[articleList.currentPage] ? 
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

export default keepAlive(dataHOC(SearchByTagResult))

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