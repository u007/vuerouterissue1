import _ from 'lodash'

const changes = (object: object, base: any) => {
  let arrayIndexCounter = 0
  return _.transform(object, function (result, value, key) {
    // console.log('comparing', key, value, base[key])
    if (!_.isEqual(value, base[key])) {
      let resultKey = _.isArray(base) ? arrayIndexCounter++ : key

      result[resultKey] =
        _.isObject(value) && _.isObject(base[key])
          ? changes(value, base[key])
          : value
      // console.log('Result: ' + JSON.stringify(result))
    }
  })
}

export const deepDifferences = (
  object: Record<string, any>,
  base: Record<string, any>
): Record<string, any> => {
  return changes(object, base)
}

// compare between object only
export const differences = (
  object: Record<string, any>,
  base: Record<string, any>
): Record<string, any> => {
  let res = {}
  for (let key in object) {
    // console.log('diff', key, object[key], base[key])
    if (object[key] !== base[key]) {
      res[key] = object[key]
    }
  }
  return res
}
