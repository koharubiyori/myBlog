import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, Box } from '@material-ui/core'
import common from '~/api/common'
import useHideSidebarRight from '~/hooks/useHideSidebarRight'
import styleVars from '~/styles/styleVars'
import { ReactComponent as Chrome360Icon } from '~/images/logo/360chrome.svg'
import { ReactComponent as ChromeIcon } from '~/images/logo/chrome.svg'

export interface Props {
  
}

type FinalProps = Props

function AboutMe(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [theme, setTheme] = useState<ApiData.Theme>(null as any)
  
  useHideSidebarRight()

  useEffect(() =>{
    common.getTheme().then(setTheme)
  }, [])

  return (
    <Box boxShadow={2} className={classes.container}>
      <header className={classes.header}>
        <img alt="avatar" className={classes.avatar} src={theme ? theme.avatar : require('~/images/sub/akari.jpg')} />
        <div className={classes.headerLine} />
        <div className="title">
          <ruby>
            小春日和
            <rt>こはるびより</rt>
          </ruby>
        </div>
      </header>
      <main className={classes.main}>
        <div data-title="浏览器" className="item">
          <div>
            <Chrome360Icon className="icon inheritFill" />
            <span>360极速浏览器</span>
          </div>
          <div>
            <ChromeIcon />
            <span>Chrome</span>
          </div>
          <div>
            <span>Via</span>
          </div>
        </div>

        <div data-title="语言" className="item">
          <div>汉语</div>
          <div>日本語</div>
        </div>

        <div data-title="程序语言" className="item">
          <div>HTML</div>
          <div>CSS</div>
          <div>JavaScript</div>
          <div>TypeScript</div>
          <div>Markdown</div>
          <div>Lua</div>
          <div>Dart</div>
          <div>PHP</div>
          <div>wikitext</div>
        </div>

        <div>
          <div data-title="缩进" className="onlyItem">双空格</div>
          <div data-title="大括号">不换行</div>
        </div>
        
        <div data-title="使用系统" className="item">
          <div>Windows 10</div>
          <div>Linux(Ubuntu)</div>
          <div>Android(MIUI 11)</div>
        </div>
      </main>
    </Box>
  )
}

export default AboutMe

const useStyles = makeStyles({
  '@global': {
    '.item': {
      margin: '20px 0',

      '@global svg.icon': {
        width: 20,
        height: 20,
        marginRight: 5,

        '&.inheritFill': {
          fill: styleVars.main
        }
      },
      
      '&:before': {
        content: 'attr(data-title)',
        display: 'inline-block',
        marginRight: 10
      },

      '@global > div': {
        height: 45,
        verticalAlign: 'middle',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(230, 230, 230, 0.8)',
        padding: '0 10px',
        margin: 5,
        transition: 'all 0.2s',
        color: '#666',
        cursor: 'pointer',

        '&:hover': {
          backgroundColor: 'rgba(230, 230, 230, 0.3)'
        }
      }
    }
  },

  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  
  header: {
    position: 'relative',
    height: 300,
    boxSizing: 'border-box',
    padding: 10,

    '@global .title': {
      position: 'absolute',
      left: 'calc((100% - 300px) / 2)',
      top: '25%',
      transform: 'translate(-50%, -50%)',
      fontSize: 30,
      color: styleVars.main,
    }
  },

  headerLine: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '100%',
    height: 3,
    backgroundColor: styleVars.main
  },
  
  avatar: {
    width: 200,
    height: 200,
    borderRadius: '50%',
    border: `5px ${styleVars.main} solid`,
    position: 'absolute',
    top: '50%',
    right: 100,
    transform: 'translateY(-50%)',
    zIndex: 1
  },

  main: {
    marginTop: -150,
    boxSizing: 'border-box',
    padding: '10px 20px'
  }
})