import { useEffect, useContext } from 'react'
import { MainLayoutContext } from '~/views/mainLayout'

export default function useHideSideBarRight(){
  const mainLayoutControllers = useContext(MainLayoutContext)
  
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