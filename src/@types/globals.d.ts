declare function c(...args: (string | undefined | null)[]): string

declare interface Window {
  _GLOBAL: {
    homeRefreshMark: boolean
  }
}

declare let _GLOBAL: Window['_GLOBAL']
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
  total: number
  pageTotal: number
  currentPage: number
  cache: { [key: number]: ListData[] },
  status: number
}

declare interface RouteComponent {
  path?: string
}