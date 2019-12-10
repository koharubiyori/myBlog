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
}