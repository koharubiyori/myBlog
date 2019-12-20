import createClasses from '~/utils/createClasses'

export default createClasses('transition', {
  fade: {
    [`&-enter,
      &-exit-active
    `]: {
      opacity: 0
    },

    [`&-enter-active,
      &-exit-active
    `]: {
      transition: 'all 0.2s',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    },

    '&-enter-active': {
      opacity: 1
    }
  }
})
