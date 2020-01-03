import React, { useState, useEffect, useRef, PropsWithChildren, ChangeEvent, FC } from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import useHideSidebarRight from '~/hooks/useHideSidebarRight'
import ImageIcon from '@material-ui/icons/Image'
import { com } from '~/styles'
import settings from '~/api/settings'
import styleVars from '~/styles/styleVars'
import { dataHOC, DataConnectedProps } from '~/redux/data/HOC'

export interface Props {
  
}

type FinalProps = Props & DataConnectedProps

function Settings(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [title, setTitle] = useState(''),
    [subtitle, setSubtitle] = useState(''),
    [bgImg, setBgImg] = useState(''),
    [bgImgStatus, setBgImgStatus] = useState(1),
    [tags, setTags] = useState()

  useHideSidebarRight()

  useEffect(() =>{
    props.$data.getSettings()
      .then(data =>{
        setTitle(data.title)
        setSubtitle(data.subtitle)
        setBgImg(data.bgImg)
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
  
  return (
    <div className={classes.container}>
      <h2 className={com.mainTitle}>页面设置</h2>

      <TextField fullWidth 
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

      <div style={{ margin: '20px auto', maxWidth: 800 }}>           
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