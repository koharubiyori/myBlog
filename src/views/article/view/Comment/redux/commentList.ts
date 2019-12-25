import { ReduxReducer } from "~/@types/types"

export type CommentWithParentUserData = ApiData.Comment & { parentUserData?: ApiData.Comment['userData'] }
export type TreeCommentData = CommentWithParentUserData & { children: TreeCommentData[] }
export type FlattenedTree = CommentWithParentUserData & { children: CommentWithParentUserData[] }

export interface State {
  original: ApiData.Comment[]
  flattenedTree: FlattenedTree[]
}

export type ActionTypes = 'set' | 'delete'

const reducer: ReduxReducer<State, ActionTypes> = (state, action) =>{
  switch(action.type){
    case 'set': {
      const {data} = action as typeof action & {
        data: ApiData.Comment[]
      }

      return { 
        original: data, 
        flattenedTree: toFlattedTree(data)
      }
    }

    case 'delete': {
      const {ids} = action as typeof action & {
        ids: string[]
      }

      let newData = state!.original.filter(item => !ids.includes(item._id))
      
      return {
        original: newData,
        flattenedTree: toFlattedTree(newData)
      }
    }

    default: {
      return state!
    }
  }
}

export default reducer

// 为所有回复添加父级评论/回复的操作者信息
function withParentCommentUserData(data: ApiData.Comment[]): CommentWithParentUserData[]{
  return data.map(item => ({
    ...item,
    ...(item.parentId ? { parentUserData: data.find(original => original._id === item.parentId)!.userData } : {})
  }))
}

// 获取一个根评论对象下所有树化评论分支，并加入其children字段
function withChildren(item: ApiData.Comment, data: ApiData.Comment[]): TreeCommentData{
  function through(item: ApiData.Comment): TreeCommentData[]{
    return data.filter(original => item._id === original.parentId).map(original =>{
      return {
        ...original,
        children: through(original)
      } as TreeCommentData
    })
  }

  return { ...item, children: through(item) }
}

// 第二层后扁平化
function flatten(root: TreeCommentData[]): FlattenedTree[]{
  function through(children: TreeCommentData[]): FlattenedTree[]{
    let childrenCopy = [ ...children ]   
    return childrenCopy.reduce((prev, next) =>{
      let children = next.children || []
      delete next.children
      return prev.concat(through(children).reverse(), [next])
    }, [] as FlattenedTree[])
  }

  return through(root)
}

// 传入原始数据，执行上述三个操作
function toFlattedTree(data: ApiData.Comment[]){
  data = withParentCommentUserData(data)
  let root = data.filter(item => !item.parentId)
  let tree = root.map(item => withChildren(item, data))
  let flattenedTree = tree.map(item => ({ ...item, children: flatten(item.children) }))

  return flattenedTree
}