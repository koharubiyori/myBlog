import { ObjectID } from 'bson'
import moment from 'moment'

export default (id: string) => moment(new ObjectID(id).getTimestamp())