declare function c(...args: string[]): string

// type SnackbarPosition = ['top' | 'bottom', 'left' | 'center' | 'right']
declare interface Window {
  $notify: {
    (message: string, position?: SnackbarPosition): void
    success (message: string, position?: SnackbarPosition): void
    info (message: string, position?: SnackbarPosition): void
    warning (message: string, position?: SnackbarPosition): void
    error (message: string, position?: SnackbarPosition): void
  }

  $confirm: {
    (params: {
      title?: string
      content: string
      checkText?: string
      closeText?: string
      onCheck?: Function | null
      onClose?: Function | null
    }): void

    hide (): void
  }
}

declare let $notify: Window['$notify']
declare let $confirm: Window['$confirm']
declare const __REDUX_DEVTOOLS_EXTENSION__: any

declare interface ResponseData<ApiData = {}> {
  status: number
  result: boolean
  message: string
  data: ApiData
}

declare interface PageData<Data = any> {
  total: number
  pageTotal: number
  limit: number
  currentPage: number
  list: Data[]
}

declare interface PageState<ListData = any> {
  pageTotal: number
  currentPage: number
  list: ListData[],
  status: number
}

declare interface RouteComponent {
  path?: string
}