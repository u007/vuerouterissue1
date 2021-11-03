import { parseISO } from "date-fns"

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export type TimeableType = {
  createdAt: Date
  updatedAt: Date
}

