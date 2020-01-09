import { Dispatch, SetStateAction } from "react"

export interface PageListState<ListData = any> {
  total: number
  pageTotal: number
  currentPage: number
  cache: { [key: number]: ListData[] },
  status: number
}

export const initPageList: <ListData = any>() => PageListState<ListData> = () => ({
  currentPage: 1,
  total: 0,
  pageTotal: 1,
  cache: {},
  status: 1
})

export const createPageListLoader = (
  list: PageListState<unknown>,
  setList: Dispatch<SetStateAction<PageListState>>, 
  requestPromise: (page: number) => Promise<PageData<unknown>>,
) => 
  (page = 1, force = false) =>{
    if(list.status === 2){ return }
    
    setList(prevVal => ({ ...prevVal, status: 2 }))
    if(list.cache[page] && !force){
      setList(prevVal => ({ ...prevVal, currentPage: page, status: 3 }))
    }else{
      requestPromise(page)
        .then(data =>{ 
          setList(prevVal => ({
            total: data.total,
            currentPage: page,
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
          setList(prevVal => ({ ...prevVal, status: 0 }))
        })
    }
  }