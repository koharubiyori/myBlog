const colors = {
  main: '#6B69D6',
  dark: '#504FA0',
  light: '#9796E3',
  subtext: '#ABABAB',
  black: '#313131'
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