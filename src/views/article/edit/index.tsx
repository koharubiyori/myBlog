import { Button, Checkbox, FormControlLabel, makeStyles, TextField } from '@material-ui/core'
import ImageIcon from '@material-ui/icons/Image'
import 'codemirror/lib/codemirror.css' // codemirror
import 'highlight.js/styles/github.css' // code block highlight
import nProgress from 'nprogress'
import React, { ChangeEvent, PropsWithChildren, useEffect, useRef, useState } from 'react'
import 'tui-color-picker/dist/tui-color-picker.css'
import Editor from 'tui-editor'
import 'tui-editor/dist/tui-editor-contents.css' // editor's content
import 'tui-editor/dist/tui-editor-extColorSyntax'
import 'tui-editor/dist/tui-editor-extScrollSync'
import 'tui-editor/dist/tui-editor.css' // editor's ui
import article from '~/api/article'
import tagApis from '~/api/tag'
import common from '~/api/common'
import BgImg from '~/components/BgImg'
import getConfirm from '~/externalContexts/confirm'
import getNotify from '~/externalContexts/notify'
import useHideSidebarRight from '~/hooks/useHideSidebarRight'
import useRouteLeaveGuard from '~/hooks/useRouteLeaveGuard'
import useSEO from '~/hooks/useSEO'
import { getTags } from '~/redux/data/HOC'
import { com, flex } from '~/styles'
import styleVars from '~/styles/styleVars'
import createRouter from '~/utils/createRouter'
import useArticleContentClasses from '../styles/articleContent'
import TagInput from './components/TagInput'

export interface Props {
  
}

interface RouteStateParams {
  type: 0 | 1       // 0为新建，1为编辑，当为1时，也应该传入articleId
  articleId?: string
}

type FinalProps = Props

