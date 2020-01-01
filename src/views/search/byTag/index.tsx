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
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import resetComponentProps from '~/utils/resetComponentProps'

export interface Props extends RouteComponent {
  
}

interface RouteSearchParams {
  tagId: string
}

type FinalProps = Props & DataConnectedProps

const initList = () =>({
  currentPage: 1,
  total: 0,
  pageTotal: 1,
  cache: {},
  status: 1
})

function SearchByTagResult(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    router = createRouter<RouteSearchParams, {}>(),
    [articleList, setArticleList] = useState<PageState<ApiData.SearchResult>>(initList())

  useSaveScroll()

  useEffect(() =>{
    load(router.params.search.tagId)
  }, [])

  function load(tagId: string, page = 1){
    if(articleList.status === 2){ return }
    
    setArticleList(prevVal => ({ ...prevVal, status: 2 }))
    if(articleList.cache[page]){
      setArticleList(prevVal => ({ ...prevVal, currentPage: page, status: 3 }))
    }else{
      article.searchByTag({ page, tagId })
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
      .then(() => load(router.params.search.tagId, page))
  }

  if(!props.state.data.tags) return <div />

  const tagName = props.state.data.tags.find(item => item._id === router.params.search.tagId)?.name
  return (
    <div>
      <header>
        <h2 className={com.mainTitle}>标签“{tagName}”下的文章</h2>
        <p>共有{articleList.total}篇文章</p>
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

export default keepAlive(
  resetComponentProps<Props>(
    dataHOC(SearchByTagResult)
  )
)

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