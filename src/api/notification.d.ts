export namespace Api {
  interface Check {
    notificationIds: string[]
  }

  interface Load {
    page?: number
    limit?: number
    isUnchecked?: boolean
  }
}