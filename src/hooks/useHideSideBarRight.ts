import { useEffect } from 'react'
import { MainLayoutControllers } from '~/views/mainLayout'

export default function(mainLayoutControllers: MainLayoutControllers | null){
  useEffect(() =>{
    if(!mainLayoutControllers){ return () =>{} }
    mainLayoutControllers.actionsButton.setVisible(false)
    mainLayoutControllers.actionsButton.setDisabledResizeHandler(true)
    mainLayoutControllers.sideBarRight.setVisible(false)
    mainLayoutControllers.sideBarRight.setDisabledResizeHandler(true)

    return () =>{
      mainLayoutControllers.actionsButton.setVisible(true)
      mainLayoutControllers.actionsButton.setDisabledResizeHandler(false)
      mainLayoutControllers.sideBarRight.setVisible(true)
      mainLayoutControllers.sideBarRight.setDisabledResizeHandler(false)
    }
  })
}