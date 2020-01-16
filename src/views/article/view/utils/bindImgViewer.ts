import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'

export default function(rootEl: HTMLDivElement){
  return Array.from(rootEl.querySelectorAll('img')).map(img => new Viewer(img, { toolbar: false, navbar: false, title: false }))
}