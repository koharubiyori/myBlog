import createClasses from '~/utils/createClasses'
import styleVars from './styleVars'

const minWidth = 870
const nProgressColor = '#F9CD36'

createClasses('', {
  '@global': {
    'html, body': {
      minWidth,
      margin: 0,
      fontFamily: '微软雅黑'
    },

    '::selection': {
      backgroundColor: 'black',
      color: 'white'
    },

    '::-webkit-scrollbar': {
      width: 8,
      height: 8
    },

    '::-webkit-scrollbar-thumb': {
      borderRadius: 5,
      backgroundColor: '#666'
    },

    '::-webkit-scrollbar-track': {
      backgroundColor: '#eee',
      boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)'
    },

    'svg.icon.inheritFill > path': {
      fill: 'inherit'
    },

    '[data-name=mojs-shape]': {
      position: 'fixed !important',
      zIndex: 10000,
      pointerEvents: 'none'
    },

    hr: {
      width: '100%',
      border: 'none',
      height: 1,
      margin: '10px 0'
    },

    '.MuiAppBar-positionFixed:not(foo)': {
      left: 0,
      minWidth
    },

    // 进度条样式
    '#nprogress:not(foo)': {
      '@global .bar': {
        zIndex: 10000,
        backgroundColor: nProgressColor,
        height: 4,
        borderRadius: 10
      },

      '@global .peg': {
        boxShadow: `0 0 15px ${nProgressColor}, 0 0 10px ${nProgressColor}, 0 0 5px ${nProgressColor}`
      }
    },

    // 图片查看器动画时长
    '.viewer-transition': {
      transition: 'all 0.2s'
    }
  }
})