function ArticleEdit(props: PropsWithChildren<FinalProps>){
  const 
    classes = useStyles(),
    articleContentClasses = useArticleContentClasses(),
    router = createRouter<{}, RouteStateParams>(),
    notify = getNotify(),
    [title, setTitle] = useState(''),
    [profile, setProfile] = useState(''),
    [tags, setTags] = useState<string[]>([]),
    [tagInput, setTagInput] = useState(''),
    [headImg, setHeadImg] = useState(''),
    [isTop, setIsTop] = useState(false),
    [headImgStatus, setHeadImgStatus] = useState(1),
    [submitted, setSubmitted] = useState(false),
    refs = {
      editor: useRef<HTMLElement>()
    },
    editor = useRef<InstanceType<typeof Editor>>(),
    type = router.params.state.type

  useHideSidebarRight()

  useSEO(setTitle => title && setTitle(title), [title])

  useEffect(() =>{
    if(type === 1){
      article.get({
        articleId: router.params.state.articleId!,
        noCount: true
      })
        .then(data =>{
          setTitle(data.title)
          setProfile(data.profile)
          setHeadImg(data.headImg)
          setIsTop(data.isTop)
          setHeadImgStatus(3)
          getTags().then(tagList =>{
            setTags(data.tags.map((tagId: string) => tagList.find(tag => tag._id === tagId)!.name))
          })

          editor.current!.setMarkdown(data.content)
          editor.current!.moveCursorToStart()
        })
    }
  }, [])

  useEffect(() =>{
    editor.current = new Editor({
      el: refs.editor.current!,
      height: 'calc(100vh - 100px)',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      language: 'zh_CN',
      exts: ['scrollSync', 'colorSyntax']
    })

    editor.current!.addHook('addImageBlobHook', (file: File, cb: (url: string, text?: string) => void) =>{
      common.upload({ file })
        .then(data =>{
          cb(data.fileUrl)
        })
    })

    window.scrollTo(0, 0)
  }, [])

  useEffect(() =>{
    if(process.env.NODE_ENV === 'development'){ return }
     window.onbeforeunload = (e: BeforeUnloadEvent) =>{
      return '确定要离开编辑页面吗？'
    }

    return () =>{ window.onbeforeunload = null }
  }, [])

  useRouteLeaveGuard(next =>{
    setSubmitted(prevVal =>{
      prevVal ? next() : getConfirm()({
        content: '确定要离开编辑页面吗？',
        onCheck: () => next(),
        onClose: () => next(false)
      })
      
      return prevVal
    })
  })

  function uploadHeadImg(event: ChangeEvent<HTMLInputElement>){
    if(event.target.files!.length === 0){ return }
    let file = event.target.files!.item(0)!
    event.target.value = ''

    setHeadImgStatus(2)
    common.upload({ file })
      .then(data =>{
        setHeadImgStatus(3)
        setHeadImg(data.fileUrl)
      }).catch(e =>{
        console.log(e)
        setHeadImgStatus(1)
      })
  }

  function removeTag(index: number){
    setTags(prevVal => prevVal.filter((_, tagInd) => tagInd !== index))
  }

  function publish(){
    let content = editor.current!.getMarkdown()

    if(!title) return notify('标题不能为空')
    if(!profile) return notify('简介不能为空')
    if(!content) return notify('内容不能为空')
    if(!tags.length) return notify('至少需要一个标签')
    if(!headImg) return notify('头图不能为空')

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
          title, profile, content, headImg, isTop,
          tags: tagIds as string[],
          ...(type === 1 ? { articleId: router.params.state.articleId } : {})
        })
      })
      .then(() =>{
        notify.success(`文章${type === 0 ? '发布' : '修改'}成功`)
        _GLOBAL.homeRefreshMark = true
        setSubmitted(true)
        type === 0 && router.replace('/')
      })
      .catch(e =>{
        console.log(e)
        notify.error('网络错误')
      })
  }

  return (
    <div>
      <BgImg hidden />
      <h2 className={c(com.mainTitle, flex.row, flex.between, flex.crossCenter)} style={{ marginBottom: 40 }}>
        <span>{type === 0 ? '新建' : '修改'}文章</span>
        <FormControlLabel
          control={<Checkbox color="primary" checked={isTop} onChange={() => setIsTop(prevVal => !prevVal)} />}
          label="文章置顶"
        />
      </h2>
      <div>
        <div className={c(flex.row, flex.crossCenter)}>
          <TextField
            className={flex.grow}
            label="标题" 
            InputLabelProps={{ shrink: true }} 
            placeholder="文章标题"
            variant="outlined" 
            value={title}
            onChange={e => setTitle(e.target.value.trim())}
          />

          <Button style={{ marginLeft: 30 }} variant="contained" color="primary" size="large" onClick={publish}>{type === 0 ? '发布' : '保存'}</Button>
        </div>
        
        <TextField fullWidth multiline 
          label="简介" 
          variant="outlined" 
          placeholder="简介将在文章列表中显示"
          InputLabelProps={{ shrink: true }} 
          rows={3} 
          style={{ margin: '20px 0' }} 
          value={profile}
          onChange={e => setProfile(e.target.value.trim())}
        />

        <TagInput
          value={tagInput.trim()}
          tags={tags}
          onChange={e => setTagInput(e.target.value)}
          onSelectHint={name =>{ setTags(prevVal => prevVal.concat([name])); setTagInput('') }}
          onRemoveTag={removeTag}
        />

        <div style={{ margin: '20px auto', maxWidth: 800 }}>           
          <label className={classes.upload} data-status={headImgStatus}>
            {headImgStatus === 3 ?
              <img alt="headImg" src={headImg} />
            :
              <div className="hint">
                <ImageIcon fontSize="large" />
                <p style={{ marginTop: 5 }}>{['', '添加头图', '上传中'][headImgStatus]}</p>
              </div>
            }
            <input type="file" style={{ position: 'fixed', left: -9999 }} onChange={uploadHeadImg} />
          </label>
        </div>
      </div>

      <div ref={refs.editor as any} className={articleContentClasses.main} style={{ backgroundColor: 'white', minHeight: 650 }} />
    </div>
  )
}

export default ArticleEdit

const useStyles = makeStyles({
  '@global': {
    body: {
      backgroundImage: 'initial !important',
    },

    '.mainLayout-content': {
      maxWidth: 'initial',
    },
    
    '.CodeMirror-scroll': {
      boxSizing: 'border-box',
      padding: '0 15px'
    }
  },

  upload: {
    height: 300,
    borderRadius: 3,
    border: '1px #C4C4C4 solid',
    transition: 'all 0.2s',
    display: 'block',
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
  
    '@global': {
      '> img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'all 0.2s',
      },
      
      '.hint': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: styleVars.subtext,
        fontSize: 14,
        transition: 'all 0.2s',
      }
    },
  
    '&:hover': {
      borderColor: styleVars.main,
  
      '@global': {
        '> img': {
          transform: 'scale(1.1)',
        },

        '.hint': {
          color: styleVars.main,
        },
      },
  
      '&::before': {
        opacity: '1 !important',
      },
    },
  
    '&[data-status="3"]': {
      '&::before': {  
        content: '"更换头图"',
        textDcoration: 'underline',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        fontSize: 18,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
        transition: 'all 0.2s',
        zIndex: 1,
        cursor: 'pointer',
      }
    }
  }
})


