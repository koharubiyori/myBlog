// 解决react-redux connect函数返回的高阶组件装饰器报错问题
declare module 'react-redux' {
  // Add removed inferrable type to support connect as decorator
  // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/16652
  export interface InferableComponentDecorator<TOwnProps> {
    <T extends Component<TOwnProps>>(component: T): T;
  }

  // overload connect interface to return built-in ClassDecorator
  // https://github.com/reactjs/react-redux/pull/541#issuecomment-269197189
  // tslint:disable-next-line:interface-name
  export interface Connect {
    <TStateProps = any, TDispatchProps = any, TOwnProps = any, TMergedProps = any, State = any>(
      mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
      mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
      mergeProps?: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
      options?: Options
    ): InferableComponentDecorator<TOwnProps>;
  }

  export const connect: Connect
  export const Provider: React.Component<{ store: object }> & { new (...args: any[]): any }
}

declare function c(...args: string[]): { className: string }

// type SnackbarPosition = ['top' | 'bottom', 'left' | 'center' | 'right']
declare interface Window {
  $notify: {
    (message: string, position?: SnackbarPosition): void
    success (message: string, position?: SnackbarPosition): void
    info (message: string, position?: SnackbarPosition): void
    warning (message: string, position?: SnackbarPosition): void
    error (message: string, position?: SnackbarPosition): void
  }
}

declare let $notify: Window['$notify']

declare interface ResponseData<ApiData = {}> {
  status: number
  result: boolean
  message: string
  data: ApiData
}