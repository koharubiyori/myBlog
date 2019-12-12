import React, { Component, PropsWithChildren, ChangeEvent } from 'react'
import './index.scss'
import classes from './index.module.scss'
import Editor from 'tui-editor'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight
import { MainLayoutContext, MainLayoutControllers } from '~/views/mainLayout'
import { Button, TextField, InputLabel, FormControl, OutlinedInput } from '@material-ui/core'
import createRouter from '~/utils/createRouter'
import { RouteChildrenProps } from 'react-router'
import ImageIcon from '@material-ui/icons/Image'
import article from '~/api/article'
import TagSvg from '~/images/sub/tag.svg'

export interface Props {
  
}

export interface State {
  title: string
  profile: string
  tags: string[]
  tagInput: string
  headImg: string
  headImgStatus: number
}

type FinalProps = Props & RouteChildrenProps

class ArticleEdit extends Component<PropsWithChildren<FinalProps>, State> {
  editor: InstanceType<typeof Editor> = null as any
  _refs = {
    editor: React.createRef<HTMLDivElement>()
  }
  mainLayoutControllers: MainLayoutControllers = null as any
  router = createRouter(this.props)

  type = 0
  content = ''

  constructor (props: PropsWithChildren<FinalProps>){
    super(props)
    this.state = {
      title: '',
      profile: '',
      tags: [],
      tagInput: '',
      headImg: '',
      headImgStatus: 1
    }

    const {state} = this.router.params
    this.type = state.type || 0
    if(this.type === 1){
      this.setState(state.articleData)
    }
  }

  componentDidMount (){
    this.editor = new Editor({
      el: this._refs.editor.current as Element,
      height: '650px',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    })

    this.editor.addHook('addImageBlobHook', (blob: Blob) =>{
      console.log(blob)
    })
  }

  componentWillUnmount (){
    if(this.mainLayoutControllers){
      this.mainLayoutControllers.actionsButton.setVisible(true)
      this.mainLayoutControllers.actionsButton.setDisabledResizeHandler(false)
      this.mainLayoutControllers.sideBarRight.setVisible(true)
      this.mainLayoutControllers.sideBarRight.setDisabledResizeHandler(false)
    }
  }

  setMainLayoutControllers = (mainLayoutControllers: MainLayoutControllers) =>{
    if(this.mainLayoutControllers){ return }
    this.mainLayoutControllers = mainLayoutControllers
    mainLayoutControllers.actionsButton.setVisible(false)
    mainLayoutControllers.actionsButton.setDisabledResizeHandler(true)
    mainLayoutControllers.sideBarRight.setVisible(false)
    mainLayoutControllers.sideBarRight.setDisabledResizeHandler(true)
  }

  uploadHeadImg = (event: ChangeEvent<HTMLInputElement>) =>{
    if(event.target.files!.length === 0){ return }
    let file = event.target.files!.item(0)!
    this.setState({ headImgStatus: 2 })
    article.uploadHeadImg({ file })
      .then(data =>{
        this.setState({ headImgStatus: 3, headImg: data.fileUrl })
      }).catch(e =>{
        this.setState({ headImgStatus: 1 })
        $notify.error('图片上传失败，请再试一次')
      })
  }

  publish = () =>{
    console.log(this.editor.getMarkdown())
  }

  render (){
    return (
      <MainLayoutContext.Consumer>{mainLayoutControllers =>
        <div>
          {this.setMainLayoutControllers(mainLayoutControllers)}
          <h2 className="com-mainTitle" style={{ marginBottom: 40 }}>{this.type === 0 ? '新建' : '修改'}文章</h2>
          <div>
            <div className="flex-row flex-cross-center">
              <TextField
                {...c('flex-grow')}
                label="标题" 
                InputLabelProps={{ shrink: true }} 
                placeholder="文章标题"
                variant="outlined" 
                value={this.state.title}
                onChange={e => this.setState({ title: e.target.value })}
              />

              <Button style={{ marginLeft: 30 }} variant="contained" color="primary" size="large" onClick={this.publish}>发布</Button>
            </div>
            
            <TextField fullWidth multiline 
              label="简介" 
              variant="outlined" 
              placeholder="简介将在文章列表中显示"
              InputLabelProps={{ shrink: true }} 
              rows={3} 
              style={{ margin: '20px 0' }} 
              value={this.state.profile}
              onChange={e => this.setState({ profile: e.target.value })}
            />

            <FormControl {...c('flex-row flex-wrap')} variant="outlined">
              <InputLabel shrink variant="outlined">标签</InputLabel>
              {this.state.tags.map((item: any) => <div {...c(classes.tag)}>{typeof item === 'string' ? item : item.name}</div>)}
              <OutlinedInput notched labelWidth={32} {...c('flex-grow')} 
                value={this.state.tagInput}
                onChange={e => this.setState({ tagInput: e.target.value })} 
                placeholder="回车添加标签"
              />
            </FormControl>
{/* 
            <FormControl {...c('flex-row flex-wrap')} variant="outlined">
              <InputLabel shrink variant="outlined">标签</InputLabel>
              <OutlinedInput notched labelWidth={32}
                inputComponent={() => 
                  <div style={{ margin: '20px 0' }}>           
                    <label {...c(classes.upload)}>
                      {this.state.headImgStatus === 3 ?
                        <img src={this.state.headImg} />
                      :
                        <div className="hint">
                          <ImageIcon fontSize="large" />
                          <p style={{ marginTop: 5 }}>{['', '添加头图', '上传中'][this.state.headImgStatus]}</p>
                        </div>
                      }
                      <input type="file" style={{ position: 'fixed', left: -9999 }} onChange={this.uploadHeadImg} />
                    </label>
                  </div>
                }
              />
            </FormControl> */}


            <div style={{ margin: '20px 0' }}>           
              <label {...c(classes.upload)}>
                {this.state.headImgStatus === 3 ?
                  <img src={this.state.headImg} />
                :
                  <div className="hint">
                    <ImageIcon fontSize="large" />
                    <p style={{ marginTop: 5 }}>{['', '添加头图', '上传中'][this.state.headImgStatus]}</p>
                  </div>
                }
                <input type="file" style={{ position: 'fixed', left: -9999 }} onChange={this.uploadHeadImg} />
              </label>
            </div>
          </div>

          <div ref={this._refs.editor} />
        </div>
      }</MainLayoutContext.Consumer>
    )
  }
}

export default ArticleEdit