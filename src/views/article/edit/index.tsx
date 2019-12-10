import React, { Component, PropsWithChildren } from 'react'
// import classes from './index.module.scss'
import Editor from 'tui-editor'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight

export interface Props {
  
}

export interface State {
  
}

type FinalProps = Props

class ArticleEdit extends Component<PropsWithChildren<FinalProps>, State> {
  editor: InstanceType<typeof Editor> = null as any
  
  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      
    }
  }

  componentDidMount (){
    this.editor = new Editor({
      el: this.refs.editor as Element,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      height: '300px'
    })
  }

  render (){
    return (
      <div>
        <div ref="editor" />
      </div>
    )
  }
}

export default ArticleEdit