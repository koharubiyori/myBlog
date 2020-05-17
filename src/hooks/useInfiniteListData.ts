import { useState, useEffect } from 'react'

export type InfiniteListDataStatus = 0 | 1 | 2 | 3 | 4 | 5    // 0：失败，1：初始，2：加载中，3：加载成功，4：全部加载完毕，5：加载过，但没有任何数据

// 传入的Generator必须返回规定格式的Promise
export type InfiniteListDataGenerator<ListItem = any> = (nextPage: number) => Promise<{ list: ListItem[], currentPage: number, totalPage: number }>

export default function useInfiniteListData<ListItem = any>(dataLoadFnCreator: InfiniteListDataGenerator<ListItem>) {
  const [list, setList] = useState<ListItem[]>([])
  const [status, setStatus] = useState<InfiniteListDataStatus>(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [clearedFlag, setClearedFlag] = useState<(() => void) | null>(null)   // 存的是Promise.resolve

  useEffect(() => {
    if (clearedFlag === null) { return }
    clearedFlag()
    setClearedFlag(null)
  }, [clearedFlag])

  function loadNext(): Promise<void> {
    if ([2, 4, 5].includes(status)) return Promise.resolve()

    console.log(true)
    setStatus(2)
    return dataLoadFnCreator(currentPage + 1)
      .then(data => {
        setTotalPage(data.totalPage)
        setCurrentPage(data.currentPage)
        
        let nextStatus: InfiniteListDataStatus = 3
        if (data.list.length === 0 && list.length === 0) {
          nextStatus = 5
          return 
        }

        if (data.currentPage >= data.totalPage) nextStatus = 4

        setList((prevVal: any[]) => prevVal.concat(data.list))
        setStatus(nextStatus)
      })
      .catch(e => {
        setStatus(0)
        console.log(e)
        return e
      })
  }

  function clear(): Promise<void> {
    return new Promise(resolve => {
      setList([])
      setStatus(1)
      setCurrentPage(0)
      setTotalPage(0)
      setClearedFlag(resolve)
    })
  }

  const InfiniteListController = {
    list, status, currentPage, totalPage,
    loadNext, setList, clear
  }

  return InfiniteListController
}