import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/core'
import styleVars from '~/styles/styleVars'
import animateScrollTo from 'animated-scroll-to'

const marginTopForAppBar = 70   // 让出绝对定位的头部appBar高度
const marginTopForScrollTo = 10   // 每个标题的判定位置都向后减少该数值，确保点击目录标题跳转后，虽然还没划过标题，但依然显示点击的标题为当前选中标题

export interface Title{
  level: number
  id: string
  name: string
  number: string
  offset: number
}

export interface Props {
  titles: Title[]
}

type FinalProps = Props

function ArticleContents(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [windowScrollY, setWindowScrollY] = useState(window.scrollY),
    scrollLock = useRef(false),
    closeScrollLockTimeoutKey = useRef(0)
  let isMaxLevel2 = !props.titles.some(item => item.level === 1)    // 判断如果没有level为1的，那么认定最高标题等级为2(不考虑只有3级标题的情况)
    
  useEffect(() =>{
    const windowScrollHandler = () =>{
      setWindowScrollY(window.scrollY)
    }
    window.addEventListener('scroll', windowScrollHandler)

    return () => window.removeEventListener('scroll', windowScrollHandler)
  }, [])

  // 每隔1秒，执行一次已激活title的scrollIntoView方法
  useEffect(() =>{
    const intervalKey = setInterval(() =>{
      if(scrollLock.current){ return }
      document.querySelector(`.${classes.title}[data-selected=true]`)!.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 1000)

    return () => clearInterval(intervalKey)
  }, [])

  // 监听目录容器的滚动(包括用户滚动和js滚动)，如果滚动则2秒内不再触发每隔一秒执行的scrollIntoView
  function containerScrollHandlerForScrollLock(e: any){
    clearTimeout(closeScrollLockTimeoutKey.current)
    scrollLock.current = true
    closeScrollLockTimeoutKey.current = setTimeout(() => scrollLock.current = false, 2000) as any as number
  }

  function isSelected(title: Title, nextTitle: Title | null, index: number){
    let titleOffset = title.offset - marginTopForAppBar - marginTopForScrollTo
    if(index === 0 && windowScrollY < titleOffset) return true 
    if(index === props.titles.length - 1 && windowScrollY > titleOffset) return true 
    if(!nextTitle) return false

    let nextTitleOffset = nextTitle!.offset - marginTopForAppBar - marginTopForScrollTo
    return windowScrollY > titleOffset && windowScrollY < nextTitleOffset
  }

  return (
    <div className={classes.container} onScroll={containerScrollHandlerForScrollLock}>
      <p style={{ fontSize: 22 }}>目录</p>
      <div className={classes.titles}>
        {props.titles.map((item, index) => 
          <div key={item.id}
            className={classes.title} 
            style={{ marginLeft: 15 * (item.level - (isMaxLevel2 ? 2 : 1)) }}
            data-level={item.level}
            data-before={item.level < 3 ? item.number : '- '}
            data-selected={isSelected(item, props.titles[index + 1], index)}
            onClick={() => animateScrollTo(item.offset - marginTopForAppBar)}
          >
            {item.name}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleContents

const useStyles = makeStyles({
  container: {
    boxSizing: 'border-box',
    padding: '0 10px',
    paddingTop: 10,
    height: 'calc(100vh - 60px)',
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  titles: {

  },

  title: {
    maxWidth: 200,
    ...styleVars.textLimit,
    transition: 'all 0.2s',
    display: 'table',
    borderBottom: '3px transparent solid',
    paddingBottom: 2,
    margin: '5px 0',
    cursor: 'pointer',

    '&::before': {
      content: 'attr(data-before)',
      marginRight: 10,
    },

    '&[data-level="1"]': {
      fontSize: 18
    },

    '&[data-level="2"]': {
      fontSize: 16
    },

    '&[data-level="3"]': {
      fontSize: 15,
      color: '#666'
    },

    '&[data-selected=true]': {
      color: styleVars.main,
      fontWeight: 'bold',
      transform: 'scale(1.1) translateX(10px)',
      borderColor: styleVars.main,
    },

    '&:hover': {
      color: styleVars.main,
      fontWeight: 'bold',
      transform: 'scale(1.1) translateX(10px)',
    }
  }
})