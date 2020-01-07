import React, { PropsWithChildren, useState, useEffect, FC, createContext } from 'react'
import { makeStyles, Tabs, Tab } from '@material-ui/core'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import createRouter from '~/utils/createRouter'
import { appBarHeight } from '../myAppBar'
import ArticleBox from './components/ArticleBox'
import article from '~/api/article'

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface SidebarRightRef {
  setVisible (val: boolean): void
  setDisabledResizeHandler (val: boolean): void
  writeContent (content?: JSX.Element | null): void
}

type FinalProps = Props & UserConnectedProps

function SidebarRight(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(), 
    router = createRouter(),
    [visible, setVisible] = useState(true),
    [Content, setContent] = useState<FC | null>(null),
    [activeTab, setActiveTab] = useState(0),
    [randomArticles, setRandomArticles] = useState<ApiData.SearchResult[]>([]),
    [hotArticles, setHotArticles] = useState<ApiData.SearchResult[]>([])

  let disabledResizeHandler = false

  if(props.getRef) props.getRef.current = { 
    setVisible, 
    setDisabledResizeHandler,
    writeContent: (content = null) => setContent(() => content ? () => content : null)  
  }

  useEffect(() =>{
    const resizeHandler = () =>{
      if(disabledResizeHandler){ return }
      setVisible(window.innerWidth >= 1060)
    }
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  useEffect(() =>{
    getRandomArticles()
    getHotArticles()
  }, [])

  function setDisabledResizeHandler(val: boolean){
    disabledResizeHandler = val
  }

  function getRandomArticles(){
    article.searchRandom().then(setRandomArticles)
  }

  function getHotArticles(){
    article.searchHot().then(setHotArticles)
  }

  return (
    visible ?
      <>
        <div className={classes.root}>
          {Content ? 
            <Content />
          :
            <div>
              <Tabs
                variant="fullWidth"
                value={activeTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={(e, newVal) => setActiveTab(newVal)}
              >
                <Tab label="随机文章" style={{ minWidth: 'auto' }} />
                <Tab label="热门文章" style={{ minWidth: 'auto' }} />
              </Tabs>

              <div className={classes.tabContent}>
                {activeTab === 0 ?
                  randomArticles.map(item => <ArticleBox 
                    key={item._id}
                    articleData={item}
                    onClick={() => router.push('/article/view', { search: { articleId: item._id } })}
                  />)
                :
                  hotArticles.map(item => <ArticleBox 
                    key={item._id}
                    articleData={item}
                    onClick={() => router.push('/article/view', { search: { articleId: item._id } })}
                  />)
                }
              </div>
            </div>
          }
        </div>

        <div style={{ width: 220 }} />
      </>
    : null
  )
}

export default userHOC(SidebarRight) as FC<Props>

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 220,
    paddingTop: appBarHeight,
    boxShadow: '0 0 5px #666'
  },

  tabContent: {
    
  }
})