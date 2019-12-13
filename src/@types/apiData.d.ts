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
    _id?: string
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
  }

  interface Tag {
    _id: string
    name: string
  }
}