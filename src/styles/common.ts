import createClasses from '~/utils/createClasses'
import styleVars from './styleVars'

export default createClasses('com', {
  mainTitle: {
    fontWeight: 'initial',
    fontSize: 26
  },

  subTitle: {
    fontSize: 15,
    color: styleVars.subtext
  },

  pointer: {
    cursor: 'pointer'
  },

  textLimit: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})