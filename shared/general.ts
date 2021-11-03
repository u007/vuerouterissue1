import firebase from 'firebase/app'
import 'firebase/firestore'

export const pagination = {
  limit: 10
}

export const cacheDuration = 60 * 10 // 10minutes

// data has to be object or array
export const parseFormForServer = (data: any) => {
  let res: any = {}
  for (let key in data) {
    if (key === '__ob__') {
      continue
    }
    let value = data[key]
    // console.log('parseFormForServer', key, value)
    if (
      value !== undefined && value != null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !value._d &&
      !(value instanceof firebase.firestore.GeoPoint)
    ) {
      // console.log('clone object', key)
      res[key] = parseFormForServer(value)
    } else if (value instanceof firebase.firestore.GeoPoint) {
      // console.log('is geopoint', key)
      res[key] = value // use as it is
    } else if (value !== undefined && value !== null && value._d) {
      if (value.isValid()) {
        res[key] = value.toDate()
      } else {
        res[key] = null
      }
    } else if (Array.isArray(value)) {
      // when clone array, map does not include private or observers
      // console.log('clone array', key, value)
      res[key] = value.map((v, i) => {
        // console.log('array ', v, i)
        if (typeof v === 'object') {
          return parseFormForServer(v)
        }
        return v
        // console.log('arr value', newval)
      })
    } else if (typeof value === 'function') {
      // ignore
    } else {
      // console.log('normalclone', i, Array.isArray(val), val)
      res[key] = value
    }
  }
  return res
}

export const valueOrClone = (i: string | number, value: any) => {
  if (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !value._d &&
    !(value instanceof firebase.firestore.GeoPoint)
  ) {
    // console.log('clone object', i, val)
    return cloneData(value)
  } else if (value instanceof firebase.firestore.GeoPoint) {
    return value // use as it is
  } else if (Array.isArray(value)) {
    // when clone array, map does not include private or observers
    return value.map((v, i) => {
      return valueOrClone(i, v)
    })
  } else if (typeof value === 'function') {
    // ignore
    return undefined
  } else {
    // console.log('normalclone', i, Array.isArray(val), val)
    return value
  }
}

export const formats = {
  date: 'dd MMM YYYY',
  dateTime: 'dd MMM yyyy HH:mm:ss'
}

export const makeRandomAplhaNumeric = (length: number) => {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export const makeID = (length: number) => {
  return makeRandomAplhaNumeric(length)
}

// not case sensitive and does not contain similar looking charactor like O vs 0
export const makeFriendlyRandomCaseInsentitiveAplhaNumeric = (
  length: number
) => {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export const region = 'asia-northeast1'

export const cloneData = (obj) => {
  let clone: any = {}
  for (let i in obj) {
    // if (typeof obj[i] !== 'function') {
    //   console.log('clone', i, obj[i], typeof obj[i])
    // }
    if (obj[i] !== null) {
      clone[i] = valueOrClone(i, obj[i])
    }
  }
  return clone
}
