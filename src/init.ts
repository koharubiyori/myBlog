import { updateUserInfo } from '~/redux/user/HOC'
import { getTags, getSettings, getUncheckedNotificationTotal } from '~/redux/data/HOC'

export default function(){
  updateUserInfo()
  getTags()
  getSettings()
  getUncheckedNotificationTotal()
}