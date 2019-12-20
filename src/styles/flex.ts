import createClasses from '~/utils/createClasses'

export default createClasses('flex', {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'column',
  },
  
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
  },
  
  rowInline: {
    width: '100%',
    flexDirection: 'row',
    boxSizing: 'border-box',
    display: 'inline-flex',
  },
  
  column: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  
  columnInline: {
    height: '100%',
    flexDirection: 'column',
    boxSizing: 'border-box',
    display: 'inline-flex',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  crossCenter: {
    alignItems: 'center',
  },
  
  crossStart: {
    alignItems: 'flex-start',
  },
  
  crossEnd: {
    alignItems: 'flex-end',
  },
  
  mainCenter: {
    justifyContent: 'center',
  },
  
  mainStart: {
    justifyContent: 'flex-start',
  },
  
  mainEnd: {
    justifyContent: 'flex-end',
  },
  
  around: {
    justifyContent: 'space-around',
  },
  
  between: {
    justifyContent: 'space-between',
  },
  
  childrenCenter: {
    alignContent: 'center',
  },
  
  childrenAround: {
    alignContent: 'space-around',
  },
  
  childrenBetween: {
    alignContent: 'space-between',
  },
  
  grow: {
    flex: 1,
  },
  
  grow2: {
    flex: 2,
  },
  
  grow3: {
    flex: 3,
  },
  
  growLimit: {
    flex: 1,
    overflow: 'hidden',
  },
  
  grow2Limit: {
    flex: 2,
    overflow: 'hidden',
  },
  
  grow3Limit: {
    flex: 3,
    overflow: 'hidden',
  },
  
  flexShrink: {
    flexShrink: 1,
  },
  
  oneline: {
    flexBasis: '100%',
  },
  
  wrap: {
    flexWrap: 'wrap',
  },
  
  scroll: {
    overflow: 'auto',
  },
  
  selfStart: {
    alignSelf: 'flex-start',
  },
  
  selfCenter: {
    alignSelf: 'center',
  },
  
  selfEnd: {
    alignSelf: 'flex-end',
  },
},)