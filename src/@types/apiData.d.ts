declare namespace ApiData {
  interface Theme {
    avatar: string
    bgImage: string
  }
  
  interface User {
    _id: string
    account: string
    name: string
    avatar: string
    deleted: boolean
    isAdmin: boolean
  }

  interface Article {
    _id: string
    title: string
    profile: string
    content: string
    tags: string[]
    updatedAt: Date
    headImg: string
    readNum: number
    deleted: boolean
    createdYear: number
    createdMonth: number
    commentTotal: number
    collectTotal: number
    lastArticle: ApiData.Article
    nextArticle: ApiData.Article
    isTop: boolean
  }

  type SearchResult = Omit<Article, 'content'>

  interface Tag {
    _id: string
    name: string
  }

  interface Comment {
    _id: string
    articleId: string
    userId: string 
    parentId: string
    content: string
    deleted: boolean
    userData: Omit<ApiData.User, 'account'> 
  }

  interface Settings {
    _id: string
    title: string
    subtitle: string
    bgImg: string
  }

  interface Notification {
    _id: string
    userId: string
    operatorId: string
    type: 'like' | 'system' | 'comment' | 'reply'
    isChecked: boolean
    deleted: boolean
    userData: ApiData.User
    operatorUserData: ApiData.User

    commentContent?: string
    articleTitle?: string
  }
}