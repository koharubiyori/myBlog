export namespace Api {
  interface Check {
    notificationIds: string[]
  }

  interface Load {
    page?: number
    limit?: number
    isChecked?: boolean
  }
}