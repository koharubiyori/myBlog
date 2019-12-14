import React, { PropsWithChildren, useState } from 'react'
import classes from './index.module.scss'
import article from '~/api/article'

export interface Props {
  
}

type FinalProps = Props

function Home(props: PropsWithChildren<FinalProps>){
  const [articleList, setArticleList] = useState<PageState<ApiData.SearchResult>>({
    currentPage: 1,
    pageTotal: 1,
    list: [],
    status: 1
  })

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
        <h2 {...c('com-mainTitle')}>小春日和の小窝</h2>
        <p>明日もきっと、こはるびよりなんです。</p>
      </header>
    </div>
  )
}

export default Home