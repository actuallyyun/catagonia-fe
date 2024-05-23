// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA_-yEAoProdBZuSsL2rTndSlYdGEfi1qc',
  authDomain: 'catagonia-776e4.firebaseapp.com',
  projectId: 'catagonia-776e4',
  storageBucket: 'catagonia-776e4.appspot.com',
  messagingSenderId: '301419302215',
  appId: '1:301419302215:web:bdcb6b6f5ff526578e9062',
  measurementId: 'G-5KD3KE4TBJ'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
