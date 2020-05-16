export namespace Api {
  interface Publish {
    articleId?: string      // 传入文章id时，为修改文章
    title: string
    profile: string
    content: string
    tags: string[]
    headImg: string
    headImgPosition: number[]
    isTop: boolean
  }

  interface Get {
    articleId: string
    noCount?: boolean
  }

  interface Search {
    keyword?: string
    page?: number
    limit?: number
    exceptTop?: boolean
  }

  interface SearchByTag {
    tagId: string
    page?: number
    limit?: number
  }

  interface Delete {
    articleId: string
  }

  interface SetCollectStatus {
    articleId: string
    collect: boolean
  }

  interface GetCollectStatus {
    articleId: string
  }

  interface SearchByUserCollect {
    page?: number
    limit?: number
  }
}