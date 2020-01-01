import React, { useState, useEffect, useRef, PropsWithChildren, CSSProperties } from 'react'
import { makeStyles } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import styleVars from '~/styles/styleVars'

export interface Props {
  pageTotal: number
  current: number
  style?: CSSProperties
  onChangePage (page: number): void
}

type FinalProps = Props

function Pagination(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles()

  const {pageTotal, current} = props
  
  let pageRange = [current - 2, current - 1, current, current + 1, current + 2]   // 显示范围
  pageRange = pageRange.some(item => item < 1) ? [1, 2, 3, 4, 5] : pageRange  // 如果有小于1的值，则重置范围为1~5
  pageRange = pageRange.filter(item => item <= pageTotal)     // 消除大于页数总数的数
  let endOverflowTotal = 5 - pageRange.length    // 计算超出页数总数的数量
  let minPage = pageRange[0]    // 拿到范围内最小值
  for(let i=1; i <= endOverflowTotal; i++){   // 向前补位
    pageRange.unshift(minPage - i)
  }
  pageRange = pageRange.filter(item => item >= 1)   // 消除小于1的数

  return (
    <div className={classes.container} style={props.style}>
      {current !== 1 ?
        <div className="item" onClick={() => props.onChangePage(current - 1)}>
          <ArrowBackIosIcon style={{ fontSize: 14, position: 'relative', left: 2 }} />
        </div>
      : null}
      
      {pageRange[0] !== 1 ? 
        <div className="item" onClick={() => props.onChangePage(1)}>1</div> 
      : null}

      {pageRange[0] > 2 ?
        <div className="item" onClick={() => props.onChangePage(current - 1)}>...</div>
      : null}

      {pageRange.map(page => 
        <div key={page} 
          className="item" 
          data-selected={page === current}
          onClick={() => page !== current && props.onChangePage(page)}
        >{page}</div>  
      )}
      
      {pageRange[pageRange.length - 1] < pageTotal - 1 ?
        <div className="item" onClick={() => props.onChangePage(current + 1)}>...</div>
      : null}

      {pageRange[pageRange.length - 1] !== pageTotal ? 
        <div className="item" onClick={() => props.onChangePage(pageTotal)}>{pageTotal}</div> 
      : null}

      {current !== pageTotal ?
        <div className="item" onClick={() => props.onChangePage(current + 1)}>
          <ArrowForwardIosIcon style={{ fontSize: 14 }} />
        </div>
      : null}
    </div>
  )
}

export default Pagination

const useStyles = makeStyles({
  container: {
    display: 'table',
    margin: '0 auto',

    '@global .item': {
      display: 'inline-flex',
      verticalAlign: 'middle',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 3px',
      backgroundColor: '#eee',
      width: 30,
      height: 30,
      fontSize: 13,
      borderRadius: 3,
      cursor: 'pointer',
      border: '1px transparent solid',
      transition: 'all 0.2s',

      '&[data-selected="true"]': {
        backgroundColor: styleVars.main,
        color: 'white',
        cursor: 'initial'
      },

      '&:not([data-selected="true"]):hover': {
        borderColor: styleVars.main
      }
    }
  },
})