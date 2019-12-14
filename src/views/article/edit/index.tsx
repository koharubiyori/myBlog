import React, { Component, PropsWithChildren, ChangeEvent, KeyboardEvent } from 'react'
import './index.scss'
import classes from './index.module.scss'
import Editor from 'tui-editor'
import 'tui-editor/dist/tui-editor-extScrollSync'
import 'tui-editor/dist/tui-editor-extColorSyntax'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight
import 'tui-color-picker/dist/tui-color-picker.css'
import { MainLayoutContext, MainLayoutControllers } from '~/views/mainLayout'
import { Button, TextField } from '@material-ui/core'
import createRouter from '~/utils/createRouter'
import { RouteChildrenProps } from 'react-router'
import ImageIcon from '@material-ui/icons/Image'
import article from '~/api/article'
import { getTags } from '~/redux/data/HOC'
import _ from 'lodash'
import TagInput from './components/TagInput'
import tagApis from '~/api/tag'
import nProgress from 'nprogress'

export interface Props {
  
}

export interface State {
  title: string
  profile: string
  tags: string[]
  tagInput: string
  tagInputFocused: boolean
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
      tagInputFocused: false,
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
      language: 'zh_CN',
      exts: ['scrollSync', 'colorSyntax']
    })

    this.editor.addHook('addImageBlobHook', (file: File, cb: (url: string, text?: string) => void) =>{
      article.uploadImg({ file })
        .then(data =>{
          cb(data.fileUrl)
        })

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
    if(!mainLayoutControllers || this.mainLayoutControllers){ return }
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
      })
  }

  tagInputKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) =>{
    let tag = this.state.tagInput.trim()

    if(tag === '' && event.keyCode === 8){
      if(this.state.tags.length !== 0){
        this.setState({ tags: _.dropRight(this.state.tags) })
      }
    }
  }

  removeTag = (index: number) =>{
    this.state.tags.splice(index, 1)
    this.setState({ tags: this.state.tags })
  }

  publish = () =>{
    let {title, profile, tags, headImg} = this.state
    let content = this.editor.getMarkdown()
    
    title = title.trim()
    profile = profile.trim()

    if(!title) return $notify('标题不能为空')
    if(!profile) return $notify('简介不能为空')
    if(!content) return $notify('内容不能为空')
    if(!tags.length) return $notify('至少需要一个标签')
    if(!headImg) return $notify('头图不能为空')

    nProgress.start()
    getTags()
      .then(tagList =>{
        return Promise.all(
          tags.map((tag, index) => 
            new Promise((resolve, reject) =>{
              let tagObj = tagList.find(item => item.name === tag)
              if(tagObj){
                resolve(tagObj._id)
              }else{
                tagApis.set({ name: tag }, { loading: false, fail: false })
                  .then(data =>{
                    resolve(data.tagId)
                  })
                  .catch(e =>{
                    reject(e)
                  })
              }
            })
          )
        )
      })
      .finally(() =>{
        nProgress.done()
        getTags(true)
      })
      .then(tagIds =>{
        return article.publish({
          title, profile, content, headImg,
          tags: tagIds as string[]
        })
      })
      .then(() =>{
        $notify.success('文章发布成功')
        this.router.search('/')
      })
      .catch(e =>{
        console.log(e)
        $notify.error('网络错误')
      })
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

            <TagInput
              value={this.state.tagInput.trim()}
              tags={this.state.tags}
              onChange={e => this.setState({ tagInput: e.target.value })}
              onSelectHint={name => this.setState({ tags: this.state.tags.concat([name]), tagInput: '' })}
              onRemoveTag={this.removeTag}
            />

            <div style={{ margin: '20px auto', maxWidth: 800 }}>           
              <label {...c(classes.upload)} data-status={this.state.headImgStatus}>
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