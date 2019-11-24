import React from 'react'
import { AppBar, IconButton, Toolbar, Button, Typography } from '@material-ui/core'

export default function MyAppBar(props: Object){
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6">こはるびより</Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  )
}