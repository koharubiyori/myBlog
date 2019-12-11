import React, { Component, PropsWithChildren } from 'react'
// import classes from './index.module.scss'
import Editor from 'tui-editor'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight
import { MainLayoutContext, MainLayoutControllers } from '~/views/mainLayout/index'

export interface Props {
  
}

export interface State {
  
}

type FinalProps = Props

class ArticleEdit extends Component<PropsWithChildren<FinalProps>, State> {
  editor: InstanceType<typeof Editor> = null as any
  _refs = {
    editor: React.createRef<HTMLDivElement>()
  }
  mainLayoutControllers: MainLayoutControllers = null as any

  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      
    }
  }

  componentDidMount (){
    this.editor = new Editor({
      el: this._refs.editor.current as Element,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      height: '300px'
    })
  }

  componentWillUnmount (){
    this.mainLayoutControllers && this.mainLayoutControllers.setActionsButtonVisible(true)
  }

  setMainLayoutControllers = (mainLayoutControllers: MainLayoutControllers) =>{
    if(this.mainLayoutControllers){ return }
    this.mainLayoutControllers = mainLayoutControllers
    mainLayoutControllers.setActionsButtonVisible(false)
  }

  render (){
    return (
      <MainLayoutContext.Consumer>{mainLayoutControllers =>
        <div>
          {this.setMainLayoutControllers(mainLayoutControllers)}
          <div ref={this._refs.editor} />
        </div>
      }</MainLayoutContext.Consumer>
    )
  }
}

export default ArticleEdit