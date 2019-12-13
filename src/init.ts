import { updateUserInfo } from '~/redux/user/HOC'
import { getTags } from '~/redux/data/HOC'

export default function(){
  updateUserInfo()
  getTags()
}
