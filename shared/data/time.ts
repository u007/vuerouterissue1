import { format, parseISO } from 'date-fns'
import firebase from 'firebase/app'
import * as moment from 'moment'
import { formats } from '~/shared/general'

export const dateFormat = (
  illegibleDate: string | Date | firebase.firestore.Timestamp | any,
  formatType?: string
): string | null => {
  if (!illegibleDate) {
    return null
  }

  let date: Date | null = null
  if (typeof illegibleDate === 'string') {
    date = parseISO(illegibleDate)
  } else if (typeof illegibleDate === 'number') {
    date = new Date(illegibleDate)
  } else {
    if (illegibleDate instanceof Date) {
      date = illegibleDate
    } else if (illegibleDate instanceof firebase.firestore.Timestamp) {
      date = illegibleDate.toDate()
    } else if (moment.isMoment(illegibleDate)) {
      date = illegibleDate.toDate()
    } else if (illegibleDate.toDate) {
      date = illegibleDate.toDate()
    } else if (illegibleDate._seconds) {
      const t = new Date(1970, 0, 1)
      t.setSeconds(illegibleDate._seconds)
      date = t // Epoch
    } else {
      console.log('unknown', illegibleDate)
    }
  }
  if (date === null) {
    return null
  }
  // console.log('time?', date.getTime())
  try {
    if (formatType === 'date') {
      return format(date, formats.date)
    }

    return format(date, formats.dateTime)
  } catch (err) {
    console.error(
      'invalid date?',
      illegibleDate,
      illegibleDate?.constructor?.name,
      err
    )
    return null
  }
}