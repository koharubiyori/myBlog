import { makeStyles } from "@material-ui/core"
import styleVars from "~/styles/styleVars"

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
          borderLeftColor: '#ccc',
          backgroundColor: '#fefefe',
          padding: 10
        },

        ':not(pre) code': {
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
          '@global': {
            '.hljs-comment, .hljs-quote': {
              fontStyle: 'initial'
            },
          }
        },
      }
    }
  }
})