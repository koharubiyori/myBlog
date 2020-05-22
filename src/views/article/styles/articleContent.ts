import { makeStyles } from '@material-ui/core'
import styleVars from '~/styles/styleVars'

export default makeStyles({
  main: {
    '@global .tui-editor-contents': {
      fontSize: 14,
      
      '@global': {
        'h1, h2, h3, h4, h5, h6, p, ul': {
          color: 'black'
        },

        h3: {
          fontWeight: 600,
          fontSize: 17,
          margin: '20px 0'
        },

        blockquote: {
          borderWidth: 7,
          backgroundColor: '#eee',
          borderLeftColor: styleVars.main,
          padding: 10
        },

        ':not(pre) > code': {
          fontSize: 14,
          backgroundColor: '#FFFEFC',
          borderRadius: 5,
          margin: '0 3px',
          padding: '2px 4px',
          color: '#DF3A01'
        },

        img: {
          cursor: 'pointer'
        },

        pre: {
          backgroundColor: '#1E1E1E',
          color: '#ddd',
          borderRadius: 10,
          boxShadow: '0px 0px 5px #666, 0px 0px 8px #666',
          
          '@global': {
            '.hljs-comment, .hljs-quote': {
              fontStyle: 'initial'
            },
            
            '.hljs-title': {
              color: '#DCDCAA',
            },

            'hljs-subst': {
              color: '#2566CA'
            },

            '.hljs-tag': {
              color: '#569CD6',

              '& .hljs-name': {
                color: '#569CD6'
              }
            },

            '.hljs-attr': {
              color: '#9CDCFE'
            },

            '.hljs-string': {
              color: '#CE9178'
            },

            '.hljs-keyword': {
              color: '#C586C0',
            },

            '.hljs-comment': {
              color: '#6A9955'
            },
          }
        },
      }
    }
  }
})