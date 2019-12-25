export namespace Api {
  interface Get {
    articleId: string
  }

  interface Post {
    articleId: string
    targetId?: string     // 有表示操作为对评论进行回复
    targetUserId?: string
    content: string
  }

  interface Delete {
    commentIds: string[]
  }
}