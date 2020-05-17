import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles } from '@material-ui/styles'
import katakoto from '~/api/katakoto'
import { com } from '~/styles'
import useInfiniteListData from '~/hooks/useInfiniteListData'
import { Button, Box, CircularProgress } from '@material-ui/core'
import idToMoment from '~/utils/idToMoment'
import getConfirm from '~/externalContexts/confirm'
import getNotify from '~/externalContexts/notify'
import useWindowReachBottom from '~/hooks/useWindowReachBottom'
import InfiniteListStatusHint from '~/components/InfiniteListStatusHint'

export interface Props {
  
}

type FinalProps = Props

function KatakotoSettings(props: PropsWithChildren<FinalProps>) {
  const
    classes = useStyles(),
    notify = getNotify(),
    confirm = getConfirm(),
    katakotoList = useInfiniteListData<ApiData.Katakoto>(load)
  
  useEffect(() => {
    katakotoList.loadNext()
  }, [])

  useWindowReachBottom(() => katakotoList.loadNext())

  function load(page: number){
    console.log(page)
    return katakoto.load({ page, limit: 20 })
      .then(data => {
        return {
          list: data.list,
          currentPage: data.currentPage,
          totalPage: data.pageTotal
        }
      })
  }

  function handlerForDeleteBtnWasClicked(katakotoId: string) {
    confirm({
      content: '确定要删除该条？',
      onCheck (){
        katakoto.delete({ katakotoId })
          .then(() =>{
            notify.success('删除成功')
            katakotoList.setList(prevVal => prevVal.filter(item => item._id !== katakotoId))
          })
      }
    })
  }

  return (
    <div>
      <h2 className={com.mainTitle}>只言片语列表</h2> 
      <div className={classes.katakotoList}>
        {katakotoList.list.map(item => 
          <Box key={item._id} boxShadow={1} className={c(classes.katakotoItem)}>
            <div className="content">{item.content}</div>
            <div className="date">{idToMoment(item._id).format('YYYY年MM月DD日 HH:mm')}</div>
            <Button 
              className="deleteBtn"
              color="primary"
              variant="outlined"
              onClick={() => handlerForDeleteBtnWasClicked(item._id)}
            >删除</Button>
          </Box>  
        )}
      </div>
      <InfiniteListStatusHint status={katakotoList.status} />
    </div>
  )
}

export default KatakotoSettings

const useStyles = makeStyles({
  katakotoList: {

  },

  katakotoItem: {
    position: 'relative',
    boxSizing: 'border-box',
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,

    '& .date': {
      color: '#999',
      fontSize: 13,
      marginTop: 15
    },

    '& .deleteBtn': {
      position: 'absolute',
      top: '50%',
      right: 20,
      transform: 'translateY(-50%)'
    }
  },
})