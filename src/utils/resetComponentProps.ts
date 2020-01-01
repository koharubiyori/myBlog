import { FC } from 'react'

export default function <Props = {}>(component: any){
  return component as FC<Props>
}