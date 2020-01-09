import { makeStyles, Box } from '@material-ui/core'
import animatedScrollTo from 'animated-scroll-to'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import article from '~/api/article'
import ArticleBox from '~/components/ArticleBox'
import Pagination from '~/components/Pagination'
import { UserConnectedProps, userHOC } from '~/redux/user/HOC'
import { com } from '~/styles'
import { createPageListLoader, initPageList } from '~/utils/pageList'

export interface Props {
  
}

type FinalProps = Props & UserConnectedProps

function CollectList(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [articleList, setArticleList] = useState(initPageList<ApiData.SearchResult>())

  useEffect(() =>{
    load()
  }, [])

  function load(page = 1){
    createPageListLoader(articleList, setArticleList,
      page => article.searchByUserCollect({ page })
    )(page)
  }

  function changePage(page: number){
    animatedScrollTo(0, { minDuration: 300, maxDuration: 300, speed: 2000 })
      .then(() => load(page))
  }

  return (
    <div>
      <h2 className={com.mainTitle}>收藏列表</h2>
      {articleList.status === 3 && articleList.total !== 0 ?
        <>
          <div className={classes.container}>{articleList.cache[articleList.currentPage].map(item =>
            <ArticleBox key={item._id} articleData={item} />
          )}</div>

          <Pagination 
            style={{ marginTop: 40 }}
            pageTotal={articleList.pageTotal}
            current={articleList.currentPage}
            onChangePage={changePage}
          />
        </>
      : 
        <Box boxShadow={2} className={classes.noData}>暂无收藏的文章</Box>
      }
    </div>
  )
}

export default userHOC(CollectList)

const useStyles = makeStyles({
  container: {
    marginTop: 40
  },

  noData: {
    textAlign: 'center',
    lineHeight: '120px',
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  }
})