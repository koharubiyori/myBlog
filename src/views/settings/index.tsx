import React, { useState, useEffect, useRef, PropsWithChildren, ChangeEvent, FC } from 'react'
import { makeStyles, TextField, Tooltip, Button } from '@material-ui/core'
import useHideSidebarRight from '~/hooks/useHideSidebarRight'
import ImageIcon from '@material-ui/icons/Image'
import { com, flex } from '~/styles'
import settings from '~/api/settings'
import styleVars from '~/styles/styleVars'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'
import { ReactComponent as TagIcon } from '~/images/sub/tag.svg'
import CloseIcon from '@material-ui/icons/Close'
import article from '~/api/article'
import getConfirm from '~/externalContexts/confirm'
import tag from '~/api/tag'
import getNotify from '~/externalContexts/notify'
import BgImg from '~/components/BgImg'

export interface Props {
  
}

type FinalProps = Props & DataConnectedProps

function Settings(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    notify = getNotify(),
    confirm = getConfirm(),
    [title, setTitle] = useState(''),
    [subtitle, setSubtitle] = useState(''),
    [bgImg, setBgImg] = useState(''),
    [bgImgStatus, setBgImgStatus] = useState(1),
    [articleTotalForActiveTag, setArticleTotalForActiveTag] = useState<number>(-1)

  useHideSidebarRight()

  useEffect(() =>{
    props.$data.getSettings()
      .then(data =>{
        setTitle(data.title)
        setSubtitle(data.subtitle)
        setBgImg(data.bgImg)
        if(data.bgImg) setBgImgStatus(3)
      })
  }, [])

  function uploadBgImg(event: ChangeEvent<HTMLInputElement>){
    if(event.target.files!.length === 0){ return }
    let file = event.target.files!.item(0)!
    
    setBgImgStatus(2)
    settings.uploadBgImg({ file })
      .then(data =>{
        setBgImgStatus(3)
        setBgImg(data.fileUrl)
      }).catch(e =>{
        console.log(e)
        setBgImgStatus(1)
      })
  }

  function getArticleTotalByTag(tagId: string){
    setArticleTotalForActiveTag(-1)
    article.searchByTag({ tagId })
      .then(data => setArticleTotalForActiveTag(data.total))
  }

  function setTagName(tagObj: ApiData.Tag){
    confirm({
      input: true,
      inputValue: tagObj.name,
      inputLabel: '新标签名',
      title: '修改标签名',
      onCheck (inputValue){
        tag.set({ tagId: tagObj._id, name: inputValue! })
          .then(() =>{
            notify.success('修改成功')
            let {tags} = props.state.data
            tags.forEach(item =>{
              if(item._id === tagObj._id) item.name = inputValue!
            })

            props.$data.set('tags', tags)
          })
      },
    })
  }

  function removeTag(tagId: string){
    article.searchByTag({ tagId })
      .then(({total}) =>{
        if(total !== 0) return notify('该标签下还有文章，无法删除')

        confirm({
          content: '确定要删除这个标签？',
          onCheck (){
            tag.delete({ tagId })
              .then(() =>{
                notify.success('删除成功')
                let {tags} = props.state.data
                props.$data.set('tags', tags.filter(item => item._id !== tagId))
              })
          }
        })
      })
  }

  function addTag(){
    confirm({
      input: true,
      title: '添加标签',
      inputLabel: '标签名',
      onCheck (inputValue){
        tag.set({ name: inputValue! })
          .then(data =>{
            let {tags} = props.state.data
            let newTag = {
              _id: data.tagId,
              name: inputValue!
            }
            props.$data.set('tags', tags.concat([newTag]))
          })
      }
    })
  }

  function save(){
    settings.set({ title, subtitle, bgImg })
      .then(() =>{
        notify.success('保存成功')
        _GLOBAL.homeRefreshMark = true
      })
  }

  if(!props.state.data.tags) return <div />

  return (
    <div className={classes.container}>
      <BgImg hidden />
      <div className={c(flex.row, flex.crossCenter, flex.between)}>
        <h2 className={com.mainTitle}>页面设置</h2> 
        <Button
          variant="contained"
          color="primary"
          onClick={save}
        >保存</Button>
      </div>

      <TextField fullWidth 
        style={{ marginTop: 20 }}
        label="首页标题" 
        variant="outlined" 
        value={title}
        onChange={e => setTitle(e.target.value.trim())}
      />

      <TextField fullWidth 
        label="首页副标题" 
        variant="outlined" 
        value={subtitle}
        onChange={e => setSubtitle(e.target.value.trim())}
      />

      <div style={{ margin: '40px auto', maxWidth: 800 }}>           
        <label className={classes.upload} data-status={bgImgStatus}>
          {bgImgStatus === 3 ?
            <img alt="headImg" src={bgImg} />
          :
            <div className="hint">
              <ImageIcon fontSize="large" />
              <p style={{ marginTop: 5 }}>{['', '添加背景图片', '上传中'][bgImgStatus]}</p>
            </div>
          }
          <input type="file" style={{ position: 'fixed', left: -9999 }} onChange={uploadBgImg} />
        </label>
      </div>

      <div>
        <div className={c(flex.row, flex.between, flex.crossCenter)}>
          <div>
            <h3 style={{ fontWeight: 'initial', marginBottom: 0 }}>标签管理</h3>
            <p className={com.subTitle} style={{ marginTop: 5 }}>对标签的操作将立即生效</p>
          </div>

          <Button
            style={{ marginTop: 20 }}
            variant="outlined"
            color="primary"
            onClick={addTag}
          >添加标签</Button>
        </div>
        <div className={c(flex.row, flex.crossCenter, flex.wrap, classes.tags)}>{props.state.data.tags.map(tag =>
          <Tooltip key={tag._id}
            title={articleTotalForActiveTag === -1 ? '加载中' : `标签下共有${articleTotalForActiveTag}篇文章`} 
            placement="top"
            classes={{ tooltip: classes.toolTip }}
            onMouseEnter={() => getArticleTotalByTag(tag._id)}
          >
            <div 
              className="tag" 
              key={tag._id} 
              onClick={() => setTagName(tag)}
            >
              <TagIcon style={{ marginRight: 5, width: 14, height: 14, fill: 'white', verticalAlign: 'text-bottom' }} />
              <span>{tag.name}</span>
              <CloseIcon className={classes.removeTagBtn} onClick={e =>{ e.stopPropagation(); removeTag(tag._id) }} />
            </div>  
          </Tooltip>
        )}</div>
      </div>
    </div>
  )
}

export default dataHOC(Settings) as FC<Props>

const useStyles = makeStyles({
  '@global': {
    '.mainLayout-content': {
      maxWidth: 'initial',
    },
  },

  container: {
    '@global > *:not(:first-child)': {
      marginTop: 40
    }
  },

  upload: {
    height: 350,
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
        objectFit: 'contain',
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
  },

  tags: {
    fontSize: 13,
    marginTop: 10,

    '@global .tag': {
      transition: 'all 0.2s',
      borderRadius: 5,
      padding: 5,
      marginTop: 5,
      marginRight: 10,
      backgroundColor: styleVars.main,
      fill: 'white',
      color: 'white',
      cursor: 'pointer',
      
      '&:hover': {
        backgroundColor: styleVars.dark
      },

      '& svg': {
        position: 'relative',
        top: -1
      }
    }
  },

  removeTagBtn: {
    fontSize: 16, 
    verticalAlign: 'middle', 
    marginLeft: 5,
    borderRadius: '50%',
    transition: 'all 0.2s',

    '&:hover': {
      backgroundColor: styleVars.light
    }
  },

  toolTip: {
    fontSize: 13
  }
})