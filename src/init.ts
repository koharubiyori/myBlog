import { getTags, getSettings, getUncheckedNotificationTotal } from '~/redux/data/HOC'
import { getRole } from './redux/user/HOC'

export default function(){
  getTags(true)
  getSettings(true)
  getRole() !== 'visitor' && getUncheckedNotificationTotal()
}