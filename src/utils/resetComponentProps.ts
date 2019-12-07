import { Component } from 'react'

export default function <Props = {}>(component: any){
  class ResetPropsComponent extends Component<Props> {}
  return component as typeof ResetPropsComponent
}