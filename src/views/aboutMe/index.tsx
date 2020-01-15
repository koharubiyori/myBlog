import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { makeStyles, Box, Tooltip } from '@material-ui/core'
import common from '~/api/common'
import useHideSidebarRight from '~/hooks/useHideSidebarRight'
import styleVars from '~/styles/styleVars'
import { ReactComponent as ChromeIcon } from '~/images/logo/chrome.svg'
import { ReactComponent as ChinaIcon } from '~/images/logo/china.svg'
import { ReactComponent as JapanIcon } from '~/images/logo/japan.svg'
import { ReactComponent as HtmlIcon } from '~/images/logo/html.svg'
import { ReactComponent as CssIcon } from '~/images/logo/css.svg'
import { ReactComponent as JavaScriptIcon } from '~/images/logo/javaScript.svg'
import { ReactComponent as MarkdownIcon } from '~/images/logo/markdown.svg'
import { ReactComponent as LuaIcon } from '~/images/logo/lua.svg'
import { ReactComponent as WikitextIcon } from '~/images/logo/wikitext.svg'
import { ReactComponent as WindowsIcon } from '~/images/logo/windows.svg'
import { ReactComponent as UbuntuIcon } from '~/images/logo/ubuntu.svg'
import { ReactComponent as VSCodeIcon } from '~/images/logo/vscode.svg'
import { ReactComponent as AndroidIcon } from '~/images/logo/android.svg'
import useESO from '~/hooks/useSEO'

export interface Props {
  
}

type FinalProps = Props

