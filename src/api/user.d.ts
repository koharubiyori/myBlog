export namespace Api {
  interface Register {
    account: string
    name: string
    password: string
    code: string
  }

  interface Login {
    accountOrName: string
    password: string
  }

  interface SetUserInfo {
    name?: string
    avatar?: string
  }
}