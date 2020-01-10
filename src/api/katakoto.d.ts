export namespace Api {
  interface Load {
    page?: number
    limit?: number
  }

  interface Add {
    content: string
  }

  interface Delete {
    katakotoId: string
  }
}