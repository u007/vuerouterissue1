import { ObjectId } from 'bson'
import moment from 'moment'
import { pickBy } from 'lodash'
import firebase from 'firebase/app'
// import { CollectionReference } from 'firebase/firestore'
import { FetchTableParam } from './shared'
import { StandardError } from '~/errors/base'
import { differences } from '~/shared/diff'
import { makeFriendlyRandomCaseInsentitiveAplhaNumeric, pagination, parseFormForServer, region } from '~/shared/general'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import BaseModel from '~/models/base'

export interface SaveDataType {
  _id?: string
}

export interface SaveOption {
  byPassValidate?: boolean
}

export interface RootStateType {
  session: {
    currentUser: {
      id: string
    }
  }
}
/*
  does partial update based on given data fields only
*/
export const dataSaveSingle = async<T>(rootState: RootStateType, model: BaseModel, data: SaveDataType, options: SaveOption = {}): Promise<T | null> => {
  if (!options.byPassValidate) {
    await dataCheckSingle(model, data)
  }
  const tableName: string = model.table
  // console.log('dataSaveSingle', tableName, data)
  const isNew = !data._id
  let collection = firebase.firestore().collection(tableName)
  let ref = isNew
    ? collection.doc()
    : collection.doc(data._id)

  let oriRecord: any = {}

  if (!isNew) {
    let record = await ref.get()
    if (!record.exists) {
      console.error(tableName + ' by id missing', data)
      throw new Error(tableName + ' missing')
    }

    oriRecord = { ...record.data(), _id: data._id } || {}
  }

  let updating: any = {}
  let now = moment().toDate()
  let currentUser = rootState.session.currentUser
  if (isNew) {
    updating = {
      createdAt: moment().toDate(),
      updatedAt: now,
      createdBy: currentUser.id,
      ...data
    }
  } else {
    // only send changes
    // console.log('udpate', u, oriOffer)
    updating = differences(data, oriRecord)
  }
  // console.log('ori updated', Object.assign({}, updated))
  updating = pickBy(
    updating,
    (value, key) =>
      data.hasOwnProperty(key) &&
      key !== 'created_at' &&
      key !== 'updated_at' &&
      key !== 'createdAt' &&
      key !== 'updatedAt' &&
      key !== '_id'
  )

  if (model.onBeforeValidate) {
    await model.onBeforeValidate(rootState, data, oriRecord)
  }
  updating.updatedAt = now
  updating.updatedBy = currentUser.id

  console.log('updating final', now, updating)

  if (model.uniques) {
    for (let u = 0; u < model.uniques.length; u++) {
      const names = model.uniques[u]
      let cur: any

      for (let n = 0; n < names.length; n++) {
        const name = names[n]
        const val = data[name]
        const fieldSchema = model.fields[name]
        const fieldLabel = fieldSchema?.label || name

        console.log('where', name, data[name], data)
        if (val === undefined) {
          throw new Error(`${fieldLabel} is not set but required for unique`)
        }
        if (cur === undefined) {
          cur = collection.where(name, '==', data[name])
          continue
        }
        cur = cur.where(name, '==', data[name])
      }

      let qSnap: firebase.firestore.QuerySnapshot = await (cur as firebase.firestore.Query).get()
      // console.log('dup found?', qSnap.docs)
      if (qSnap.docs.length > 0 && isNew) {
        throw new Error('Record exists')
      }
      for (let c = 0; c < qSnap.docs.length; c++) {
        const snap = qSnap.docs[c]
        let found = snap.data()
        console.log('found?', found, snap.id)
        if (snap.exists && snap.id !== data._id) {
          throw new Error('Record exists')
        }
      }// each found
    }
  }// has uniques

  if (model.onBefore) {
    if (await model.onBefore(rootState, data, oriRecord) === false) {
      console.log('returned false onBefore')
      return null
    }
  }

  // console.log('saving', updating, Object.keys(updating).length)
  if (Object.keys(updating).length > 0) {
    // console.log('changed field', updated)
    updating = parseFormForServer(updating)
    // console.log('updating?', updating)
    if (!isNew) {
      updating.updatedAt = now
      // console.log('update', updating)
      let res = await ref.update(updating)
      // console.log('res', res)
    } else {
      // console.log('new id', ref.id)
      let res = await ref.set(updating)
      // console.log('res', res)
      data._id = ref.id
    }
  }

  const updatedRef = collection.doc(data._id)
  const updated = await updatedRef.get()
  console.log('saved', updated)

  if (model.onAfter) {
    if (await model.onAfter(rootState, data, oriRecord) === false) {
      console.log('returned false onAfter')
    }
  }

  return { _id: data._id, ...updated.data() as T }
}

export type CheckOption = {
  required: string[]// for both update and new
  insertRequired?: string[]// for only new
  updateRequired?: string[]// for only update
}

export interface CheckType {
  _id?: string
}

export const dataCheckSingle = async (model: BaseModel, data: CheckType): Promise<boolean> => {
  let required = [...model.required, ...(!data._id ? model.insertRequired || [] : model.updateRequired || [])]
  for (let i in required) {
    const field: string = required[i]
    const fieldSchema = model.fields[field]
    const fieldLabel = fieldSchema?.label || field
    // console.log(field)
    if (data[field] === undefined) {
      throw new Error(fieldLabel + ' is required')
    }

    if (data[field] === null) {
      const fieldSchema = model.fields[field]
      if (fieldSchema) {
        if (fieldSchema.nullable === undefined || !fieldSchema.nullable) {
          throw new Error(fieldLabel + ' cannot be null')
        }
      }
    }
  }
  if (model.fields) {
    const fields = Object.keys(model.fields)
    for (let c = 0; c < fields.length; c++) {
      const fieldName = fields[c]
      const field = model.fields[fieldName]
      const val = data[fieldName]
      const fieldType = field.type
      const fieldLabel = field?.label || fieldName

      if (val === undefined || val === null) {
        continue
      }
      switch (fieldType) {
        case 'money':
          const checkVal = parseFloat(val)
          if (isNaN(checkVal)) {
            throw new TypeError(fieldLabel + ' is not a ' + fieldType)
          }
          break

        case 'float':
          const checkVal2 = parseFloat(val)
          if (isNaN(checkVal2)) {
            throw new TypeError(fieldLabel + ' is not a ' + fieldType)
          }
          break
        case 'int':
          const checkVal3 = parseInt(val, 10)
          if (isNaN(checkVal3)) {
            throw new TypeError(fieldLabel + ' is not a ' + fieldType)
          }
          break

        case 'boolean':
          if (typeof val !== 'boolean') {
            throw new TypeError(fieldLabel + ' is not a ' + fieldType)
          }
          break

        default:
      }
    }
  }

  return true
}
