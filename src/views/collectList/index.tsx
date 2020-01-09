import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import { initPageList, createPageListLoader } from '~/utils/pageList'

export interface Props {
  
}

type FinalProps = Props & UserConnectedProps

function CollectList(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [articleList, setArticleList] = useState(initPageList())

  function load(){
    // createPageListLoader(articleList, setArticleList
    //   page => article.search({ page, exceptTop: true })
    // )(page, force)
  }

  return (
    <div>
      
    </div>
  )
}

export default userHOC(CollectList)

const useStyles = makeStyles({
  
})