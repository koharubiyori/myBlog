import createClasses from '~/utils/createClasses'
import { createTransition } from './styleVars'

export default createClasses('transition', {
  fadeSink: createTransition(
    {
      opacity: 0,
      transform: 'translateY(-30px)'
    }, {
      transition: 'all 0.6s'
    }, {
      opacity: 1,
      transform: 'initial'
    }
  ),

  fadeFloat: createTransition(
    {
      opacity: 0,
      transform: 'translateY(30px)'
    }, {
      transition: 'all 0.7s'
    }, {
      opacity: 1,
      transform: 'initial'
    }
  )
})
