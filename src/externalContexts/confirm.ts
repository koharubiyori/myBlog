import { MyConfirmRef } from '~/components/dialog/Confirm'

const context = {
  current: undefined as any as MyConfirmFn
}

type Show = MyConfirmRef['show']
type Hide = MyConfirmRef['hide']
export interface MyConfirmFn extends Show {
  hide: Hide  
}

export default function getConfirm(){
  return context.current
}

export function bindContext(ref: MyConfirmRef){
  let myConfirm: any = ref.show
  myConfirm.hide = ref.hide

  context.current = myConfirm
}