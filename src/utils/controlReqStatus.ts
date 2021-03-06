import { Dispatch } from 'react'

export default function controlReqStatus<
  SetStatus extends Dispatch<number>,
  ReqPromise extends Promise<unknown>,
>(setStatus: SetStatus, reqPromise: ReqPromise): ReqPromise{
  setStatus(2)
  return reqPromise
    .then(data =>{
      setStatus(3)
      return Promise.resolve(data)
    })
    .catch(e =>{
      setStatus(0)
      return Promise.reject(e)
    }) as any
}