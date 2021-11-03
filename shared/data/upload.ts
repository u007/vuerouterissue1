import { dataSaveSingle, RootStateType } from '~/shared/data/save';
// import { PhotoURL } from './../models/photo_url';
import { defineStore } from 'pinia'
import firebase from 'firebase/app'
import { loadImageURLOrEmpty, loadImageWithCache, storageDeleteAll } from '~/shared/image'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import BaseModel from '~/models/base'
import { PhotoURL } from '~/models/photo_url'
import { sleep } from '../time';
import { parseCleanFilename } from '../firebase';
import delay from '~/helpers/delay';

interface UploadParam {
  field: string
  name: string
  file: File
}

interface UploadResult {
  path: string
  ref: firebase.storage.Reference
}

export const saveUpload = async<T>(rootState: RootStateType, model: BaseModel,
  data: Record<string, any>, id: string, upload: UploadParam): Promise<{ record: T, path: string, url: PhotoURL }> => {
  if (id === undefined || id === null || id === '') {
    throw new Error(`Invalid ${model.label || model.table} id`);
  }
  const res = await uploadAndGenerateThumb(model, data, id, upload);
  console.log('upload and generated thumb', upload, res);
  const saveRes = await dataSaveSingle<T>(rootState, model, {
    ...data,
    [upload.field]: res.path,
    [upload.field + 'URL']: res.url
  });

  console.log('saveUpload', saveRes);

  if (saveRes === null) {
    throw new Error(`upload failed`)
  }

  return {
    record: saveRes,
    path: res.path,
    url: res.url
  }
}

export const uploadAndGenerateThumb = async (model: BaseModel, data: Record<string, any>,
  id: string, upload: UploadParam): Promise<{ path: string, url: PhotoURL }> => {
  if (!model.table) {
    throw new Error('Model table missing');
  }
  const prefix = model.table + "/" + id + '/' + upload.field;
  const res = await uploadFile(prefix, id, upload);
  data[upload.field] = res.path
  data[upload.field + 'URL'] = undefined
  await sleep(5000);
  const urls = await getImageThumbs(id, data[upload.field],
    data[upload.field + 'URL'],
    model.table + '/' + id + '/' + upload.field,
    upload.field);
  return { path: res.path, url: urls };
}

export const getImageThumbs = async (
  id: string,
  filePath: string,
  urls: PhotoURL,// existing urls
  path: string,
  field: string,
  sizes: number[] = [128, 256, 512, 1024, 2048]
): Promise<any> => {
  if (!id) {
    throw new Error('invalid id')
  }
  if (!filePath) {
    throw new Error(`image missing`);
  }

  if (urls) {
    const pendingSizes = sizes.filter((s) => !urls[`t${s}`]);
    if (pendingSizes.length < 1) {
      // console.log('loadImageWithCache skipping', field)
      return urls;
    }
  }

  console.log('getImageThumbs', id, path, field, filePath);
  let imageURLs: Record<string, string | null> = { original: null }

  const loads: Promise<any>[] = []
  let dirPath = filePath.substring(0, filePath.lastIndexOf('/'))
  let fileName = filePath.split(/(\\|\/)/g).pop()
  if (!urls || !urls.original) {
    console.log('getImageThumbs', id, 'loading original');
    loads.push(loadImageURLOrEmpty(filePath).then((url) => imageURLs.original = url).catch((e) => { console.error('getImageThumbs failed', 'original', e) }));
  }

  for (let c = 0; c < sizes.length; c++) {
    const thumbName = `t${sizes[c]}`;
    if (!urls || !urls[thumbName]) {
      console.log('getImageThumbs', id, 'loading', thumbName);
      loads.push(
        loadImageURLOrEmpty(dirPath + '/thumb@' + sizes[c] + '_' + fileName)
          .then((imageURL) => {
            imageURLs[thumbName] = imageURL
          })
          .catch((e) => { console.error('getImageThumbs failed', thumbName, e) })
      );
    }
  } // each sizes
  await Promise.all(loads);
  console.log('getImageThumbs imageURLS', imageURLs);

  return imageURLs
}

export const uploadFile = async (
  pathPrefix: string,
  id: string,
  p: UploadParam
): Promise<UploadResult> => {
  let file = p.file
  let storage = firebase.storage()
  let ref = storage.ref()
  const fileName = parseCleanFilename(p.name)
  let uploadPath = pathPrefix + '/' + fileName
  // console.log('uploadpath', uploadPath)
  let uploadRef = ref.child(uploadPath)
  await storageDeleteAll(pathPrefix, []).catch((err) => {
    console.error('deleteall failed', err)
    throw err
  });

  console.log('uploadFile', uploadPath, file);
  let snap = await uploadRef.put(file).catch((e) => {
    console.error('unable to upload', e)
    throw e
  });
  console.log('uploadFile uploaded!', uploadPath, snap);
  return { path: uploadPath, ref: uploadRef };
}
