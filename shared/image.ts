import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import delay from '../helpers/delay'
import { parseCleanFilename } from './firebase'

export const loadImageURLOrEmpty = async (path: string): Promise<string | null> => {
  if (!path) {
    return null
  }

  let dirPath = path.substring(0, path.lastIndexOf('/'))
  let fileName = path.substring(dirPath.length + 1)
  console.log('loadImageURLOrEmpty', path, 'dirpath', dirPath, 'filename', fileName)
  const maxTry = 2
  let tryNo = 0
  while (tryNo < maxTry) {
    try {
      let testUploadRef = await firebase.storage().ref(dirPath).child(fileName)
      console.log(`loadImageURLOrEmpty trying image ${tryNo} | ${dirPath} |||| ${fileName}`)
      // let uploadURL = await uploadRef.getDownloadURL()
      let newUploadURL = await testUploadRef.getDownloadURL()

      console.log('loadImageURLOrEmpty found!', newUploadURL);
      // return uploadURL
      return newUploadURL
    } catch (e: any) {
      console.log('loadImageURLOrEmpty unable to loadImage', path, e.message)
      tryNo++
      await sleep(500)
    }
  }

  return null
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const storageDeletePhoto = async (
  path: string,
  field: string,
  imageURLs,
  fileName: string
): Promise<any> => {
  // File sizes
  const sizes = [128, 256, 512, 1024, 2048]

  if (!path) {
    throw new Error('Path must be specified')
  }

  try {
    // Delete original file
    const storageRef = firebase.storage().ref(`${path}/${fileName}`)
    await storageRef.delete()

    // Delete files with diff sizes
    for (let index = 0; index < Object.keys(sizes).length; index++) {
      const fileURL = `thumb@${sizes[index]}_${fileName}`

      const storageRef = firebase.storage().ref(`${path}/${fileURL}`)
      await storageRef.delete()
    }
  } catch (error) {
    console.error(error)
  }

  const rowRef = firebase.firestore().doc(path)

  let update: Record<string, any> = {}

  // Remove photoURLs for different res
  update[field + 'URLs'] = firebase.firestore.FieldValue.arrayRemove(imageURLs)

  // Remove photos for original photo link array
  update[field + 's'] = firebase.firestore.FieldValue.arrayRemove(fileName)

  await rowRef.update(update)

  return
}

export const storageDeleteAll = async (
  path: string,
  excludes: string[] = []
): Promise<any[]> => {
  console.log('delete exclude', path, excludes)
  if (!path) {
    throw new Error('Dangerous delete all')
  }
  const storageRef = firebase.storage().ref(path)
  console.log('listing files', path)
  return await storageRef.listAll().then((listResults) => {
    console.log('deleting', listResults)
    const promises = listResults.items.map((item) => {
      if (excludes.includes(item.name)) {
        console.log('deleting skip', item.name)
        return null
      }
      console.log('deleting', item.name)
      return item.delete()
    })
    return Promise.allSettled(promises)
  })
}

// load and cache images under fieldURL (photoURL): { original: '...', t128: '', t256: '', ...}
//  t#{size}
export const loadImageWithCache = async (
  record: Record<string, any>,
  id: string,
  dbPath: string,
  field: string,
  isPartOfArray: boolean = false,
  save: boolean = true,
  sizes: number[] = [128, 256, 512, 1024, 2048],
  force: boolean = false,
): Promise<any> => {
  if (!id) {
    throw new Error('invalid id')
  }
  if (!dbPath) {
    throw new Error('invalid dbPath')
  }
  if (!record[field]) {
    throw new Error(`Missing value ${field}`);
  }
  // console.log('loadImageWithCache', field, record[field + 'URL'])

  if (!force && record[field + 'URL']) {
    const pendingSizes = sizes.filter((s) => !record[field + 'URL'][`t${s}`]);
    if (pendingSizes.length < 1) {
      // console.log('loadImageWithCache skipping', field)
      return record[field + 'URL'];
    }
    console.log('loadImageWithCache found missing', field, pendingSizes)
  }
  if (record[field]) {
    console.log('loadImageWithCache', id, dbPath, field, record[field])
    let imageURLs: Record<string, string | null> = { original: null }

    let imgPath = record[field]
    let dirPath = imgPath.substring(0, imgPath.lastIndexOf('/'))
    let fileName = imgPath.split(/(\\|\/)/g).pop()

    let loads = [
      loadImageURLOrEmpty(imgPath)
        .then((imageURL) => {
          imageURLs.original = imageURL
          // console.log('imageURLs', imageURLs)
        })
        .catch((e) => { }),
    ]

    // Wait backend generate other sizes first
    await delay(2500)

    for (let c = 0; c < sizes.length; c++) {
      loads.push(
        loadImageURLOrEmpty(dirPath + '/thumb@' + sizes[c] + '_' + fileName)
          .then((imageURL) => {
            imageURLs['t' + sizes[c]] = imageURL
          })
          .catch((e) => { })
      )
    } // each sizes
    await Promise.all(loads)

    // console.log('xximageURLs', path, imageURLs)
    // record[field + 'URL'] = imageURLs
    if (save) {
      let rowRef = firebase.firestore().doc(dbPath)
      if (isPartOfArray) {
        let update: Record<string, any> = {}

        // Add photoURLs for different res
        update[field + 'URLs'] =
          firebase.firestore.FieldValue.arrayUnion(imageURLs)

        // Add photos for original photo link array
        update[field + 's'] = firebase.firestore.FieldValue.arrayUnion(fileName)

        await rowRef.update(update)
      } else {
        let update: Record<string, any> = {}
        update[field + 'URL'] = imageURLs
        console.log('loadedimage', update[field + 'URL'])
        await rowRef.update(update)
      }
    }

    return imageURLs
  }

  return null
}

interface UploadParam {
  field: string
  name: string
  file: File
  uid: string
}

interface UploadResult {
  path: string
  url: string
}

export const uploadFile = async (
  rootPath: string,
  p: UploadParam
): Promise<any> => {
  let file = p.file
  let storage = firebase.storage()
  let ref = storage.ref()
  let uid = p.uid

  const filePath = `${rootPath}/${uid}`

  let uploadPath = filePath + '/' + parseCleanFilename(p.name)
  console.log('uploadpath', uploadPath)
  let uploadRef = ref.child(uploadPath)

  // await storageDeleteAll(filePath, []).catch((err) => {
  //   console.error('deleteall failed', err)
  //   throw err
  // })

  let snap = await uploadRef.put(file).catch((e) => {
    console.error('unable to upload', e)
    throw e
  })
  console.log('Uploaded a blob or file!', snap)
  let pathRef = firebase.firestore().doc(filePath)
  let record = (await pathRef.get()).data() || {}

  // if (record[p.field]) {
  //   let oldPath = record[p.field]
  //   let oldUploadRef = ref.child(oldPath)
  //   console.log('old', oldUploadRef, oldPath)
  //   try {
  //     if (oldPath !== uploadPath) {
  //       await oldUploadRef.delete()
  //     } else {
  //       console.log('same name, skipping delete')
  //     }
  //   } catch (e) {
  //     console.error('unable to delete file', oldPath, e)
  //   }
  // }

  // let update: Record<string, any> = {}
  // update[p.field] = uploadPath
  // update[p.field + 'URL'] = null
  record[p.field] = uploadPath
  record[p.field + 'URL'] = null
  // await pathRef.update(update)
  // console.log('update', uid, update)

  const urls = await loadImageWithCache(
    record,
    uid,
    filePath,
    p.field,
    true,
    true,
    p.name
  )

  return { path: uploadPath, url: <string>urls }
}
