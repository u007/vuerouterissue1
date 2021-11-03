import { ObjectId } from 'bson'
import moment from 'moment'
import { pickBy } from 'lodash'
import firebase from 'firebase/app'
import { FetchTableParam } from './shared'
import { dataPreProcess } from './get'
import { StandardError } from '~/errors/base'
import { differences } from '~/shared/diff'
import { pagination, parseFormForServer, region } from '~/shared/general'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import BaseModel from '~/models/base'

export enum Sort {
  Asc = 'Asc',
  Desc = 'Desc'
}
export interface SortParam {
  field: string
  dir: string
}

export interface fetchListParam<T> {
  page: number;
  limit: number;
  sorts: SortParam[],
  filters?: Record<string, any>,
  onRow?: (row: any, index: number) => Promise<T>
};

export type fetchListResult = {
  list: any[]
  page: number
  limit: number
  count: number
}

interface ListParam {
  page?: number
  limit?: number
  sorts?: SortParam[]
  filters?: Record<string, any>
  startAfter?: any
}

interface UpdateParam {
  name: string
  value: [string, number, object]
}

/**
 * fetch list
 * @param table either tablename as string or { funcName: fetchXXX }
 * @param p
 * @returns
 */
export const dataFetchList = async <T>(model: BaseModel, p: fetchListParam<T>): Promise<fetchListResult> => {
  // console.log('fetching', table, p)

  const limit = (p.limit ? p.limit : pagination.limit) || 20
  const page = p.page || 1
  const offset = (page - 1) * limit
  const table = model.table
  const funcName: string = 'fetch' + table[0].toUpperCase() + table.substring(1)
  const callFunction = firebase
    .app()
    .functions(region)
    .httpsCallable(funcName)
  console.log('psorts', p.sorts)
  // const sorts = (p.sorts || []).map((s) => { ...s, dir: s.dir === 'asc' })
  const fetchParams = {
    limit,
    page,
    filters: p.filters,
    sorts: p.sorts
  }
  console.log('fetching', table, fetchParams)
  let res = await callFunction(fetchParams)

  // console.log('res', res)
  let list: any[] = []

  for (let c = 0; c < res.data.list.length; c++) {
    let child = res.data.list[c]
    // console.log('looplist', child)
    let row = await dataPreProcess(model, child.uid, { ...child, _id: child.uid, id: child.uid })

    if (p.onRow) {
      row = await p.onRow(row, c)
    }
    list.push(row)
  }

  console.log('result', fetchParams, res.data)
  return {
    list,
    page: res.data.page,
    limit: res.data.limit,
    count: res.data.count
  }
}
