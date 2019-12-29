import { CSSProperties } from 'react'

const colors = {
  main: '#6B69D6',
  dark: '#504FA0',
  light: '#9796E3',
  subtext: '#ABABAB',
  black: '#313131'
}

export function createTransition(
  enter: CSSProperties, 
  active: CSSProperties, 
  exit: CSSProperties
){
  return {
    '&-enter, &-exit-active': enter,
    '&-enter-active, &-exit-active': active,
    '&-enter-active': exit
  }  
}

export default {
  ...colors,
  contentContainer: { 
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 1,
    boxShadow: `0 0 3px white`
  },

  textLimit: {
    whiteSpace: 'nowrap' as any,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}