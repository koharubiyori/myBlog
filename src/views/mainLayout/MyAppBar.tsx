import React, { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core'
import classes from './MyAppBar.module.scss'

export interface Props {
  
}

export default function MyAppBar(props: PropsWithChildren<Props>){
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6" {...c(classes.test)}>こはるびより</Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  )
}