function AboutMe(props: PropsWithChildren<FinalProps>){
  const
    classes = useStyles(),
    [theme, setTheme] = useState<ApiData.Theme>(null as any)
  
  useHideSidebarRight()

  useESO(setTitle => setTitle('关于我'))

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
          <Tooltip title="虽然是套壳，但确实套了个好用的壳[狗头]" placement="top">
            <div className="box">
              <a rel="noopener norefferrer" href="https://browser.360.cn/ee/" target="_blank">
                <img src={require('~/images/logo/360chrome.png')} className="icon" alt="icon" />
                <span>360极速浏览器</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="开发主力">
            <div className="box">
              <a rel="noopener norefferrer" href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">
                <ChromeIcon />
                <span>Chrome</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="500kb+，简洁轻量"  placement="top">
            <div className="box">
              <a rel="noopener norefferrer"  href="https://www.coolapk.com/apk/mark.via" target="_blank">
                <img src={require('~/images/logo/via.png')} className="icon" style={{ width: 30, height: 'auto' }} alt="icon" />
                <span>Via</span>
              </a>
            </div>
          </Tooltip>
        </div>

        <div data-title="语言" className="item">
          <Tooltip title="“请解释一下领导和阿呆的对话中每个意思的意思。”" placement="top">
            <div className="box">
              <ChinaIcon />
              <span>汉语</span>
            </div>
          </Tooltip>
          <Tooltip title="死宅人均水平(N2)">
            <div className="box">
              <JapanIcon />
              <span>日本語</span>
            </div>
          </Tooltip>
        </div>

        <div data-title="程序语言" className="item">
          <Tooltip title="你说html不是编程语言？好吧确实不是_(:з」∠)_" placement="top">
            <div className="box">
              <a rel="noopener norefferrer" href="https://developer.mozilla.org/zh-CN/docs/Web/HTML" target="_blank">
                <HtmlIcon />
                <span>HTML</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="热衷于纯css实现xxx">
            <div className="box">
            <a rel="noopener norefferrer" href="https://developer.mozilla.org/zh-CN/docs/Web/CSS" target="_blank">
              <CssIcon />
              <span>CSS</span>
            </a>
            </div>
          </Tooltip>
          <Tooltip title="まったく、J(じょし)S(しょうがくせい)は最高だぜ" placement="top">
            <div className="box">
              <a rel="noopener norefferrer" href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript" target="_blank">
                <JavaScriptIcon />
                <span>JavaScript</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="TS大法好">
            <div className="box">
              <a rel="noopener norefferrer" href="https://www.tslang.cn" target="_blank">
                <img src={require('~/images/logo/typescript.png')} className="icon" style={{ width: 27, height: 'auto', position: 'relative', top: 1 }} alt="logo" />
                <span>TypeScript</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="写博客用" placement="top">
            <div className="box">
              <a rel="noopener norefferrer" href="https://www.markdown.cn" target="_blank">
                <MarkdownIcon className="icon inheritFill" style={{ fill: 'black' }} />
                <span>Markdown</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="不会做游戏，只是用来写mediawiki模块的_(:з」∠)_">
            <div className="box">
              <a rel="noopener norefferrer" href="http://www.lua.org" target="_blank">
                <LuaIcon className="icon inheritFill" style={{ fill: '#00007D' }} />
                <span>Lua</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="被Fullter一口奶活了的语言：Flutter is Future." placement="top">
            <div className="box">
              <a rel="noopener norefferrer" href="https://www.dartcn.com" target="_blank">
                <img src={require('~/images/logo/dart.png')} className="icon" alt="logo" />
                <span>Dart</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="时间长不写已经快忘光了...">
            <div className="box">
              <a rel="noopener norefferrer" href="https://www.php.net" target="_blank">
                <img src={require('~/images/logo/php.png')} className="icon" style={{ width: 27, height: 'auto' }} alt="logo" />
                <span>PHP</span>
              </a>
            </div>
          </Tooltip>
          <Tooltip title="编辑萌百" placement="top">
            <div className="box">
              <a rel="noopener norefferrer" href="https://zh.wikipedia.org/wiki/Wiki标记语言" target="_blank">
                <WikitextIcon className="icon inheritFill" style={{ fill: 'black' }} />
                <span>Wikitext</span>
              </a>
            </div>
          </Tooltip>
        </div>

        <div data-title="编码习惯" className="item">
          <Tooltip title="讨厌：使用一键格式化把我代码后面加上分号的同事" placement="top">
            <div className="box">
              <div style={{ fontSize: 12, marginRight: 10, color: '#666', fontWeight: 'bold', backgroundColor: '#1E1E1E', padding: 5, borderRadius: 5 }}>
                <span style={{ color: '#9CDCFE' }}>semi:</span>
                <span style={{ color: '#569CD6' }}> false</span>
              </div>
              <span>JS结尾无分号</span>
            </div>
          </Tooltip>
          <div className="box">
            <div style={{ fontSize: 12, marginRight: 10, color: '#666', fontWeight: 'bold' }}>double space</div>
            <span>双空格缩进</span>
          </div>
          <div className="box">
            <div style={{ fontSize: 16, marginRight: 10, color: '#2C7AD6', fontWeight: 'bold' }}>{'if(){'}</div>
            <span>花括号不换行</span>
          </div>
        </div>

        <div data-title="编辑器" className="item">
          <Tooltip title="宇宙第一编辑器" placement="top">
            <div className="box">
              <a rel="noopener norefferrer"  href="https://code.visualstudio.com" target="_blank">
                <VSCodeIcon className="icon inheritFill" style={{ fill: '#0089D2' }} />
                <span>Visual Studio Code</span>
              </a>
            </div>
          </Tooltip>
        </div>
        
        <div data-title="系统" className="item">
          <Tooltip title="用不起林檎" placement="top">
            <div className="box">
              <WindowsIcon className="icon inheritFill" style={{ fill: '#0077C8' }} />
              <span>Windows 10</span>
            </div>
          </Tooltip>
          <div className="box">
            <img src={require('~/images/logo/linux.png')} className="icon" style={{ height: 'auto' }} alt="logo" />
            <span>Linux(</span>
            <UbuntuIcon className="icon inheritFill" style={{ fill: '#DE4815', marginLeft: 5 }} />
            <span>Ubuntu)</span>
          </div>
          <Tooltip title="喜欢MIUI11的音效" placement="top">
            <div className="box">
              <AndroidIcon className="icon inheritFill" style={{ fill: '#A4C639' }} />
              <span>Android(MIUI 11)</span> 
            </div>
          </Tooltip>
        </div>

        <hr style={{ backgroundColor: '#ccc', margin: '20px 0' }} />

        <div className={classes.profile}>
          <p>No Anime No Life.</p>
          <p>喜欢日语，然而只达到了能推Galgame的程度。</p>
          <p>喜欢编程，创造自己的小玩具。</p>
          <p>喜欢一个人，独自一人做自己喜欢的事情。</p>
        </div>
      </main>
    </Box>
  )
}

export default AboutMe

const useStyles = makeStyles({
  '@global': {
    '.MuiTooltip-tooltip': {
      fontSize: 13
    },
    
    '@keyframes twist': {
      '@global 50%': {
        transform: 'perspective(400px) rotateY(25deg)'
      }
    },

    '.item': {
      margin: '20px 0',

      '@global .icon': {
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
        marginRight: 10,
        width: '4em'
      },

      '@global > .box': {
        height: 45,
        verticalAlign: 'middle',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 10px',
        margin: 5,
        transition: 'all 0.2s',
        color: '#666',
        cursor: 'pointer',
        boxShadow: '0 0 3px #666',

        '&:hover': {
          backgroundColor: 'rgba(230, 230, 230, 0.3)',
          animation: 'twist 0.4s'
        },

        '@global a': {
          textDecoration: 'none',
          color: 'inherit',

          '@global > *': {
            verticalAlign: 'middle'
          }
        }
      }
    },
  },

  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    minWidth: 800
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
    backgroundColor: 'white',
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
    padding: '10px 20px',
    position: 'relative'
  },

  profile: {
    fontSize: 16,
    fontFamily: '"微软雅黑"',

    '@global p': {
      margin: '10px 0',

      '&:first-child': {
        marginTop: 0
      }
    }
  }
})