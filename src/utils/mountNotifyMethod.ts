import { WithSnackbarProps } from "notistack"

export default function(enqueueSnackbar: WithSnackbarProps['enqueueSnackbar']){
  const msg = enqueueSnackbar
  const createOptions = (
    type: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default', 
    position: ['top' | 'bottom', 'left' | 'center' | 'right', ] = ['top', 'center']
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
  window.$notify = notify
}