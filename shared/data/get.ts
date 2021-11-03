import { ObjectId } from 'bson'
import moment from 'moment'
import { pickBy } from 'lodash'
import firebase from 'firebase/app'
import { FetchTableParam } from './shared'
import { StandardError } from '~/errors/base'
import { differences } from '~/shared/diff'
import { pagination, parseFormForServer, region } from '~/shared/general'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import BaseModel from '~/models/base'

export const dataFetchSingle = async<T>(model: BaseModel, id: string, defaultValue = {}): Promise<T> => {
  if (id === 'new') {
    return defaultValue as T
  }

  const tableName: string = model.table

  const snap = await firebase
    .firestore()
    .collection(tableName)
    .doc(id)
    .get()

  let res = snap.data() || {} as T
  res._id = id
  // console.log('raw', tableName + '/' + id, snap.data());

  return dataPreProcess<T>(model, id, res)
}

export const dataPreProcess = async <T>(model: BaseModel, id: string, data: Record<string, any>): Promise<T> => {
  const keys = Object.keys(data)
  const res: Record<string, any> = {}
  for (let c = 0; c < keys.length; c++) {
    const field = keys[c]
    let val = data[field]
    if (val !== null && val instanceof firebase.firestore.Timestamp) {
      // console.log('isdate', field, val)
      val = moment(val.toDate())
    }
    // console.log('assigned', field, val)
    res[field] = val
  }
  return res as T
}
