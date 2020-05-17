import React, { PropsWithChildren, useState, useEffect, FC, createContext, useRef } from 'react'
import { makeStyles, Tabs, Tab } from '@material-ui/core'
import { userHOC, UserConnectedProps } from '~/redux/user/HOC'
import createRouter from '~/utils/createRouter'
import { appBarHeight } from '../myAppBar'
import ArticleBox from './components/ArticleBox'
import article from '~/api/article'
import { ReactComponent as TagIcon } from '~/images/sub/tag.svg'
import { flex } from '~/styles'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import styleVars from '~/styles/styleVars'
import katakoto from '~/api/katakoto'
import idToMoment from '~/utils/idToMoment'
import animateScrollTo from 'animated-scroll-to'
import useInfiniteListData from '~/hooks/useInfiniteListData'

export const sidebarRightWidth = 280

export interface Props {
  getRef?: React.MutableRefObject<any>
}

export interface SidebarRightRef {
  setVisible (val: boolean): void
  setDisabledResizeHandler (val: boolean): void
  writeContent (content?: JSX.Element | null): void
}

type FinalProps = Props & UserConnectedProps & DataConnectedProps

function SidebarRight(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(), 
    router = createRouter(),
    [visible, setVisible] = useState(true),
    [Content, setContent] = useState<FC | null>(null),    // 用于动态侧栏内容
    [activeTab, setActiveTab] = useState(0),
    [randomArticles, setRandomArticles] = useState<ApiData.SearchResult[]>([]),
    [hotArticles, setHotArticles] = useState<ApiData.SearchResult[]>([]),
    katakotoList = useInfiniteListData<ApiData.Katakoto>(loadKatakotoList),
    [katakotoCursor, setKatakotoCursor] = useState(0),
    refs = {
      katakotos: useRef<HTMLDivElement>(null)
    }

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
    katakotoList.loadNext()
  }, [])

  useEffect(() =>{
    const key = setInterval(() =>{
      if (katakotoList.list.length - katakotoCursor < 3) katakotoList.loadNext()

      setKatakotoCursor(prevVal => prevVal + 1 === katakotoList.list.length ? 0 : prevVal + 1)
    }, 7000)
    return () => clearInterval(key) 
  }, [katakotoList])

  useEffect(() =>{
    refs.katakotos.current && animateScrollTo([(sidebarRightWidth - 20) * katakotoCursor, null], { 
      elementToScroll: refs.katakotos.current
    })
  }, [katakotoCursor])

  function setDisabledResizeHandler(val: boolean){
    disabledResizeHandler = val
  }

  function getRandomArticles(){
    article.searchRandom().then(setRandomArticles)
  }

  function getHotArticles(){
    article.searchHot().then(setHotArticles)
  }

  function loadKatakotoList(page: number){
    return katakoto.load({ page, limit: 20 })
      .then(data => {
        return {
          list: data.list,
          currentPage: data.currentPage,
          totalPage: data.pageTotal
        }
      })
  }

  if(!props.state.data.tags) return <div />

  return (
    visible ?
      <>
        <div className={c(classes.root, 'sidebarRight-root')}>
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

              <div>
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

          <h4 style={{ fontWeight: 'initial', textIndent: 10 }}>只言片语</h4>
          <div className={classes.katakotos} ref={refs.katakotos}>
            <div className="container">
              {katakotoList.list.map(item =>
                <div key={item._id} className="item">
                  <div style={{ fontSize: 14, marginLeft: 10 }}>{item.content}</div>
                  <div style={{ textAlign: 'right', fontSize: 13, marginTop: 10 }}>
                    <span>—— </span> 
                    <span>{idToMoment(item._id).format(
                      (idToMoment(item._id).year() === new Date().getFullYear() ? '' : 'YYYY年')
                    + 'MM月DD日 HH:mm')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h4 style={{ fontWeight: 'initial', textIndent: 10 }}>内容标签</h4>
          <div className={c(flex.row, flex.crossCenter, flex.wrap, classes.tags)}>
            {props.state.data.tags.map(tag =>
              <div 
                className="tag" 
                key={tag._id} 
                onClick={() => router.push('/search/byTag', { search: { tagId: tag._id } })}
                title="查看标签下文章"
              >
                <TagIcon style={{ marginRight: 5, width: 14, height: 14, fill: 'white', verticalAlign: 'text-bottom' }} />
                <span>{tag.name}</span>
              </div>  
            )}
          </div>
        </div>

        <div style={{ width: sidebarRightWidth }} />
      </>
    : null
  )
}

export default dataHOC(userHOC(SidebarRight)) as FC<Props>

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: sidebarRightWidth,
    paddingTop: appBarHeight,
    boxShadow: '0 0 5px #666',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  katakotos: {
    margin: 10,
    width: sidebarRightWidth - 20,
    overflow: 'hidden',

    '@global': {
      '.container': {
        width: 'max-content',
        overflow: 'hidden'
      },
      
      '.item': {
        width: sidebarRightWidth - 20,
        float: 'left',
        paddingRight: 10,
        boxSizing: 'border-box'
      }
    }
  },

  tags: {
    width: 'auto !important',
    fontSize: 12,
    margin: 10,
    marginTop: 0,

    '@global .tag': {
      transition: 'all 0.2s',
      borderRadius: 5,
      padding: 5,
      marginTop: 5,
      marginRight: 5,
      backgroundColor: styleVars.main,
      fill: 'white',
      color: 'white',
      cursor: 'pointer',
      
      '&:hover': {
        backgroundColor: styleVars.dark
      },

      '& svg': {
        position: 'relative',
        top: -1
      }
    }
  },
})