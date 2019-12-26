import { useEffect, useContext } from 'react'
import { MainLayoutContext } from '~/views/mainLayout'

export default function useHideSidebarRight(){
  const mainLayoutControllersPromise = useContext(MainLayoutContext)
  
  useEffect(() =>{
    mainLayoutControllersPromise.then(controllers =>{
      controllers.actionsButton.setVisible(false)
      controllers.actionsButton.setDisabledResizeHandler(true)
      controllers.sidebarRight.setVisible(false)
      controllers.sidebarRight.setDisabledResizeHandler(true)
    })

    return () =>{
      mainLayoutControllersPromise.then(controllers =>{
        controllers.actionsButton.setVisible(true)
        controllers.actionsButton.setDisabledResizeHandler(false)
        controllers.sidebarRight.setVisible(true)
        controllers.sidebarRight.setDisabledResizeHandler(false)
      })
    }
  })
}