import createClasses from '~/utils/createClasses'
import styleVars from './styleVars'

const minWidth = 720
const nProgressColor = '#F9CD36'

createClasses('', {
  '@global': {
    'html, body': {
      minWidth,
      margin: 0
    },

    '::selection': {
      backgroundColor: 'black',
      color: 'white'
    },

    '.MuiAppBar-positionFixed:not(foo)': {
      left: 0,
      minWidth
    },

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
    }
  }
})