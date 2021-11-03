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

export const dataDeleteSingle = async<T> (model: BaseModel, id: string) : Promise<boolean> => {
  const tableName: string = model.table

  const ref = firebase.firestore().doc(model.table + '/' + id)
  const snap = await ref.get()
  if (!snap.exists) {
    return false
  }

  await ref.delete()
  return true
}
