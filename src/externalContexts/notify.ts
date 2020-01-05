import { WithSnackbarProps } from 'notistack'

export type NotifyType = 'default' | 'info' | 'success' | 'warning' | 'error'
export type NotifyPositions = ['top' | 'bottom', 'left' | 'center' | 'right']

export interface Notify {
  (message: string, position?: NotifyPositions): void
  success (message: string, position?: NotifyPositions): void
  info (message: string, position?: NotifyPositions): void
  warning (message: string, position?: NotifyPositions): void
  error (message: string, position?: NotifyPositions): void
}

const context = {
  current: undefined as any as Notify
}

export default () => context.current

export function bindContext(enqueueSnackbar: WithSnackbarProps['enqueueSnackbar']){
  const msg = enqueueSnackbar
  const createOptions = (
    type: NotifyType = 'default', 
    position: NotifyPositions = ['top', 'center']
  ) => ({ 
    variant: type, 
    anchorOrigin: { vertical: position[0], horizontal: position[1] },
    autoHideDuration: 2000
  })

  let notify: any = (message: any, position?: any) => msg(message, createOptions('default', position))
  notify.info = (message: any, position?: any) => msg(message, createOptions('info', position))
  notify.success = (message: any, position?: any) => msg(message, createOptions('success', position))
  notify.warning = (message: any, position?: any) => msg(message, createOptions('warning', position))
  notify.error = (message: any, position?: any) => msg(message, createOptions('error', position))

  context.current = notify
}