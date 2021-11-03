import firebase from 'firebase/app'
import { encode as firebaseKeyEncode } from 'firebase-key-encode';

export const parseCleanFilename = (value: any) => {
  if (value === undefined || value === null) {
    return value;
  }
  const name = firebaseKeyEncode(value);
  return name.split('%2E').join('.');
}