import 'firebase/functions'
import firebase from 'firebase/app'
import { region } from '../general'
// call backend function

export const callFunc = async(name: string, params: any): Promise<any> => {
  let callFunction = firebase
      .app()
      .functions(region)
      .httpsCallable(name)
  console.log('callfunc', name, params)
  return callFunction(params)
}
