// eslint-disable-next-line @typescript-eslint/no-unused-vars
import firebase from 'firebase';

declare global {
  // eslint-disable-next-line no-redeclare, @typescript-eslint/no-use-before-define
  export const firebase = firebase;
}
