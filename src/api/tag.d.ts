export namespace Api {
  interface Set {
    name: string
    tagId?: string
  }

  interface Delete {
    tagId: string
  }
}