import { makeStyles } from "@material-ui/core"
import styleVars from "~/styles/styleVars"

export default makeStyles({
  main: {
    '@global .tui-editor-contents': {
      '@global': {
        'h1, h2, h3, h4, h5, h6, p': {
          color: 'black'
        },

        h3: {
          fontWeight: 600,
          fontSize: 17
        },

        blockquote: {
          borderWidth: 7,
          borderLeftColor: '#ccc',
          backgroundColor: '#fefefe',
          padding: 10
        },

        code: {
          fontSize: 14
        }
      }
    }
  }
})