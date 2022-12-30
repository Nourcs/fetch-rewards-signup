import * as firebase from 'firebase/app';
import { getAuth } from 'firebase/auth';

const config = {
  apiKey: 'AIzaSyAvk3gPOLWlhXqewmW_jVTbfncVME3NEAc',
  authDomain: 'assessments-9f91d.firebaseapp.com',
  projectId: 'assessments-9f91d',
  storageBucket: 'assessments-9f91d.appspot.com',
  messagingSenderId: '85442453367',
  appId: '1:85442453367:web:5422b47c9f6c302ae40b72',
  measurementId: 'G-NNEX77F8S8',
};

const app = firebase.getApps().length ? firebase.getApp() : firebase.initializeApp(config);

export default app;
export const auth = getAuth(app);
