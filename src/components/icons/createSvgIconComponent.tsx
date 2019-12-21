import React from 'react'
import { makeStyles } from '@material-ui/styles'

SvgIcon.defaultProps = {

}

export type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

function SvgIcon(props: Props & { svg: string }){
  const 
    classes = useStyles()
  let className = classes.svgIcon + ' ' + (props.className || '')

  return <div {...props} style={{ ...props.style, fill: props.color }} dangerouslySetInnerHTML={{ __html: props.svg }} className={className} />
}

export default (svg: string) => (props: Props) => <SvgIcon {...props} svg={svg} />

const useStyles = makeStyles({
  svgIcon: {
    display: 'inline-block',
    border: 'none',
    width: '1em',
    height: '1em',
  },

  '@global svg': {
    width: 'inherit',
    height: 'inherit',
    fill: 'inherit',
    verticalAlign: 'middle'
  }
})
      