import React, { Component, PropsWithChildren } from 'react'
import { Snackbar, IconButton, SnackbarContent } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import { SnackbarOrigin } from '@material-ui/core/Snackbar'
import classes from './MySnackBar.module.scss'

const icons = {
  default: null,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: InfoIcon,
  danger: ErrorIcon
}

const colors = {
  default: '#323232',
  info: '#1976D2',
  success: '#43A047',
  warning: '#FFA000',
  danger: '#D32F2F'
}

export interface Props {
  
}

export interface State {
  message: string
  visible: boolean
  type: keyof typeof colors
  position: [SnackbarOrigin['vertical'], SnackbarOrigin['horizontal']]
}

export default class MySnackBar extends Component<PropsWithChildren<Props>, State> {

  
  constructor (props: PropsWithChildren<Props>){
    super(props)
    this.state = {
      message: '',
      visible: false,
      type: 'default',
      position: ['top', 'center']
    }
  }

  show = ({ message, type = 'default', position = ['top', 'center'] }: Omit<State, 'visible'>) =>{
    this.setState({ visible: true, message, type, position })
  }

  hide = () => this.setState({ visible: false })

  render (){
    return (
      <Snackbar
        anchorOrigin={{ vertical: this.state.position[0], horizontal: this.state.position[1] }}
        open={this.state.visible}
        autoHideDuration={6000}
        onClose={this.hide}
      >
        <MySnackbarContent type={this.state.type} message={this.state.message} onClose={this.hide} />
      </Snackbar>
    )
  }
}

function MySnackbarContent(props: {
  type: keyof typeof icons,
  message: string,
  onClose (): void
}) {

  return (
    <SnackbarContent
      style={{ backgroundColor: colors[props.type] }}
      message={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icons[props.type] ? React.createElement(icons[props.type] as any) : null}
          <span style={{ marginLeft: 10 }}>{props.message}</span>
        </span>
      }
      action={[
        <IconButton key="close" color="inherit" onClick={props.onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
    />
  );
}
